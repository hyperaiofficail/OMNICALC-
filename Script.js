let currentExp = "0";
let isRadians = true;
let lastAns = 0;

const display = document.getElementById('curr-display');
const prevDisplay = document.getElementById('prev-display');
const radLabel = document.getElementById('rad-label');
const degLabel = document.getElementById('deg-label');

function updateScreen() {
    display.innerText = currentExp;
}

function toggleRadDeg() {
    isRadians = !isRadians;
    updateModeUI();
}

function setMode(mode) {
    isRadians = (mode === 'rad');
    updateModeUI();
}

function updateModeUI() {
    radLabel.className = isRadians ? 'active-mode' : 'inactive-mode';
    degLabel.className = isRadians ? 'inactive-mode' : 'active-mode';
}
