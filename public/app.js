// Constants
const STORAGE_KEY = 'weightlifting_lifts';
const MAX_SAVED_LIFTS = 3;
const PERCENTAGES = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40];

// DOM Elements
const liftNameInput = document.getElementById('liftName');
const liftWeightInput = document.getElementById('liftWeight');
const barWeightSelect = document.getElementById('barWeight');
const calculateBtn = document.getElementById('calculateBtn');
const saveStatus = document.getElementById('saveStatus');
const savedLiftsCard = document.getElementById('savedLiftsCard');
const savedLiftsSelect = document.getElementById('savedLiftsSelect');
const deleteBtn = document.getElementById('deleteBtn');
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
function calculateBarbellBreakdown(weight, barWeight) {
  let remaining = weight - barWeight;

  if (remaining < 0) return null;

  const plates = [];
  const plateWeights = [45, 25, 10, 5, 2.5];

  for (const plate of plateWeights) {
    while (remaining >= plate * 2) {
      plates.push(plate);
      remaining -= plate * 2;
    }
  }

  return plates;
}

// Format plate breakdown string
function formatPlateBreakdown(plates, barWeight) {
  if (!plates || plates.length === 0) return `${barWeight}lb bar only`;

  const counts = {};
  plates.forEach(p => {
    counts[p] = (counts[p] || 0) + 1;
  });

  const parts = [];
  for (const [weight, count] of Object.entries(counts).sort((a, b) => b[0] - a[0])) {
    parts.push(`${count}×${weight}`);
  }
  return parts.join(', ') + '/side';
}

// Render saved lifts dropdown
function renderSavedLifts() {
  const lifts = getSavedLifts();

  if (lifts.length === 0) {
    savedLiftsCard.style.display = 'none';
    return;
  }

  savedLiftsCard.style.display = 'block';

  // Keep the first option, replace the rest
  savedLiftsSelect.innerHTML = '<option value="">Select a lift...</option>' +
    lifts.map((lift, index) => `<option value="${index}">${lift.name} (${lift.weight}lbs, ${lift.barWeight || 45}lb bar)</option>`).join('');
}

// Load a saved lift
function loadLift(index) {
  const lifts = getSavedLifts();
  if (lifts[index]) {
    liftNameInput.value = lifts[index].name;
    liftWeightInput.value = lifts[index].weight;
    barWeightSelect.value = lifts[index].barWeight || 45;
    calculatePercentages(lifts[index].name, lifts[index].weight, lifts[index].barWeight || 45);
  }
}

// Delete a saved lift
function deleteLift(index) {
  let lifts = getSavedLifts();
  lifts.splice(index, 1);
  saveLifts(lifts);
  renderSavedLifts();

  // Reset the select
  savedLiftsSelect.value = '';
}

// Calculate and display percentages
function calculatePercentages(name, weight, barWeight) {
  resultsSection.style.display = 'block';
  resultsTitle.textContent = `${name}: ${weight}lbs (${barWeight}lb bar)`;

  percentagesList.innerHTML = PERCENTAGES.map((pct, index) => {
    const calculatedWeight = (weight * pct) / 100;
    const roundedWeight = roundUpToFive(calculatedWeight);
    const plates = calculateBarbellBreakdown(roundedWeight, barWeight);
    const plateText = formatPlateBreakdown(plates, barWeight);
    const bgClass = index % 2 === 0 ? '' : 'bg-white';

    return `
      <div class="d-flex align-items-center justify-content-between py-2 px-2 ${bgClass}" style="border-radius: 4px;">
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted small" style="width: 36px;">${pct}%</span>
          <span class="fw-bold">${roundedWeight}</span>
        </div>
        <span class="text-muted small">${plateText}</span>
      </div>
    `;
  }).join('');
}

// Save current lift
function saveCurrentLift(name, weight, barWeight) {
  let lifts = getSavedLifts();

  const existingIndex = lifts.findIndex(l => l.name.toLowerCase() === name.toLowerCase());

  if (existingIndex >= 0) {
    lifts[existingIndex].weight = weight;
    lifts[existingIndex].barWeight = barWeight;
  } else {
    if (lifts.length >= MAX_SAVED_LIFTS) {
      lifts.shift();
    }
    lifts.push({ name, weight, barWeight });
  }

  saveLifts(lifts);
  renderSavedLifts();

  saveStatus.innerHTML = '<span class="text-success">Saved</span>';
  setTimeout(() => {
    saveStatus.innerHTML = '';
  }, 1500);
}

// Event Listeners
calculateBtn.addEventListener('click', () => {
  const name = liftNameInput.value.trim() || 'Lift';
  const weight = parseFloat(liftWeightInput.value);
  const barWeight = parseInt(barWeightSelect.value);

  if (isNaN(weight) || weight <= 0) {
    alert('Please enter a valid weight');
    return;
  }

  calculatePercentages(name, weight, barWeight);
  saveCurrentLift(name, weight, barWeight);
});

savedLiftsSelect.addEventListener('change', () => {
  const index = savedLiftsSelect.value;
  if (index !== '') {
    loadLift(parseInt(index));
  }
});

deleteBtn.addEventListener('click', () => {
  const index = savedLiftsSelect.value;
  if (index !== '') {
    if (confirm('Delete this saved lift?')) {
      deleteLift(parseInt(index));
    }
  }
});

liftWeightInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    calculateBtn.click();
  }
});

// Initialize
renderSavedLifts();
