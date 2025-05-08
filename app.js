/* ========== API CONFIGURATION ========== */
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

/* ========== MUSCLE GROUP MAPPING ========== */
const MUSCLE_GROUPS = {
  // Single muscle groups
  chest: ['chest'],
  biceps: ['biceps'],
  triceps: ['triceps'],
  shoulders: ['delts'],
  
  // Combined back muscles
  back: ['lats', 'lower_back', 'middle_back', 'traps'],
  
  // Combined leg muscles
  legs: ['quadriceps', 'hamstrings', 'calves', 'glutes']
};

/* ========== CORE FUNCTIONS ========== */
async function fetchExercises(muscle) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
      headers: { 'X-Api-Key': API_KEY }
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${muscle}:`, error);
    return [];
  }
}

// Fixed version for back exercises
async function fetchBackExercises() {
  const [lats, lower, middle, traps] = await Promise.all([
    fetchExercises("lats"),
    fetchExercises("lower_back"),
    fetchExercises("middle_back"),
    fetchExercises("traps")
  ]);
  return [].concat(lats, lower, middle, traps);
}

// Fixed version for leg exercises
async function fetchLegExercises() {
  const [quads, hams, calves, glutes] = await Promise.all([
    fetchExercises("quadriceps"),
    fetchExercises("hamstrings"),
    fetchExercises("calves"),
    fetchExercises("glutes")
  ]);
  return [...quads, ...hams, ...calves, ...glutes];
}

/* ========== UI FUNCTIONS ========== */
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
      <p>Muscle: ${ex.muscle.replace('_', ' ')}</p>
      <p>Type: ${ex.type}</p>
      <p>Equipment: ${ex.equipment}</p>
    </div>
  `).join('');
}

function showError(message = '') {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.toggle('d-none', !message);
  }
}

/* ========== MAIN FUNCTION ========== */
async function searchExercises() {
  showError();
  
  const muscleKey = document.getElementById('muscle-select').value;
  if (!muscleKey) {
    showError('Please select a muscle group');
    return;
  }

  try {
    let exercises = [];
    
    if (muscleKey === 'back') {
      exercises = await fetchBackExercises();
    } else if (muscleKey === 'legs') {
      exercises = await fetchLegExercises();
    } else {
      exercises = await fetchExercises(muscleKey);
    }
    
    if (!exercises.length) {
      showError(`No exercises found for ${muscleKey}`);
      return;
    }
    
    displayExercises(exercises);
  } catch (error) {
    showError('Failed to load exercises. Please try again.');
    console.error('Search error:', error);
  }
}
