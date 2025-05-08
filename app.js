//API KEY
const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";
//Fetch(GET)
async function fetchExercises(muscle) {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
      headers: { 'X-Api-Key': API_KEY }
    });
//Error Handling    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${muscle}:`, error);
    return [];
  }
  const url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`;
  const options = {
    method: 'GET',
    headers: { 'X-Api-Key': API_KEY }
  };

  // Promise
  let myPromise = new Promise(function(myResolve, myReject) {
    fetch(url, options)
      .then(response => {
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        return response.text();
      })
      .then(text => myResolve(text))
      .catch(error => myReject(error));
  });

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
// Fetch Back (Async and Await)
async function fetchBackExercises() {
  const [latsExercises, lowerBackExercises, middleBackExercises, trapsExercises] = await Promise.all([
    fetchExercises("lats"),
    fetchExercises("lower_back"),
    fetchExercises("middle_back"),
    fetchExercises("traps")
  ]);
  let latsExercises = await fetchExercises("lats");
  let lowerBackExercises = await fetchExercises("lower_back");
  let middleBackExercises = await fetchExercises("middle_back");
  let trapsExercises = await fetchExercises("traps");

  return [...latsExercises, ...lowerBackExercises, ...middleBackExercises, ...trapsExercises];
}
// Fetch Leg
async function fetchLegExercises() {
  const [quadsExercises, hamsExercises, calvesExercises, glutesExercises] = await Promise.all([
    fetchExercises("quadriceps"),
    fetchExercises("hamstrings"),
    fetchExercises("calves"),
    fetchExercises("glutes")
  ]);
  return [...quadsExercises, ...hamsExercises, ...calvesExercises, ...glutesExercises];
}
//Display
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
      <p>Muscle: ${ex.muscle.replace('_', ' ')}</p>
      <p>Type: ${ex.type}</p>
      <p>Equipment: ${ex.equipment}</p>
    </div>
  `).join('');
  
  if (exercises.length === 0) {
    resultsDiv.innerHTML = JSON.stringify({ error: "No exercises found" });
    return;
  }

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

function showError(message = '') {
// ======================
// ERROR HANDLING
// ======================
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.toggle('d-none', !message);
  if (message) {
    errorDiv.innerHTML = JSON.stringify({ error: message }); // Using stringify
    errorDiv.classList.remove('d-none');
  } else {
    errorDiv.innerHTML = "";
    errorDiv.classList.add('d-none');
  }
}

//Search
// ======================
// SEARCH FUNCTION
// ======================
async function searchExercises() {
  showError();

    if (!exercises.length) {
      showError(`No exercises found for ${muscleKey}`);
      return;
    }
    
    displayExercises(exercises);
  } catch (error) {
    showError('Failed to load exercises. Please try again.');
    showError('Failed to load exercises');
    console.error('Search error:', error);
  }
}

/*******************************/
/* NEW INSTRUCTIONS PAGE CODE  */
/*******************************/

// Fetch all exercises for instructions page
async function fetchAllExercises() {
  const allMuscles = [
    'chest', 'lats', 'lower_back', 'middle_back', 'traps',
    'quadriceps', 'hamstrings', 'calves', 'glutes',
    'biceps', 'triceps', 'shoulders'
  ];
  
  const allPromises = allMuscles.map(muscle => fetchExercises(muscle));
  const allResults = await Promise.all(allPromises);
  return allResults.flat();
}

// Display exercise details on instructions page
function displayExerciseDetails(exercise) {
  document.getElementById('ex-name').textContent = exercise.name;
  document.getElementById('ex-type').textContent = exercise.type || 'N/A';
  document.getElementById('ex-equipment').textContent = exercise.equipment || 'N/A';
  document.getElementById('ex-muscle').textContent = exercise.muscle.replace('_', ' ') || 'N/A';
  
  const instructionsList = document.getElementById('ex-instructions');
  if (exercise.instructions) {
    const steps = exercise.instructions.split('\n').filter(step => step.trim());
    instructionsList.innerHTML = steps.map(step => `<li>${step}</li>`).join('');
  } else {
    instructionsList.innerHTML = '<li>No specific instructions available.</li>';
  }
}

// Load exercise when on instructions page
async function loadExerciseDetails() {
  const params = new URLSearchParams(window.location.search);
  const exerciseName = params.get('name');
  
  const exerciseName = params.get('name')?.replace(/\+/g, ' ');

  if (!exerciseName) {
    document.getElementById('exercise-container').innerHTML = `
      <div class="alert alert-danger">
        No exercise selected. Please choose an exercise from the planner.
      </div>
    `;
    document.getElementById('exercise-container').innerHTML = 
      JSON.stringify({ error: "No exercise selected" });
    return;
  }

    if (exercise) {
      displayExerciseDetails(exercise);
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
      document.getElementById('exercise-container').innerHTML = `
        <div class="alert alert-danger">
          Exercise not found. It may have been removed.
        </div>
      `;
      document.getElementById('exercise-container').innerHTML = 
        JSON.stringify({ error: "Exercise not found" });
    }
  } catch (error) {
    document.getElementById('exercise-container').innerHTML = `
      <div class="alert alert-danger">
        Failed to load exercise details. Please try again later.
      </div>
    `;
    console.error('Error loading exercise:', error);
    document.getElementById('exercise-container').innerHTML = 
      JSON.stringify({ error: "Failed to load details" });
  }
}

// Initialize instructions page if needed
if (window.location.pathname.includes('instructions.html')) {
  loadExerciseDetails();
}
