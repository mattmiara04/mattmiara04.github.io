//API KEY
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";
//Fetch
async function fetchExercises(muscle) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
      headers: { 'X-Api-Key': API_KEY }
    });
//Error Handling    
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
//Display
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

//Search
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

/*******************************/
/* NEW INSTRUCTIONS PAGE CODE  */
/*******************************/

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

// Display exercise details on instructions page
function displayExerciseDetails(exercise) {
  document.getElementById('ex-name').textContent = exercise.name;
  document.getElementById('ex-type').textContent = exercise.type || 'N/A';
  document.getElementById('ex-equipment').textContent = exercise.equipment || 'N/A';
  document.getElementById('ex-muscle').textContent = exercise.muscle.replace('_', ' ') || 'N/A';
  
  const instructionsList = document.getElementById('ex-instructions');
  if (exercise.instructions) {
    const steps = exercise.instructions.split('\n').filter(step => step.trim());
    instructionsList.innerHTML = steps.map(step => `<li>${step}</li>`).join('');
  } else {
    instructionsList.innerHTML = '<li>No specific instructions available.</li>';
  }
}

// Load exercise when on instructions page
async function loadExerciseDetails() {
  const params = new URLSearchParams(window.location.search);
  const exerciseName = params.get('name');
  
  if (!exerciseName) {
    document.getElementById('exercise-container').innerHTML = `
      <div class="alert alert-danger">
        No exercise selected. Please choose an exercise from the planner.
      </div>
    `;
    return;
  }

  try {
    const allExercises = await fetchAllExercises();
    const exercise = allExercises.find(ex => ex.name === exerciseName);
    
    if (exercise) {
      displayExerciseDetails(exercise);
    } else {
      document.getElementById('exercise-container').innerHTML = `
        <div class="alert alert-danger">
          Exercise not found. It may have been removed.
        </div>
      `;
    }
  } catch (error) {
    document.getElementById('exercise-container').innerHTML = `
      <div class="alert alert-danger">
        Failed to load exercise details. Please try again later.
      </div>
    `;
    console.error('Error loading exercise:', error);
  }
}

// Initialize instructions page if needed
if (window.location.pathname.includes('instructions.html')) {
  loadExerciseDetails();
}
