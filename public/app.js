// Constants
const STORAGE_KEY = 'weightlifting_lifts';
const MAX_SAVED_LIFTS = 3;
const PERCENTAGES = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

// DOM Elements
const liftNameInput = document.getElementById('liftName');
const liftWeightInput = document.getElementById('liftWeight');
const calculateBtn = document.getElementById('calculateBtn');
const saveStatus = document.getElementById('saveStatus');
const savedLiftsCard = document.getElementById('savedLiftsCard');
const savedLiftsList = document.getElementById('savedLiftsList');
const clearAllBtn = document.getElementById('clearAllBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsTitle = document.getElementById('resultsTitle');
const percentagesList = document.getElementById('percentagesList');

// Load saved lifts from localStorage
function getSavedLifts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

// Save lifts to localStorage
function saveLifts(lifts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lifts));
}

// Round up to nearest 5
function roundUpToFive(weight) {
  return Math.ceil(weight / 5) * 5;
}

// Calculate barbell breakdown
function calculateBarbellBreakdown(weight) {
  // Bar is 45 lbs
  const barWeight = 45;
  let remaining = weight - barWeight;
  
  if (remaining < 0) return null;
  
  const plates = [];
  const plateWeights = [45, 25, 10, 5];
  
  for (const plate of plateWeights) {
    while (remaining >= plate * 2) {
      plates.push(plate);
      remaining -= plate * 2;
    }
  }
  
  return plates;
}

// Format plate breakdown string
function formatPlateBreakdown(plates) {
  if (!plates || plates.length === 0) return 'Just the bar (45 lbs)';
  
  const counts = {};
  plates.forEach(p => {
    counts[p] = (counts[p] || 0) + 1;
  });
  
  const parts = [];
  for (const [weight, count] of Object.entries(counts).sort((a, b) => b[0] - a[0])) {
    parts.push(`${count}x${weight}lb`);
  }
  return parts.join(', ') + ' per side';
}

// Render saved lifts
function renderSavedLifts() {
  const lifts = getSavedLifts();
  
  if (lifts.length === 0) {
    savedLiftsCard.style.display = 'none';
    return;
  }
  
  savedLiftsCard.style.display = 'block';
  savedLiftsList.innerHTML = lifts.map((lift, index) => `
    <button class="btn btn-outline-primary" onclick="loadLift(${index})">
      ${lift.name}: ${lift.weight}lbs
    </button>
  `).join('');
}

// Load a saved lift
function loadLift(index) {
  const lifts = getSavedLifts();
  if (lifts[index]) {
    liftNameInput.value = lifts[index].name;
    liftWeightInput.value = lifts[index].weight;
    calculatePercentages(lifts[index].name, lifts[index].weight);
  }
}

// Calculate and display percentages
function calculatePercentages(name, weight) {
  resultsSection.style.display = 'block';
  resultsTitle.textContent = `${name}: ${weight}lbs - Percentage Breakdown`;
  
  percentagesList.innerHTML = PERCENTAGES.map(pct => {
    const calculatedWeight = (weight * pct) / 100;
    const roundedWeight = roundUpToFive(calculatedWeight);
    const plates = calculateBarbellBreakdown(roundedWeight);
    const plateText = formatPlateBreakdown(plates);
    
    return `
      <div class="col-6 col-md-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <h6 class="card-subtitle mb-2 text-muted">${pct}%</h6>
            <h4 class="card-title mb-1">${roundedWeight} lbs</h4>
            <small class="text-muted d-block" style="font-size: 0.75rem;">${plateText}</small>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Save current lift
function saveCurrentLift(name, weight) {
  let lifts = getSavedLifts();
  
  // Check if this lift already exists
  const existingIndex = lifts.findIndex(l => l.name.toLowerCase() === name.toLowerCase());
  
  if (existingIndex >= 0) {
    // Update existing
    lifts[existingIndex].weight = weight;
  } else {
    // Add new, respecting max limit
    if (lifts.length >= MAX_SAVED_LIFTS) {
      lifts.shift(); // Remove oldest
    }
    lifts.push({ name, weight });
  }
  
  saveLifts(lifts);
  renderSavedLifts();
  
  saveStatus.innerHTML = '<span class="text-success">Saved!</span>';
  setTimeout(() => {
    saveStatus.innerHTML = '';
  }, 2000);
}

// Event Listeners
calculateBtn.addEventListener('click', () => {
  const name = liftNameInput.value.trim() || 'Lift';
  const weight = parseFloat(liftWeightInput.value);
  
  if (isNaN(weight) || weight <= 0) {
    alert('Please enter a valid weight');
    return;
  }
  
  calculatePercentages(name, weight);
  saveCurrentLift(name, weight);
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Clear all saved lifts?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderSavedLifts();
  }
});

// Allow Enter key to submit
liftWeightInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    calculateBtn.click();
  }
});

// Initialize
renderSavedLifts();
