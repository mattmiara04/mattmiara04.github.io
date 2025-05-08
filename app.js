const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

// 1. Enhanced fetch function with error handling
async function fetchExercises(muscle) {
  console.log(`Fetching exercises for: ${muscle}`); // Debug log
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
      headers: { 'X-Api-Key': API_KEY }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.length} exercises for ${muscle}`); // Debug log
    return data;
    
  } catch (error) {
    console.error(`Error fetching ${muscle}:`, error);
    return []; // Return empty array on failure
  }
}

// 2. Back exercises fetcher
async function getBackExercises() {
  console.log("Fetching all back exercises...");
  const [lats, lower, middle, traps] = await Promise.all([
    fetchExercises("lats"),
    fetchExercises("lower_back"),
    fetchExercises("middle_back"),
    fetchExercises("traps")
  ]);
  return lats.concat(lower, middle, traps);
}

// 3. Leg exercises fetcher (using exact API parameters)
async function getLegExercises() {
  console.log("Fetching all leg exercises...");
  const [abductors, adductors, calves, glutes, hamstrings, quads] = await Promise.all([
    fetchExercises("abductors"),
    fetchExercises("adductors"),
    fetchExercises("calves"),
    fetchExercises("glutes"),
    fetchExercises("hamstrings"),
    fetchExercises("quadriceps")
  ]);
  return abductors.concat(abductors, adductors, calves, glutes, hamstrings, quads);
}

// 4. Main search function with full error handling
async function searchExercises() {
  try {
    const muscle = document.getElementById('muscle-select').value;
    console.log("Search initiated for:", muscle); // Debug log
    
    if (!muscle) {
      alert("Please select a muscle group!");
      return;
    }

    let exercises = [];
    if (muscle === "back") {
      exercises = await getBackExercises();
    } else if (muscle === "legs") {
      exercises = await getLegExercises();
    } else {
      exercises = await fetchExercises(muscle);
    }

    if (exercises.length === 0) {
      alert(`No exercises found for ${muscle}. Try another group.`);
    } else {
      console.log(`Displaying ${exercises.length} exercises`); // Debug log
    }
    
    displayExercises(exercises);
    
  } catch (error) {
    console.error("Search failed completely:", error);
    alert("Search failed completely. Check console for details.");
  }
}

// 5. Your original display function (unchanged)
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
      <p>Muscle: ${ex.muscle.replace('_', ' ')}</p>
    </div>
  `).join('');
}
