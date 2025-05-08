/// API KEY
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

// ======================
// FIXED API FETCH (From Screenshot)
// ======================
function fetchExercises(muscle) {
  // Validate muscle parameter first
  const validMuscles = {
    chest: "chest",
    back: "back",
    shoulders: "shoulders",
    biceps: "biceps",
    triceps: "triceps",
    legs: "legs",
    lats: "lats",
    lower_back: "lower_back",
    middle_back: "middle_back",
    traps: "traps",
    quadriceps: "quadriceps",
    hamstrings: "hamstrings",
    calves: "calves",
    glutes: "glutes"
  };

  if (!validMuscles[muscle]) {
    return Promise.resolve([]);
  }

  const url = 'https://api.api-ninjas.com/v1/exercises?muscle=' + validMuscles[muscle];
  const options = {
    method: 'GET',
    headers: { 
      'X-Api-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  };

  let myPromise = new Promise(function(myResolve, myReject) {
    fetch(url, options)
      .then(function(response) {
        if (!response.ok) {
          console.log('API Response:', response);
          throw new Error('API Error: ' + response.status);
        }
        return response.text();
      })
      .then(function(text) {
        try {
          const myObj = JSON.parse(text);
          myResolve(myObj);
        } catch (e) {
          myReject(new Error('Invalid JSON response'));
        }
      })
      .catch(function(error) {
        console.error('Fetch error for', muscle, ':', error);
        myReject(error);
      });
  });

  return myPromise.then(
    function(result) {
      return result;
    },
    function(error) {
      console.error('Failed to fetch', muscle, ':', error.message);
      return [];
    }
  );
}

// ======================
// SAFE DISPLAY FUNCTION
// ======================
function displayExercises(exercises) {
  const resultsDiv = document.getElementById('results');
  
  if (!exercises || exercises.length === 0) {
    resultsDiv.innerHTML = JSON.stringify({ error: "No exercises found" });
    return;
  }

  let html = '';
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    if (!ex.name) continue; // Skip invalid entries
    
    html += '<button class="exercise-btn" onclick="window.location=\'instructions.html?name=' + 
            encodeURIComponent(ex.name) + '\'">' +
            '<h4>' + ex.name + '</h4>' +
            '<p>Muscle: ' + (ex.muscle ? ex.muscle.replace(/_/g, ' ') : 'N/A') + '</p>' +
            '<p>Type: ' + (ex.type || 'N/A') + '</p>' +
            '<p>Equipment: ' + (ex.equipment || 'N/A') + '</p>' +
            '</button>';
  }
  
  resultsDiv.innerHTML = html || JSON.stringify({ error: "No valid exercises found" });
}

// ======================
// SAFE SEARCH FUNCTION
// ======================
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
    showError('Failed to load exercises. Please try a different muscle group.');
    console.error('Search error:', error);
  }
}

// ======================
// SAFE BACK EXERCISES
// ======================
async function fetchBackExercises() {
  try {
    const [lats, lowerBack, middleBack, traps] = await Promise.all([
      fetchExercises("lats"),
      fetchExercises("lower_back"),
      fetchExercises("middle_back"),
      fetchExercises("traps")
    ]);
    return [].concat(
      lats || [],
      lowerBack || [],
      middleBack || [],
      traps || []
    ).filter(ex => ex); // Remove any null/undefined
  } catch (error) {
    console.error('Error fetching back exercises:', error);
    return [];
  }
}
// API KEY
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

// ======================
// API FETCH FUNCTION (Using Promise pattern from screenshot)
// ======================
function fetchExercises(muscle) {
  // Valid muscle groups accepted by the API
  const validMuscles = {
    abdominals: "abdominals",
    biceps: "biceps",
    calves: "calves",
    chest: "chest",
    forearms: "forearms",
    glutes: "glutes",
    hamstrings: "hamstrings",
    lats: "lats",
    lower_back: "lower_back",
    middle_back: "middle_back",
    neck: "neck",
    quadriceps: "quadriceps",
    traps: "traps",
    triceps: "triceps",
    shoulders: "shoulders"
  };

  // Only proceed with valid muscle groups
  if (!validMuscles[muscle]) {
    console.error('Invalid muscle group:', muscle);
    return Promise.resolve([]);
  }

  const url = 'https://api.api-ninjas.com/v1/exercises?muscle=' + validMuscles[muscle];
  const options = {
    method: 'GET',
    headers: { 
      'X-Api-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  };

  // Using exact Promise pattern from screenshot
  let myPromise = new Promise(function(myResolve, myReject) {
    fetch(url, options)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('API Error: ' + response.status);
        }
        return response.text();
      })
      .then(function(text) {
        try {
          const myObj = JSON.parse(text);
          myResolve(myObj);
        } catch (e) {
          throw new Error('Invalid JSON response');
        }
      })
      .catch(function(error) {
        console.error('Fetch error for', muscle, ':', error.message);
        myReject(error);
      });
  });

  return myPromise.then(
    function(result) {
      return result;
    },
    function(error) {
      return [];
    }
  );
}

