// Secure configuration object (uses JSON concepts)
const config = {
  api: {
    baseUrl: "https://api.api-ninjas.com/v1/exercises",
    key: "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m" // In production, load from environment variables
  }
};

// DOM Elements
const elements = {
  results: document.getElementById('results'),
  errorMessage: document.getElementById('error-message'),
  exerciseContainer: document.getElementById('exercise-container')
};

// ======================
// CORE API FUNCTIONS
// ======================

/**
 * Fetches exercises for a specific muscle group
 * @param {string} muscle - Target muscle group
 * @returns {Promise<Array>} - Array of exercises or empty array on error
 */
async function fetchExercises(muscle) {
  if (!muscle) return Promise.reject("No muscle group specified");

  const options = {
    method: 'GET',
    headers: { 
      'X-Api-Key': config.api.key,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await fetch(`${config.api.baseUrl}?muscle=${muscle}`, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${muscle}:`, error);
    throw error; // Re-throw for calling functions to handle
  }
}

/**
 * Fetches multiple muscle groups in parallel
 * @param {Array<string>} muscles - Array of muscle groups
 * @returns {Promise<Array>} - Combined exercises
 */
async function fetchMuscleGroup(muscles) {
  try {
    const promises = muscles.map(muscle => fetchExercises(muscle));
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error("Failed to fetch muscle group:", error);
    return [];
  }
}

// ======================
// SPECIALIZED FETCHERS
// ======================

async function fetchBackExercises() {
  return fetchMuscleGroup(["lats", "lower_back", "middle_back", "traps"]);
}

async function fetchLegExercises() {
  return fetchMuscleGroup(["quadriceps", "hamstrings", "calves", "glutes"]);
}

// ======================
// DISPLAY FUNCTIONS
// ======================

function showLoading(show = true) {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = show ? 'block' : 'none';
}

function showError(message = '') {
  if (elements.errorMessage) {
    elements.errorMessage.innerHTML = message 
      ? `<div class="alert alert-danger">${message}</div>` 
      : '';
    elements.errorMessage.style.display = message ? 'block' : 'none';
  }
}

function displayExercises(exercises) {
  if (!elements.results) return;

  if (!exercises || exercises.length === 0) {
    elements.results.innerHTML = '<div class="alert alert-warning">No exercises found</div>';
    return;
  }

  elements.results.innerHTML = exercises.map(ex => `
    <div class="exercise" onclick="window.location='instructions.html?name=${encodeURIComponent(ex.name)}'"
      style="background: #252525; padding: 15px; margin: 10px 0; border-radius: 8px; cursor: pointer;">
      <h4 style="color: #ff0000">${ex.name}</h4>
      <p>Muscle: ${ex.muscle.replace('_', ' ')}</p>
      <p>Type: ${ex.type}</p>
      <p>Equipment: ${ex.equipment}</p>
    </div>
  `).join('');
}

function displayExerciseDetails(exercise) {
  if (!elements.exerciseContainer) return;

  elements.exerciseContainer.innerHTML = `
    <h2 class="exercise-title">${exercise.name}</h2>
    <div class="row">
      ${Object.entries(exercise)
        .filter(([key]) => !['instructions', 'name'].includes(key))
        .map(([key, value]) => `
          <div class="col-md-6">
            <p><strong>${key.replace('_', ' ')}:</strong> ${value || 'N/A'}</p>
          </div>
        `).join('')}
    </div>
    <hr>
    <h4>Instructions</h4>
    <ol>${exercise.instructions?.split('\n').map(step => `<li>${step}</li>`).join('') || '<li>No instructions available</li>'}</ol>
  `;
}

// ======================
// EVENT HANDLERS
// ======================

async function searchExercises() {
  showError();
  showLoading(true);

  try {
    const muscleKey = document.getElementById('muscle-select')?.value;
    
    if (!muscleKey) {
      throw new Error('Please select a muscle group');
    }

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
    showError(error.message || 'Failed to load exercises. Please try again.');
    console.error('Search error:', error);
  } finally {
    showLoading(false);
  }
}

async function loadExerciseDetails() {
  showLoading(true);
  
  try {
    const params = new URLSearchParams(window.location.search);
    const exerciseName = params.get('name');

    if (!exerciseName) {
      throw new Error('No exercise selected');
    }

    const allExercises = await fetchAllExercises();
    const exercise = allExercises.find(ex => ex.name === exerciseName);
    
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    displayExerciseDetails(exercise);
  } catch (error) {
    if (elements.exerciseContainer) {
      elements.exerciseContainer.innerHTML = `
        <div class="alert alert-danger">${error.message}</div>
      `;
    }
    console.error('Error loading exercise:', error);
  } finally {
    showLoading(false);
  }
}

// ======================
// INITIALIZATION
// ======================

if (window.location.pathname.includes('instructions.html')) {
  loadExerciseDetails();
}

// Helper function to fetch all exercises (used for search)
async function fetchAllExercises() {
  const allMuscles = [
    'chest', 'lats', 'lower_back', 'middle_back', 'traps',
    'quadriceps', 'hamstrings', 'calves', 'glutes',
    'biceps', 'triceps', 'shoulders'
  ];
  
  return fetchMuscleGroup(allMuscles);
}
