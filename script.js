// === ELEMENT REFERENCES ===
const petImage = document.getElementById('pet-face-img');
const petStatus = document.getElementById('pet-status');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');
const sleepBtn = document.getElementById('sleep-btn');
const clockDisplay = document.getElementById('clock');
const commandLog = document.getElementById('command-log');

const hungerFill = document.getElementById('hunger-fill');
const happinessFill = document.getElementById('happiness-fill');
const energyFill = document.getElementById('energy-fill');
const hungerValue = document.getElementById('hunger-value');
const happinessValue = document.getElementById('happiness-value');
const energyValue = document.getElementById('energy-value');

// === INITIAL PET STATE ===
let pet = {
  hunger: 30,       // 0 = full, 100 = starving
  happiness: 80,    // 0 = sad, 100 = very happy
  energy: 85,       // 0 = exhausted, 100 = full energy
  isSleeping: false,
  isFainted: false
};

// === IMAGE PATHS ===
const imagePaths = {
  awake: "assets/awake.png",
  eating: "assets/eating.png",
  playing: "assets/playing.png",
  sleeping: "assets/sleeping.png",
  happy: "assets/happy.png",
  sad: "assets/sad.png",
  tired: "assets/tired.png",
  fainted: "assets/fainted.png"
};

// === UTILITIES ===
function clamp(val) {
  return Math.max(0, Math.min(100, val));
}

function log(message, type = 'info') {
  const entry = document.createElement('div');
  entry.classList.add('log-entry');
  if (type === 'error') entry.classList.add('log-error');
  if (type === 'action') entry.classList.add('log-action');
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  commandLog.appendChild(entry);
  commandLog.scrollTop = commandLog.scrollHeight;
}

// === STATE MANAGEMENT ===
function getCurrentState() {
  if (pet.isFainted) return "fainted";
  if (pet.isSleeping) return "sleeping";

  // Emotional states
  if (pet.energy < 20) return "tired";
  if (pet.hunger > 80) return "hungry"; // fallback to sad if no hungry image
  if (pet.happiness < 30) return "sad";
  if (pet.happiness > 90) return "happy";

  // Default
  return "awake";
}

function updateDisplay() {
  hungerFill.style.width = `${pet.hunger}%`;
  happinessFill.style.width = `${pet.happiness}%`;
  energyFill.style.width = `${pet.energy}%`;

  hungerValue.textContent = `${Math.floor(pet.hunger)}%`;
  happinessValue.textContent = `${Math.floor(pet.happiness)}%`;
  energyValue.textContent = `${Math.floor(pet.energy)}%`;

  let state = getCurrentState();
  let imageSrc = imagePaths[state] || imagePaths.awake;
  petImage.src = imageSrc;

  let statusText = "";
  switch (state) {
    case "happy":
      statusText = "😊 Pikachu is feeling super happy!";
      break;
    case "sad":
      statusText = "😢 Pikachu looks sad. Give it some attention.";
      break;
    case "tired":
      statusText = "💤 Pikachu is exhausted. Let it rest.";
      break;
    case "sleeping":
      statusText = "🌙 Pikachu is sleeping peacefully...";
      break;
    case "fainted":
      statusText = "💀 Pikachu fainted! Game over.";
      break;
    default:
      if (pet.hunger > 70) statusText = "🍓 Pikachu is getting hungry...";
      else if (pet.energy < 30) statusText = "⚡ Pikachu seems a bit tired...";
      else statusText = "⚡ Pikachu is active and cheerful!";
  }

  petStatus.textContent = statusText;
  sleepBtn.textContent = pet.isSleeping ? ":: wake ☀" : ":: sleep ☾";
}

// === INTERACTIONS ===
function handleFeed() {
  if (pet.isSleeping) return log("Pet is sleeping. Can't feed now.", "error");
  if (pet.isFainted) return;

  pet.hunger = clamp(pet.hunger - 30);
  pet.happiness = clamp(pet.happiness + 10);
  pet.energy = clamp(pet.energy + 5);

  petImage.src = imagePaths.eating;
  log("Feeding Pikachu... (-30 hunger, +10 happiness)", "action");
  setTimeout(updateDisplay, 1500);
}

function handlePlay() {
  if (pet.isSleeping) return log("Pet is sleeping. Can't play.", "error");
  if (pet.isFainted) return;
  if (pet.energy < 20) return log("Pikachu is too tired to play.", "error");

  pet.happiness = clamp(pet.happiness + 20);
  pet.energy = clamp(pet.energy - 15);
  pet.hunger = clamp(pet.hunger + 10);

  petImage.src = imagePaths.playing;
  log("Playing with Pikachu! (+20 happiness, -15 energy, +10 hunger)", "action");
  setTimeout(updateDisplay, 2000);
}

function handleSleep() {
  if (pet.isFainted) return;
  pet.isSleeping = !pet.isSleeping;
  log(pet.isSleeping ? "Pikachu is now sleeping 💤" : "Pikachu woke up ☀", "action");
  updateDisplay();
}

// === CLOCK ===
function updateClock() {
  const now = new Date();
  clockDisplay.textContent = now.toLocaleTimeString();
}

// === GAME LOOP ===
function updateAttributes() {
  if (pet.isFainted) return;

  if (pet.isSleeping) {
    pet.energy = clamp(pet.energy + 6);
    pet.hunger = clamp(pet.hunger + 2);
    pet.happiness = clamp(pet.happiness + 1);
  } else {
    pet.hunger = clamp(pet.hunger + 4);
    pet.energy = clamp(pet.energy - 3);
    pet.happiness = clamp(pet.happiness - 1);
  }

  // Critical conditions
  if (pet.hunger >= 100 || pet.energy <= 0) {
    pet.isFainted = true;
    updateDisplay();
    log("CRITICAL: Pikachu fainted! Restart required.", "error");
    feedBtn.disabled = playBtn.disabled = sleepBtn.disabled = true;
    return;
  }

  updateDisplay();
}

// === INITIALIZATION ===
feedBtn.addEventListener('click', handleFeed);
playBtn.addEventListener('click', handlePlay);
sleepBtn.addEventListener('click', handleSleep);

updateDisplay();
setInterval(updateClock, 1000);
setInterval(updateAttributes, 3000);