/* ========== API CONFIGURATION ========== */
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

/* ========== CORE FUNCTIONS ========== */
async function fetchExercises(muscle) {
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
            headers: { 'X-Api-Key': API_KEY }
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${muscle} exercises:`, error);
        throw error;
    }
}

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

/* ========== ERROR HANDLING ========== */
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.toggle('d-none', !message);
    }
}

/* ========== MAIN FUNCTION ========== */
async function searchExercises() {
    // Reset UI
    showError('');
    
    // Get user input
    const muscle = document.getElementById('muscle-select').value;
    
    // Validate input
    if (!muscle) {
        showError('Please select a muscle group');
        return;
    }

    try {
        // Fetch and display exercises
        const exercises = await fetchExercises(muscle);
        
        if (!exercises || exercises.length === 0) {
            showError(`No exercises found for ${muscle}`);
            return;
        }
        
        displayExercises(exercises);
    } catch (error) {
        showError('Failed to load exercises. Please try again later.');
        console.error('Search failed:', error);
    }
}
