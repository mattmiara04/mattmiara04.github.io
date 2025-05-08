/* ========== API CONFIGURATION ========== */
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m"; // Double-check this key

/* ========== CORE FUNCTIONS ========== */
async function fetchExercises(muscle) {
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
            method: 'GET',
            headers: { 
                'X-Api-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${muscle} exercises:`, error);
        throw new Error(`Failed to fetch exercises: ${error.message}`);
    }
}

/* ========== VALID MUSCLE GROUPS ========== */
const VALID_MUSCLES = {
    'chest': 'chest',
    'back': 'lats', // API uses 'lats' for back
    'shoulders': 'delts', // API may use 'delts' or 'shoulders'
    'biceps': 'biceps',
    'triceps': 'triceps',
    'legs': 'quadriceps' // Using quads as primary leg muscle
};

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
            <p>Muscle: ${ex.muscle}</p>
            <p>Type: ${ex.type}</p>
            <p>Equipment: ${ex.equipment}</p>
        </div>
    `).join('');
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.toggle('d-none', !message);
    }
}

/* ========== MAIN FUNCTION ========== */
async function searchExercises() {
    showError('');
    
    const muscleSelect = document.getElementById('muscle-select');
    const muscleKey = muscleSelect.value;
    
    if (!muscleKey) {
        showError('Please select a muscle group');
        return;
    }

    // Map UI selection to API parameter
    const apiMuscleParam = VALID_MUSCLES[muscleKey] || muscleKey;
    
    try {
        const exercises = await fetchExercises(apiMuscleParam);
        
        if (!exercises?.length) {
            showError(`No exercises found for ${muscleKey}`);
            return;
        }
        
        displayExercises(exercises);
    } catch (error) {
        showError('Exercise data unavailable. Please try again later.');
        console.error('Search failed:', error);
    }
}
