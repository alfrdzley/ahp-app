document.getElementById('program-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nama = document.getElementById('nama').value;
  const demand = parseFloat(document.getElementById('demand').value);
  const cost = parseFloat(document.getElementById('cost').value);
  const resources = parseFloat(document.getElementById('resources').value);
  const academic_relevance = parseFloat(document.getElementById('academic_relevance').value);
  const student_interest = parseFloat(document.getElementById('student_interest').value);

  console.log('Adding program:', { nama, demand, cost, resources, academic_relevance, student_interest });

  try {
    const response = await fetch('/programs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nama, demand, cost, resources, academic_relevance, student_interest })
    });

    if (response.ok) {
      showModal('Program added successfully');
      loadPrograms();
      document.getElementById('program-form').reset();
    } else {
      alert('Failed to add program');
    }
  } catch (error) {
    console.error('Error adding program:', error);
  }
});

async function loadPrograms() {
  try {
    const response = await fetch('/programs');
    if (!response.ok) {
      console.error('Failed to load programs', response.status, response.statusText);
      return;
    }

    const programs = await response.json();
    console.log('Programs loaded:', programs);

    displayPrograms(programs);

    const names = programs.map(p => p.nama);
    const scores = programs.map(p => {
      const weights = [0.3, 0.2, 0.2, 0.15, 0.15];
      const values = [p.demand, p.cost, p.resources, p.academic_relevance, p.student_interest];
      return values.reduce((acc, val, i) => acc + (val * weights[i]), 0);
    });

    console.log('Scores:', scores);

    const maxScore = Math.max(...scores);
    const bestProgramIndex = scores.indexOf(maxScore);
    const bestProgramName = names[bestProgramIndex];

    console.log('Initializing Chart.js with data:', { names, scores, bestProgramName });

    const canvas = document.getElementById('myChart');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    console.log('Creating Chart.js instance');
    if (window.myChart instanceof Chart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: names,
        datasets: [{
          label: 'Skor Akhir',
          data: scores,
          backgroundColor: scores.map(score => score === maxScore ? 'red' : 'skyblue')
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: `Program Studi Terbaik: ${bestProgramName}`
          }
        }
      }
    });
    console.log('Chart.js instance created');
  } catch (error) {
    console.error('Error loading programs:', error);
  }
}

function displayPrograms(programs) {
  const programList = document.getElementById('program-list');
  programList.innerHTML = '';
  programs.forEach(program => {
    const programItem = document.createElement('div');
    programItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    programItem.innerHTML = `
      <div>
        <h5 class="mb-1">${program.nama}</h5>
      </div>
      <div class="btn-group">
        <button onclick="viewDetails(${program.id})" class="btn btn-primary">Lihat Detail</button>
        <button onclick="deleteProgram(${program.id})" class="btn btn-danger">Hapus</button>
      </div>
    `;
    programList.appendChild(programItem);
  });
}

async function viewDetails(id) {
  console.log(`Fetching details for program with ID: ${id}`);
  try {
    window.location.href = `/programs/transpose/${id}`;
  } catch (error) {
    console.error(`Error fetching details for program ${id}:`, error);
  }
}

async function deleteProgram(id) {
  console.log(`Preparing to delete program with ID: ${id}`);

  try {
    const response = await fetch(`/programs/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showModal('Program deleted successfully');
      loadPrograms(); // Reload programs after deletion
    } else {
      alert('Failed to delete program');
    }
  } catch (error) {
    console.error(`Error deleting program with ID ${id}:`, error);
  }
}

function showModal(message) {
  const modalBody = document.getElementById('modal-body-text');
  modalBody.textContent = message;
  const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
  confirmationModal.show();
}

loadPrograms();

