let workoutFlow = [];
let currentStep = 0;
let timerId = null;
let stepDuration = 30;
let remaining = 0;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function saveWeights() {
    const weights = {
        swings: w_swings.value,
        goblet: w_goblet.value,
        rows: w_rows.value,
        highpull: w_highpull.value,
        march: w_march.value
    };
    localStorage.setItem('kbWeights', JSON.stringify(weights));
    saveMsg.innerText = "Saved!";
}

function loadWeights() {
    const data = localStorage.getItem('kbWeights');
    if (!data) return;
    const w = JSON.parse(data);
    w_swings.value = w.swings || "";
    w_goblet.value = w.goblet || "";
    w_rows.value = w.rows || "";
    w_highpull.value = w.highpull || "";
    w_march.value = w.march || "";
}

function initFlow() {
    workoutFlow = [
        "Treadmill Warm-Up: 2 min @ 2%",
        "Treadmill Warm-Up: 2 min @ 4%",
        "Treadmill Warm-Up: 2 min @ 5%",
        "Swings - 45 sec",
        "Goblet Squat - 45 sec",
        "Rows - 45 sec",
        "High Pulls - 45 sec",
        "March/Carry - 45 sec",
        "Repeat circuit 3 rounds",
        "Treadmill Intervals: 1 min fast / 1 min recovery × 6",
        "Core: Dead Bug - 30 sec",
        "Core: Plank - 30 sec",
        "Core: Crunch - 30 sec"
    ];
    updateProgress();
}

function updateProgress() {
    const total = workoutFlow.length;
    progressText.innerText = `Step ${currentStep} / ${total}`;
    progressFill.style.width = (currentStep / total) * 100 + "%";
}

function playBeep() {
    beepSound.play().catch(() => {});
}

function startWorkout() {
    initFlow();
    currentStep = 0;
    nextStep();
}

function nextStep() {
    if (currentStep >= workoutFlow.length) {
        workoutDisplay.innerText = "Workout Complete!";
        updateProgress();
        stopTimer();
        return;
    }

    workoutDisplay.innerText = workoutFlow[currentStep];
    currentStep++;
    updateProgress();
    startTimer(stepDuration, nextStep);
}

function startTimer(seconds, callback) {
    stopTimer();
    remaining = seconds;
    updateTimerText();
    timerId = setInterval(() => {
        remaining--;
        updateTimerText();
        if (remaining <= 0) {
            playBeep();
            stopTimer();
            callback();
        }
    }, 1000);
}

function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
}

function stopWorkout() {
    stopTimer();
    workoutDisplay.innerText = "Workout stopped.";
}

function updateTimerText() {
    timerText.innerText = `Timer: ${remaining.toString().padStart(2, '0')}`;
}

window.onload = () => {
    loadWeights();
    initFlow();
};
