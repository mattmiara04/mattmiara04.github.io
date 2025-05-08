// API KEY - Same as original
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

// ======================
// CONSUMING REST API (GET)
// ======================
async function fetchExercises(muscle) {
  const url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`;
  const options = {
    method: 'GET',
    headers: { 'X-Api-Key': API_KEY }
  };

  // Using exact Promise pattern from screenshot
  let myPromise = new Promise(function(myResolve, myReject) {
    fetch(url, options)
      .then(response => {
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.text();
      })
      .then(text => myResolve(text))
      .catch(error => myReject(error));
  });

  // Consuming code as shown
  return myPromise.then(
    function(text) {
      const myObj = JSON.parse(text); // Manual parse per screenshot
      return myObj;
    },
    function(error) {
      console.error(`Failed to fetch ${muscle}:`, error);
      return [];
    }
  );
}

// ======================
// ASYNC/AWAIT PATTERN
// ======================
async function fetchBackExercises() {
  // Using await syntax exactly as shown
  let latsExercises = await fetchExercises("lats");
  let lowerBackExercises = await fetchExercises("lower_back");
  let middleBackExercises = await fetchExercises("middle_back");
  let trapsExercises = await fetchExercises("traps");

  // Combining objects
  return [...latsExercises, ...lowerBackExercises, ...middleBackExercises, ...trapsExercises];
}

// ======================
// DISPLAYING JSON DATA
// ======================
function displayExercises(exercises) {
  const resultsDiv = document.getElementById('results');
  
  // Using JSON.stringify() exactly as shown
  if (exercises.length === 0) {
    resultsDiv.innerHTML = JSON.stringify({ error: "No exercises found" });
    return;
  }

  // Building output per screenshot's loop pattern
  let text = "";
  for (const x in exercises) {
    text += "<div class='exercise' style='background:#252525;padding:15px;margin:10px 0;border-radius:8px;cursor:pointer' onclick='window.location=\"instructions.html?name=" + 
            exercises[x].name.replace(/\s/g, '+') + "\"'>" +
            "<h4 style='color:#ff0000'>" + exercises[x].name + "</h4>" +
            "<p>Muscle: " + exercises[x].muscle.replace('_', ' ') + "</p>" +
            "<p>Type: " + exercises[x].type + "</p>" +
            "<p>Equipment: " + exercises[x].equipment + "</p>" +
            "</div>";
  }
  resultsDiv.innerHTML = text;
}

// ======================
// ERROR HANDLING
// ======================
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (message) {
    errorDiv.innerHTML = JSON.stringify({ error: message }); // Using stringify
    errorDiv.classList.remove('d-none');
  } else {
    errorDiv.innerHTML = "";
    errorDiv.classList.add('d-none');
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
    showError('Failed to load exercises');
    console.error('Search error:', error);
  }
}

// ======================
// INSTRUCTIONS PAGE
// ======================
async function loadExerciseDetails() {
  const params = new URLSearchParams(window.location.search);
  const exerciseName = params.get('name')?.replace(/\+/g, ' ');

  if (!exerciseName) {
    document.getElementById('exercise-container').innerHTML = 
      JSON.stringify({ error: "No exercise selected" });
    return;
  }

  try {
    const allExercises = await fetchAllExercises();
    const exercise = allExercises.find(ex => ex.name === exerciseName);
    
    if (exercise) {
      // Using manual property access per screenshot
      document.getElementById('ex-name').textContent = exercise["name"];
      document.getElementById('ex-type').textContent = exercise["type"] || 'N/A';
      document.getElementById('ex-equipment').textContent = exercise["equipment"] || 'N/A';
      document.getElementById('ex-muscle').textContent = exercise["muscle"].replace('_', ' ') || 'N/A';
      
      const instructionsList = document.getElementById('ex-instructions');
      if (exercise["instructions"]) {
        instructionsList.innerHTML = exercise["instructions"]
          .split('\n')
          .map(step => `<li>${step}</li>`)
          .join('');
      }
    } else {
      document.getElementById('exercise-container').innerHTML = 
        JSON.stringify({ error: "Exercise not found" });
    }
  } catch (error) {
    document.getElementById('exercise-container').innerHTML = 
      JSON.stringify({ error: "Failed to load details" });
  }
}
