// API KEY
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

// Fetch (GET) - Using exact Promise pattern from screenshot
function fetchExercises(muscle) {
  const url = 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle;
  const options = {
    method: 'GET',
    headers: { 'X-Api-Key': API_KEY }
  };

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
        myReject(error); 
      });
  });

  return myPromise.then(
    function(result) {
      return result;
    },
    function(error) {
      return []; // Return empty array on error
    }
  );
}

// Display - Modified to show clean error message
function displayExercises(exercises) {
  const resultsDiv = document.getElementById('results');
  
  if (!exercises || exercises.length === 0) {
    // Changed from JSON.stringify to simple message
    resultsDiv.innerHTML = '<div class="no-exercises">No exercises found for that muscle group</div>';
    return;
  }

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

// Error Handling - Simplified to prevent duplicates
function showError(message = '') {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.innerHTML = message ? '<div class="error-message">' + message + '</div>' : '';
    errorDiv.style.display = message ? 'block' : 'none';
  }
}

// Search - Modified to prevent duplicate messages
async function searchExercises() {
  showError(''); // Clear previous errors
  
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
    
    // Let displayExercises handle the "no results" message
    displayExercises(exercises);
    
  } catch (error) {
    console.error('Search error:', error);
    // Don't show error here - displayExercises will handle it
  }
}

