let workoutFlow = [];
let currentStep = 0;
let timerId = null;
let stepDuration = 30; // seconds per step for demo
let remaining = 0;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function toggleMode() {
    const body = document.body;
    if (body.classList.contains('light')) {
        body.classList.remove('light');
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
    }
}

function saveWeights() {
    const weights = {
        swings: document.getElementById('w_swings').value,
        goblet: document.getElementById('w_goblet').value,
        rows: document.getElementById('w_rows').value,
        highpull: document.getElementById('w_highpull').value,
        march: document.getElementById('w_march').value
    };

    localStorage.setItem('kbWeights', JSON.stringify(weights));
    document.getElementById('saveMsg').innerText = "Saved!";
}

function loadWeights() {
    const data = localStorage.getItem('kbWeights');
    if (!data) return;
    const w = JSON.parse(data);
    document.getElementById('w_swings').value = w.swings || "";
    document.getElementById('w_goblet').value = w.goblet || "";
    document.getElementById('w_rows').value = w.rows || "";
    document.getElementById('w_highpull').value = w.highpull || "";
    document.getElementById('w_march').value = w.march || "";
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
    const text = document.getElementById('progressText');
    const fill = document.getElementById('progressFill');
    text.innerText = `Step ${currentStep} / ${total}`;
    const percent = total === 0 ? 0 : (currentStep / total) * 100;
    fill.style.width = percent + "%";
}

function playBeep() {
    const beep = document.getElementById('beepSound');
    if (beep) beep.play().catch(() => {});
}

function startWorkout() {
    initFlow();
    currentStep = 0;
    nextStep();
}

function nextStep() {
    if (currentStep >= workoutFlow.length) {
        document.getElementById('workoutDisplay').innerText = "Workout Complete!";
        updateProgress();
        stopTimer();
        return;
    }

    document.getElementById('workoutDisplay').innerText = workoutFlow[currentStep];
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
            if (callback) callback();
        }
    }, 1000);
}

function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

function stopWorkout() {
    stopTimer();
    document.getElementById('workoutDisplay').innerText = "Workout stopped.";
}

function updateTimerText() {
    document.getElementById('timerText').innerText = `Timer: ${remaining.toString().padStart(2, '0')}`;
}

// init
window.onload = () => {
    document.body.classList.add('light');
    loadWeights();
    initFlow();
};
