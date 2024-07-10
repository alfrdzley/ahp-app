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

    const ctx = document.getElementById("myChart").getContext("2d");
    if (window.myChart) {
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
  } catch (error) {
    console.error("Error loading programs:", error);
  }
}

loadPrograms();
