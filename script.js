let petImage;
let petStatus;
let feedBtn;
let playBtn;
let sleepBtn;
let clockDisplay;
let commandLog;
let hungerFill;
let happinessFill;
let energyFill;
let hungerValue;
let happinessValue;
let energyValue;

let pet = {
  hunger: 30,
  happiness: 80,
  energy: 85,
  isSleeping: false,
  isFainted: false
};

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

function getCurrentState() {
  if (pet.isFainted) return "fainted";
  if (pet.isSleeping) return "sleeping";
  if (pet.energy < 20) return "tired";
  if (pet.hunger > 80) return "hungry";
  if (pet.happiness < 30) return "sad";
  if (pet.happiness > 90) return "happy";
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

function handleFeed() {
  if (pet.isSleeping) {
    log("Pet is sleeping. Can't feed now.", "error");
    return;
  }
  if (pet.isFainted) return;

  pet.hunger = clamp(pet.hunger - 35);
  pet.happiness = clamp(pet.happiness + 15);
  pet.energy = clamp(pet.energy + 8);
  petImage.src = imagePaths.eating;
  log("Feeding Pikachu... (-35 hunger, +15 happiness, +8 energy)", "action");
  updateDisplay();
}

function handlePlay() {
  if (pet.isSleeping) {
    log("Pet is sleeping. Can't play.", "error");
    return;
  }
  if (pet.isFainted) return;
  if (pet.energy < 25) {
    log("Pikachu is too tired to play. Let it rest!", "error");
    return;
  }

  pet.happiness = clamp(pet.happiness + 25);
  pet.energy = clamp(pet.energy - 18);
  pet.hunger = clamp(pet.hunger + 12);
  petImage.src = imagePaths.playing;
  log("Playing with Pikachu! (+25 happiness, -18 energy, +12 hunger)", "action");
  updateDisplay();
}

function handleSleep() {
  if (pet.isFainted) return;
  pet.isSleeping = !pet.isSleeping;
  log(pet.isSleeping ? "Pikachu is now sleeping 💤" : "Pikachu woke up ☀", "action");
  updateDisplay();
}

function updateClock() {
  const now = new Date();
  clockDisplay.textContent = now.toLocaleTimeString();
}

function updateAttributes() {
  if (pet.isFainted) return;

  if (pet.isSleeping) {
    pet.energy = clamp(pet.energy + 8);
    pet.hunger = clamp(pet.hunger + 3);
    pet.happiness = clamp(pet.happiness + 2);
  } else {
    pet.hunger = clamp(pet.hunger + 5);
    pet.energy = clamp(pet.energy - 4);
    pet.happiness = clamp(pet.happiness - 2);
  }

  if (pet.hunger >= 100) {
    pet.isFainted = true;
    updateDisplay();
    log("CRITICAL: Pikachu starved! Game Over.", "error");
    feedBtn.disabled = playBtn.disabled = sleepBtn.disabled = true;
    return;
  }

  if (pet.energy <= 0) {
    pet.isFainted = true;
    updateDisplay();
    log("CRITICAL: Pikachu collapsed! Game Over.", "error");
    feedBtn.disabled = playBtn.disabled = sleepBtn.disabled = true;
    return;
  }

  updateDisplay();
}

function init() {
  petImage = document.getElementById('pet-face-img');
  petStatus = document.getElementById('pet-status');
  feedBtn = document.getElementById('feed-btn');
  playBtn = document.getElementById('play-btn');
  sleepBtn = document.getElementById('sleep-btn');
  clockDisplay = document.getElementById('clock');
  commandLog = document.getElementById('command-log');
  hungerFill = document.getElementById('hunger-fill');
  happinessFill = document.getElementById('happiness-fill');
  energyFill = document.getElementById('energy-fill');
  hungerValue = document.getElementById('hunger-value');
  happinessValue = document.getElementById('happiness-value');
  energyValue = document.getElementById('energy-value');

  if (!petImage || !feedBtn || !playBtn || !sleepBtn || !commandLog) {
    console.error('Initialization failed: some DOM elements not found. Check IDs in HTML.');
    return;
  }

  feedBtn.addEventListener('click', handleFeed);
  playBtn.addEventListener('click', handlePlay);
  sleepBtn.addEventListener('click', handleSleep);

  updateDisplay();
  setInterval(updateClock, 1000);
  setInterval(updateAttributes, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
