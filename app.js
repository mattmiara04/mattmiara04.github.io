const API_KEY = "SB4EC0pmfS3A9aIsz9RvBA==e4495G4sfBnbZw0m";

// 1. Fetches exercises for a single muscle
async function fetchExercises(muscle) {
  const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {
    headers: { 'X-Api-Key': API_KEY }
  });
  return await response.json();
}

async function getBackExercises() {
  // API expects these exact values:
  const lats = await fetchExercises("lats");
  const lower = await fetchExercises("lower_back");
  const middle = await fetchExercises("middle_back");
  const traps = await fetchExercises("traps");
  return lats.concat(lower, middle, traps);
}

async function getLegExercises() {
  // Using API's exact expected values:
  const abductors = await fetchExercises("abductors"); // Note: "abductors" not "abductor"
  const adductors = await fetchExercises("adductors"); // Note: "adductors" not "adductor"
  const calves = await fetchExercises("calves");
  const glutes = await fetchExercises("glutes");
  const hamstrings = await fetchExercises("hamstrings");
  const quads = await fetchExercises("quadriceps");
  return abductors.concat(adductors, calves, glutes, hamstrings, quads);
}

async function searchExercises() {
  const muscle = document.getElementById('muscle-select').value;
  
  // Handle combined groups
  if (muscle === "back") return displayExercises(await getBackExercises());
  if (muscle === "legs") return displayExercises(await getLegExercises());
  
  // Handle single muscles
  displayExercises(await fetchExercises(muscle));
}