// ======================
// MUSCLE GROUP FUNCTIONS
// ======================
async function fetchBackExercises() {
  try {
    const [lats, lowerBack, middleBack, traps] = await Promise.all([
      fetchExercises("lats"),
      fetchExercises("lower_back"),
      fetchExercises("middle_back"),
      fetchExercises("traps")
    ]);
    return [].concat(lats || [], lowerBack || [], middleBack || [], traps || []);
  } catch (error) {
    console.error('Error fetching back exercises:', error);
    return [];
  }
}

async function fetchLegExercises() {
  try {
    const [quads, hams, calves, glutes] = await Promise.all([
      fetchExercises("quadriceps"),
      fetchExercises("hamstrings"),
      fetchExercises("calves"),
      fetchExercises("glutes")
    ]);
    return [].concat(quads || [], hams || [], calves || [], glutes || []);
  } catch (error) {
    console.error('Error fetching leg exercises:', error);
    return [];
  }
}

// ======================
// DISPLAY FUNCTION (With button implementation)
// ======================
function displayExercises(exercises) {
  const resultsDiv = document.getElementById('results');
  
  if (!exercises || exercises.length === 0) {
    resultsDiv.innerHTML = JSON.stringify({ error: "No exercises found" });
    return;
  }

  let html = '';
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    if (!ex || !ex.name) continue;
    
    html += '<button class="exercise-btn" onclick="window.location=\'instructions.html?name=' + 
            encodeURIComponent(ex.name) + '\'">' +
            '<h4>' + ex.name + '</h4>' +
            '<p>Muscle: ' + (ex.muscle ? ex.muscle.replace(/_/g, ' ') : 'N/A') + '</p>' +
            '<p>Type: ' + (ex.type || 'N/A') + '</p>' +
            '<p>Equipment: ' + (ex.equipment || 'N/A') + '</p>' +
            '</button>';
  }
  
  resultsDiv.innerHTML = html || JSON.stringify({ error: "No valid exercises found" });
}

// ======================
// ERROR HANDLING (Using JSON.stringify from screenshot)
// ======================
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

// ======================
// SEARCH FUNCTION
// ======================
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
    showError('Failed to load exercises. Please try a different muscle group.');
    console.error('Search error:', error);
  }
}

// ======================
// INSTRUCTIONS PAGE (Using property access from screenshot)
// ======================
async function fetchAllExercises() {
  const muscles = ['abdominals', 'biceps', 'calves', 'chest', 'forearms', 
                  'glutes', 'hamstrings', 'lats', 'lower_back', 'middle_back',
                  'neck', 'quadriceps', 'traps', 'triceps', 'shoulders'];
  
  let allExercises = [];
  for (let i = 0; i < muscles.length; i++) {
    try {
      const exercises = await fetchExercises(muscles[i]);
      allExercises = allExercises.concat(exercises || []);
    } catch (error) {
      console.error('Error fetching', muscles[i], ':', error);
    }
  }
  return allExercises;
}

async function loadExerciseDetails() {
  const params = new URLSearchParams(window.location.search);
  const exerciseName = decodeURIComponent(params.get('name') || '');

  if (!exerciseName) {
    document.getElementById('exercise-container').innerHTML = 
      JSON.stringify({ error: "No exercise selected" });
    return;
  }

  try {
    const allExercises = await fetchAllExercises();
    const exercise = allExercises.find(function(ex) { 
      return ex && ex["name"] === exerciseName; 
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
          .filter(step => step.trim())
          .map(function(step) { return '<li>' + step + '</li>'; })
          .join('');
      } else {
        instructionsList.innerHTML = '<li>No instructions available</li>';
      }
    } else {
      document.getElementById('exercise-container').innerHTML = 
        JSON.stringify({ error: "Exercise not found" });
    }
  } catch (error) {
    document.getElementById('exercise-container').innerHTML = 
      JSON.stringify({ error: "Failed to load details" });
    console.error('Error loading exercise:', error);
  }
}

// Initialize instructions page
if (window.location.pathname.includes('instructions.html')) {
  loadExerciseDetails();
}
