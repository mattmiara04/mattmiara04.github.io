const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

// 1. Fetches exercises for a single muscle
async function fetchExercises(muscle) {
  const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
    headers: { 'X-Api-Key': API_KEY }
  });
  return await response.json();
}

// 2. Combines all back muscle exercises
async function getBackExercises() {
  const lats = await fetchExercises("lats");
  const lower = await fetchExercises("lower_back");
  const middle = await fetchExercises("middle_back");
  const traps = await fetchExercises("traps");
  return lats.concat(lower, middle, traps);
}

// 3. Displays exercises (unchanged)
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

// 4. Main search function called via onclick
async function searchExercises() {
  const muscle = document.getElementById('muscle-select').value;
  if (!muscle) {
    alert("Please select a muscle group!");
    return;
  }

  try {
    const exercises = muscle === "back" 
      ? await getBackExercises() 
      : await fetchExercises(muscle);
    displayExercises(exercises);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to fetch exercises. Check console.");
  }
}
