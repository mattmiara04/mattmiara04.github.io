const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

document.getElementById('search-btn').addEventListener('click', async () => {
  const muscle = document.getElementById('muscle-select').value;
  if (!muscle) return alert("Please select a muscle group!");
  
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
      headers: { 'X-Api-Key': API_KEY }
    });
    const exercises = await response.json();
    displayExercises(exercises);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to fetch. Check console.");
  }
});

function displayExercises(exercises) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = exercises.map(ex => `
    <div class="exercise" style="
      background: #252525;
      padding: 15px;
      margin: 10px 0;
      border-radius: 8px;
    ">
      <h4 style="color: #ff0000">${ex.name}</h4>
      <p>Type: ${ex.type}</p>
      <p>Equipment: ${ex.equipment}</p>
    </div>
  `).join('');
}
