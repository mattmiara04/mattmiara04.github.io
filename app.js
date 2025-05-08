// API Configuration
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";
const API_URL = "https://api.api-ninjas.com/v1/exercises";

// DOM Elements
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error-message');
const exerciseContainer = document.getElementById('exercise-container');
const loadingSpinner = document.getElementById('loading-spinner');

// Helper Functions
function showLoading(show = true) {
    if (loadingSpinner) loadingSpinner.style.display = show ? 'block' : 'none';
}

function showError(message = '') {
    if (errorDiv) {
        errorDiv.innerHTML = message ? `<div class="alert alert-warning">${message}</div>` : '';
        errorDiv.style.display = message ? 'block' : 'none';
    }
}

// API Functions (using your preferred methods)
async function fetchExercises(muscle) {
    showLoading(true);
    try {
        const response = await fetch(`${API_URL}?muscle=${muscle}`, {
            headers: { 'X-Api-Key': API_KEY }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch ${muscle}:`, error);
        showError('Failed to load exercises. Please try again.');
        return [];
    } finally {
        showLoading(false);
    }
}

async function fetchBackExercises() {
    const [lats, lowerBack, middleBack, traps] = await Promise.all([
        fetchExercises("lats"),
        fetchExercises("lower_back"),
        fetchExercises("middle_back"),
        fetchExercises("traps")
    ]);
    return [...lats, ...lowerBack, ...middleBack, ...traps];
}

async function fetchLegExercises() {
    const [quads, hams, calves, glutes] = await Promise.all([
        fetchExercises("quadriceps"),
        fetchExercises("hamstrings"),
        fetchExercises("calves"),
        fetchExercises("glutes")
    ]);
    return [...quads, ...hams, ...calves, ...glutes];
}

async function fetchAllExercises() {
    const allMuscles = [
        'chest', 'lats', 'lower_back', 'middle_back', 'traps',
        'quadriceps', 'hamstrings', 'calves', 'glutes',
        'biceps', 'triceps', 'shoulders'
    ];
    const allResults = await Promise.all(allMuscles.map(muscle => fetchExercises(muscle)));
    return allResults.flat();
}

// Display Functions (with your original styling)
function displayExercises(exercises) {
    if (!exercises || exercises.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-warning">No exercises found</div>';
        return;
    }

    resultsDiv.innerHTML = exercises.map(ex => `
        <div class="exercise" 
             onclick="window.location='instructions.html?name=${encodeURIComponent(ex.name)}'"
             style="background: #252525; padding: 15px; margin: 10px 0; border-radius: 8px; cursor: pointer;">
            <h4 style="color: #ff0000">${ex.name}</h4>
            <p>Muscle: ${ex.muscle.replace(/_/g, ' ')}</p>
            <p>Type: ${ex.type}</p>
            <p>Equipment: ${ex.equipment}</p>
        </div>
    `).join('');
}

function displayExerciseDetails(exercise) {
    exerciseContainer.innerHTML = `
        <h2 style="color: #ff0000">${exercise.name}</h2>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Type:</strong> ${exercise.type || 'N/A'}</p>
                <p><strong>Equipment:</strong> ${exercise.equipment || 'N/A'}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Muscle:</strong> <span class="badge" style="background: #ff0000">${
                    exercise.muscle.replace(/_/g, ' ') || 'N/A'
                }</span></p>
            </div>
        </div>
        <hr>
        <h4>Instructions</h4>
        <ol>${exercise.instructions 
            ? exercise.instructions.split('\n').map(step => `<li>${step}</li>`).join('') 
            : '<li>No instructions available</li>'}
        </ol>
    `;
}

// Main Functions
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

async function loadExerciseDetails() {
    try {
        showLoading(true);
        const params = new URLSearchParams(window.location.search);
        const exerciseName = params.get('name');

        if (!exerciseName) {
            exerciseContainer.innerHTML = '<div class="alert alert-danger">No exercise selected</div>';
            return;
        }

        const allExercises = await fetchAllExercises();
        const exercise = allExercises.find(ex => ex.name === exerciseName);
        
        if (exercise) {
            displayExerciseDetails(exercise);
        } else {
            exerciseContainer.innerHTML = '<div class="alert alert-danger">Exercise not found</div>';
        }
    } catch (error) {
        exerciseContainer.innerHTML = '<div class="alert alert-danger">Failed to load details</div>';
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
}

// Initialize
if (window.location.pathname.includes('instructions.html')) {
    loadExerciseDetails();
}

// Global functions
window.searchExercises = searchExercises;
window.loadExerciseDetails = loadExerciseDetails;
