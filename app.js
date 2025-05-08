// API KEY
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

// Fetch (GET)
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

// Fetch Back
async function fetchBackExercises() {
  const [latsExercises, lowerBackExercises, middleBackExercises, trapsExercises] = await Promise.all([
    fetchExercises("lats"),
    fetchExercises("lower_back"),
    fetchExercises("middle_back"),
    fetchExercises("traps")
  ]);
  return [...latsExercises, ...lowerBackExercises, ...middleBackExercises, ...trapsExercises];
}

// Fetch Leg
async function fetchLegExercises() {
  const [quadsExercises, hamsExercises, calvesExercises, glutesExercises] = await Promise.all([
    fetchExercises("quadriceps"),
    fetchExercises("hamstrings"),
    fetchExercises("calves"),
    fetchExercises("glutes")
  ]);
  return [...quadsExercises, ...hamsExercises, ...calvesExercises, ...glutesExercises];
}

// Display
function displayExercises(exercises) {
  const resultsDiv = document.getElementById('results');
  
  if (!exercises || exercises.length === 0) {
    resultsDiv.innerHTML = '<div class="alert alert-warning">No exercises found</div>';
    return;
  }

  resultsDiv.innerHTML = exercises.map(ex => `
    <div class="exercise" onclick="window.location='instructions.html?name=${encodeURIComponent(ex.name)}'"
      style="background: #252525; padding: 15px; margin: 10px 0; border-radius: 8px; cursor: pointer;">
      <h4 style="color: #ff0000">${ex.name}</h4>
      <p>Muscle: ${ex.muscle.replace('_', ' ')}</p>
      <p>Type: ${ex.type}</p>
      <p>Equipment: ${ex.equipment}</p>
    </div>
  `).join('');
}

// Error Handling
function showError(message = '') {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.innerHTML = message ? `<div class="alert alert-danger">${message}</div>` : '';
    errorDiv.style.display = message ? 'block' : 'none';
  }
}

// Search
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
    
    displayExercises(exercises);
  } catch (error) {
    showError('Failed to load exercises. Please try again.');
    console.error('Search error:', error);
  }
}

// Fetch all exercises for instructions page
async function fetchAllExercises() {
  const allMuscles = [
    'chest', 'lats', 'lower_back', 'middle_back', 'traps',
    'quadriceps', 'hamstrings', 'calves', 'glutes',
    'biceps', 'triceps', 'shoulders'
  ];
  
  const allPromises = allMuscles.map(muscle => fetchExercises(muscle));
  const allResults = await Promise.all(allPromises);
  return allResults.flat();
}

// Display exercise details
function displayExerciseDetails(exercise) {
  document.getElementById('ex-name').textContent = exercise.name;
  document.getElementById('ex-type').textContent = exercise.type || 'N/A';
  document.getElementById('ex-equipment').textContent = exercise.equipment || 'N/A';
  document.getElementById('ex-muscle').textContent = exercise.muscle.replace('_', ' ') || 'N/A';
  
  const instructionsList = document.getElementById('ex-instructions');
  instructionsList.innerHTML = exercise.instructions 
    ? exercise.instructions.split('\n').map(step => `<li>${step}</li>`).join('')
    : '<li>No instructions available</li>';
}

// Load exercise details
async function loadExerciseDetails() {
  const params = new URLSearchParams(window.location.search);
  const exerciseName = params.get('name');

  if (!exerciseName) {
    document.getElementById('exercise-container').innerHTML = 
      '<div class="alert alert-danger">No exercise selected</div>';
    return;
  }

  try {
    const allExercises = await fetchAllExercises();
    const exercise = allExercises.find(ex => ex.name === exerciseName);
    
    if (exercise) {
      displayExerciseDetails(exercise);
    } else {
      document.getElementById('exercise-container').innerHTML = 
        '<div class="alert alert-danger">Exercise not found</div>';
    }
  } catch (error) {
    document.getElementById('exercise-container').innerHTML = 
      '<div class="alert alert-danger">Failed to load details</div>';
    console.error('Error:', error);
  }
}

// Initialize
if (window.location.pathname.includes('instructions.html')) {
  loadExerciseDetails();
}
