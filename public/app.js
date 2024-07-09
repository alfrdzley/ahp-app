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
      loadPrograms();
    }
  });

async function loadPrograms() {
  const response = await fetch("/programs");
  const programs = await response.json();

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

  const maxScore = Math.max(...scores);
  const bestProgramIndex = scores.indexOf(maxScore);
  const bestProgramName = names[bestProgramIndex];

  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
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
}

loadPrograms();
