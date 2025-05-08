// API Key
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";
const API_URL = "https://api.api-ninjas.com/v1/exercises";

// DOM
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error-message');
const exerciseContainer = document.getElementById('exercise-container');

function parseJSON(response) {
    return response.text().then(function(text) {
        return text ? JSON.parse(text) : {}
    });
}
//Fetch Muscle
async function fetchExercises(muscle) {
    try {
        const url = `${API_URL}?muscle=${muscle}`;
        const options = {
            method: 'GET',
            headers: { 'X-Api-Key': API_KEY }
        };

        const response = await fetch(url, options);
        const result = await parseJSON(response); 
        return result;
    } catch (error) {
        console.error(`Failed to fetch ${muscle}:`, error);
        showError('Failed to fetch exercises');
        return [];
    }
}
//Fetch All Exercises
function fetchAllExercises() {
    const muscles = [
        'chest', 'lats', 'lower_back', 'middle_back', 'traps',
        'quadriceps', 'hamstrings', 'calves', 'glutes',
        'biceps', 'triceps', 'shoulders'
    ];
    
    return Promise.all(muscles.map(muscle => fetchExercises(muscle)))
        .then(results => results.flat());
}

function fetchBackExercises() {
    return Promise.all([
        fetchExercises("lats"),
        fetchExercises("lower_back"),
        fetchExercises("middle_back"),
        fetchExercises("traps")
    ]).then(results => results.flat());
}

function fetchLegExercises() {
    return Promise.all([
        fetchExercises("quadriceps"),
        fetchExercises("hamstrings"),
        fetchExercises("calves"),
        fetchExercises("glutes")
    ]).then(results => results.flat());
}

function showError(message = '') {
    errorDiv.innerHTML = message ? `<div class="alert alert-danger">${message}</div>` : '';
    errorDiv.style.display = message ? 'block' : 'none';
}

function displayExercises(exercises) {
    if (!exercises || exercises.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-warning">No exercises found</div>';
        return;
    }

    resultsDiv.innerHTML = exercises.map(ex => `
        <div class="exercise-card" onclick="window.location='instructions.html?name=${encodeURIComponent(ex.name)}'">
            <h4>${ex.name}</h4>
            <p><strong>Muscle:</strong> ${ex.muscle.replace(/_/g, ' ')}</p>
            <p><strong>Type:</strong> ${ex.type}</p>
            <p><strong>Equipment:</strong> ${ex.equipment}</p>
        </div>
    `).join('');
}

function displayExerciseDetails(exercise) {
    exerciseContainer.innerHTML = `
        <h2 class="exercise-title">${exercise.name}</h2>
        <div class="row">
            <div class="col-md-6">
                <p><strong>Type:</strong> ${exercise.type || 'N/A'}</p>
                <p><strong>Equipment:</strong> ${exercise.equipment || 'N/A'}</p>
            </div>
            <div class="col-md-6">
                <p><strong>Muscle:</strong> <span class="badge muscle-badge">${exercise.muscle.replace(/_/g, ' ') || 'N/A'}</span></p>
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

// Search
function searchExercises() {
    showError();
    const muscleSelect = document.getElementById('muscle-select');
    const muscleKey = muscleSelect.value;
    
    if (!muscleKey) {
        showError('Please select a muscle group');
        return;
    }

    let fetchPromise;
    
    if (muscleKey === 'back') {
        fetchPromise = fetchBackExercises();
    } else if (muscleKey === 'legs') {
        fetchPromise = fetchLegExercises();
    } else {
        fetchPromise = fetchExercises(muscleKey);
    }
    
    fetchPromise
        .then(exercises => displayExercises(exercises))
        .catch(error => {
            showError('Failed to load exercises');
            console.error('Search error:', error);
        });
}

// Load  instructins
function loadExerciseDetails() {
    const params = new URLSearchParams(window.location.search);
    const exerciseName = params.get('name');

    if (!exerciseName) {
        exerciseContainer.innerHTML = '<div class="alert alert-danger">No exercise selected</div>';
        return;
    }

    fetchAllExercises()
        .then(allExercises => {
            const exercise = allExercises.find(ex => ex.name === exerciseName);
            if (exercise) {
                displayExerciseDetails(exercise);
            } else {
                exerciseContainer.innerHTML = '<div class="alert alert-danger">Exercise not found</div>';
            }
        })
        .catch(error => {
            exerciseContainer.innerHTML = '<div class="alert alert-danger">Failed to load details</div>';
            console.error('Error:', error);
        });
}

// Initialization
if (window.location.pathname.includes('instructions.html')) {
    loadExerciseDetails();
}

// Global function
window.searchExercises = searchExercises;
window.loadExerciseDetails = loadExerciseDetails;
