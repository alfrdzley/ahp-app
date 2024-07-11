document
  .getElementById("program-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const nama = document.getElementById("nama").value;
    const demand = parseFloat(document.getElementById("demand").value);
    const cost = parseFloat(document.getElementById("cost").value);
    const resources = parseFloat(document.getElementById("resources").value);
    const academic_relevance = parseFloat(
      document.getElementById("academic_relevance").value
    );
    const student_interest = parseFloat(
      document.getElementById("student_interest").value
    );

    console.log("Submitting:", {
      nama,
      demand,
      cost,
      resources,
      academic_relevance,
      student_interest,
    });

    try {
      const response = await fetch("/programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          demand,
          cost,
          resources,
          academic_relevance,
          student_interest,
        }),
      });

      if (response.ok) {
        console.log("Data submitted successfully");
        loadPrograms();
      } else {
        console.error(
          "Failed to submit data",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  });

async function loadPrograms() {
  try {
    const response = await fetch("/programs");
    if (!response.ok) {
      console.error(
        "Failed to load programs",
        response.status,
        response.statusText
      );
      return;
    }

    const programs = await response.json();
    console.log("Programs loaded:", programs);

    displayPrograms(programs);

    const names = programs.map((p) => p.nama);
    const scores = programs.map((p) => {
      const weights = [0.3, 0.2, 0.2, 0.15, 0.15];
      const values = [
        p.demand,
        p.cost,
        p.resources,
        p.academic_relevance,
        p.student_interest,
      ];
      return values.reduce((acc, val, i) => acc + val * weights[i], 0);
    });

    console.log("Scores:", scores);

    const maxScore = Math.max(...scores);
    const bestProgramIndex = scores.indexOf(maxScore);
    const bestProgramName = names[bestProgramIndex];

    console.log("Initializing Chart.js with data:", {
      names,
      scores,
      bestProgramName,
    });

    const canvas = document.getElementById("myChart");
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    console.log("Creating Chart.js instance");
    if (window.myChart instanceof Chart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: names,
        datasets: [
          {
            label: "Skor Akhir",
            data: scores,
            backgroundColor: scores.map((score) =>
              score === maxScore ? "red" : "skyblue"
            ),
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          title: {
            display: true,
            text: `Program Studi Terbaik: ${bestProgramName}`,
          },
        },
      },
    });
    console.log("Chart.js instance created");
  } catch (error) {
    console.error("Error loading programs:", error);
  }
}

function displayPrograms(programs) {
  const programList = document.getElementById("program-list");
  programList.innerHTML = "";
  programs.forEach((program) => {
    const programItem = document.createElement("div");
    programItem.className = "program-item";
    programItem.innerHTML = `
      <span>${program.nama}</span>
      <button onclick="viewDetails('${encodeURIComponent(
        program.nama
      )}')">Lihat Detail</button>
      <button onclick="deleteProgram('${encodeURIComponent(
        program.nama
      )}')">Hapus</button>
    `;
    programList.appendChild(programItem);
  });
}

async function viewDetails(nama) {
  const modal = document.getElementById("detailModal");
  const closeModal = document.getElementById("closeDetailModal");

  console.log(`Fetching details for program: ${nama}`);

  try {
    const response = await fetch(`/programs/${nama}`);
    if (!response.ok) {
      console.error(
        `Failed to fetch details for program ${nama}`,
        response.status,
        response.statusText
      );
      return;
    }
    const program = await response.json();

    console.log(`Details fetched for program ${nama}:`, program);

    document.getElementById("update-nama").value = program.nama;
    document.getElementById("update-demand").value = program.demand;
    document.getElementById("update-cost").value = program.cost;
    document.getElementById("update-resources").value = program.resources;
    document.getElementById("update-academic_relevance").value =
      program.academic_relevance;
    document.getElementById("update-student_interest").value =
      program.student_interest;

    modal.style.display = "block";

    closeModal.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  } catch (error) {
    console.error(`Error fetching details for program ${nama}:`, error);
  }
}

document.getElementById("update-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nama = document.getElementById("update-nama").value;
  const demand = parseFloat(document.getElementById("update-demand").value);
  const cost = parseFloat(document.getElementById("update-cost").value);
  const resources = parseFloat(
    document.getElementById("update-resources").value
  );
  const academic_relevance = parseFloat(
    document.getElementById("update-academic_relevance").value
  );
  const student_interest = parseFloat(
    document.getElementById("update-student_interest").value
  );

  console.log("Updating:", {
    nama,
    demand,
    cost,
    resources,
    academic_relevance,
    student_interest,
  });

  try {
    const response = await fetch(`/programs/${encodeURIComponent(nama)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        demand,
        cost,
        resources,
        academic_relevance,
        student_interest,
      }),
    });

    if (response.ok) {
      console.log("Data updated successfully");
      document.getElementById("detailModal").style.display = "none";
      loadPrograms();
    } else {
      console.error(
        "Failed to update data",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
});

async function deleteProgram(nama) {
  console.log(`Deleting program: ${nama}`);
  try {
    const response = await fetch(`/programs/${encodeURIComponent(nama)}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log(`Program ${nama} deleted successfully`);
      loadPrograms();
    } else {
      console.error(
        `Failed to delete program ${nama}`,
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error(`Error deleting program ${nama}:`, error);
  }
}

loadPrograms();
