// API KEY
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

// CONSUMING REST API (GET) - Exactly from screenshot
function fetchExercises(muscle) {
  const url = 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle;
  const options = {
    method: 'GET',
    headers: { 'X-Api-Key': API_KEY }
  };

  // Using exact Promise pattern from screenshot
  let myPromise = new Promise(function(myResolve, myReject) {
    fetch(url, options)
      .then(function(response) {
        if (!response.ok) throw new Error('API Error: ' + response.status);
        return response.text();
      })
      .then(function(text) { 
        try {
          const myObj = JSON.parse(text); // Manual parse per screenshot
          myResolve(myObj);
        } catch(e) {
          throw new Error('Invalid JSON');
        }
      })
      .catch(function(error) { 
        console.error('Fetch error:', error);
        myReject(error); 
      });
  });

  return myPromise.then(
    function(result) {
      return result;
    },
    function(error) {
      console.error('Failed to fetch:', error);
      return [];
    }
  );
}

// ASYNC/AWAIT PATTERN - From screenshot
async function fetchBackExercises() {
  let latsExercises = await fetchExercises("lats");
  let lowerBackExercises = await fetchExercises("lower_back");
  let middleBackExercises = await fetchExercises("middle_back");
  let trapsExercises = await fetchExercises("traps");

  // Using array concat instead of spread to match screenshot style
  return [].concat(latsExercises, lowerBackExercises, middleBackExercises, trapsExercises);
}

// DISPLAYING JSON DATA - From screenshot style
function displayExercises(exercises) {
  const resultsDiv = document.getElementById('results');
  
  if (!exercises || exercises.length === 0) {
    resultsDiv.innerHTML = JSON.stringify({ error: "No exercises found" });
    return;
  }

  // Using string building from screenshot
  let html = '';
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    html += '<div class="exercise" style="' +
            'background: #252525;' +
            'padding: 15px;' +
            'margin: 10px 0;' +
            'border-radius: 8px;' +
            'cursor: pointer;" ' +
            'onclick="window.location=\'instructions.html?name=' + 
            ex.name.replace(/\s/g, '+') + '\'">' +
            '<h4 style="color: #ff0000">' + ex.name + '</h4>' +
            '<p>Muscle: ' + ex.muscle.replace('_', ' ') + '</p>' +
            '<p>Type: ' + ex.type + '</p>' +
            '<p>Equipment: ' + ex.equipment + '</p>' +
            '</div>';
  }
  resultsDiv.innerHTML = html;
}

// ERROR HANDLING - Using JSON.stringify from screenshot
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (message) {
    errorDiv.innerHTML = JSON.stringify({ error: message });
    errorDiv.style.display = 'block';
  } else {
    errorDiv.innerHTML = '';
    errorDiv.style.display = 'none';
  }
}

// SEARCH FUNCTION - Using methods from screenshots
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
    } else {
      exercises = await fetchExercises(muscleKey);
    }
    
    if (exercises.length === 0) {
      showError('No exercises found for ' + muscleKey);
    }
    
    displayExercises(exercises);
  } catch (error) {
    showError('Failed to load exercises');
    console.error('Search error:', error);
  }
}

/*******************************/
/* INSTRUCTIONS PAGE CODE */
/*******************************/

// Using property access from screenshot
async function loadExerciseDetails() {
  const params = new URLSearchParams(window.location.search);
  const exerciseName = params.get('name')?.replace(/\+/g, ' ');

  if (!exerciseName) {
    document.getElementById('exercise-container').innerHTML = 
      JSON.stringify({ error: "No exercise selected" });
    return;
  }

  try {
    // Using bracket notation from screenshot
    const allExercises = await fetchAllExercises();
    const exercise = allExercises.find(function(ex) { 
      return ex["name"] === exerciseName; 
    });
    
    if (exercise) {
      document.getElementById('ex-name').textContent = exercise["name"];
      document.getElementById('ex-type').textContent = exercise["type"] || 'N/A';
      document.getElementById('ex-equipment').textContent = exercise["equipment"] || 'N/A';
      document.getElementById('ex-muscle').textContent = exercise["muscle"] ? exercise["muscle"].replace(/_/g, ' ') : 'N/A';
      
      const instructionsList = document.getElementById('ex-instructions');
      if (exercise["instructions"]) {
        instructionsList.innerHTML = exercise["instructions"]
          .split('\n')
          .map(function(step) { return '<li>' + step + '</li>'; })
          .join('');
      }
    } else {
      document.getElementById('exercise-container').innerHTML = 
        JSON.stringify({ error: "Exercise not found" });
    }
  } catch (error) {
    document.getElementById('exercise-container').innerHTML = 
      JSON.stringify({ error: "Failed to load details" });
    console.error('Error:', error);
  }
}

// Helper function using Promise pattern from screenshot
function fetchAllExercises() {
  const muscles = ['biceps', 'triceps', 'chest', 'back', 'shoulders', 'legs'];
  
  return new Promise(function(resolve) {
    Promise.all(muscles.map(muscle => fetchExercises(muscle)))
      .then(function(results) {
        resolve(results.flat());
      })
      .catch(function(error) {
        console.error('Error fetching all:', error);
        resolve([]);
      });
  });
}

// Initialize
if (window.location.pathname.includes('instructions.html')) {
  loadExerciseDetails();
}
