/* ========== CONSTANTS AND DOM ELEMENTS ========== */
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";
const errorMsg = document.getElementById('error-message');

/* ========== API FUNCTIONS ========== */
async function fetchExercises(muscle) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
      headers: { 'X-Api-Key': API_KEY }
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
    
  } catch (error) {
    console.error(`Failed to fetch ${muscle}:`, error);
    throw error;
  }
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
      <p>Type: ${ex.type}</p>
      <p>Equipment: ${ex.equipment}</p>
    </div>
  `).join('');
}

function showError(message = '') {
  const errorMsg = document.getElementById('error-message');
  errorMsg.textContent = message;
  message ? errorMsg.classList.remove('d-none') 
          : errorMsg.classList.add('d-none');
}

/* ========== MAIN FUNCTION ========== */
async function searchExercises() {
  showError(); // Clear previous errors
  
  const muscle = document.getElementById('muscle-select').value;
  
  // Input validation
  if (!muscle) {
    showError('Please select a muscle group');
    return;
  }

  try {
    const exercises = await fetchExercises(muscle);
    
    // Results validation
    if (!exercises?.length) {
      showError(`No exercises found for ${muscle}`);
      return;
    }
    
    displayExercises(exercises);
    
  } catch (error) {
    showError('Failed to fetch exercises. Please try again.');
    console.error('Search error:', error);
  }
}
