const jsConfetti = new JSConfetti();
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0; //to get the score which is stored in localstorage
let countdown;
let ele = document.getElementById('timer');
let secondsRemaining = localStorage.getItem('timer') ? parseInt(localStorage.getItem('timer')) : 180; // To get the timer from localStorage

function closeAlert() {
    document.getElementById('timeAlert').style.display = 'none';
}

function displayPlayerName() {
    const playerNameElement = document.getElementById('playerName');
    const playerName = localStorage.getItem('username');
    playerNameElement.textContent = playerName ? playerName : 'Player Name';
}

$(document).ready(function () {
    startGame();
    displayPlayerName(); // player's name as soon as the home page opens
    updateScore(); // score displayed as soon as the home page is opened
});

function toggleMusic() {
    const music = document.getElementById("backgroundMusic");
    music.paused ? music.play() : music.pause();
}

function quit_fun() {
    window.location.href = "Login.html";
}

function showWrongAnswerIcon() {
    const wrapper = $("#wrongAnswerIcon");
    wrapper.show();

    setTimeout(() => {
        wrapper.hide();
    }, 2000);
}

function showTriviaQuestion() {
    fetch("http://127.0.0.1:5000/get_question")
        .then(response => response.json())
        .then(data => {
            const questionContent = $("#questionContent");

            questionContent.html(`
                <p>${data.question}</p>
                <ul>
                    <li onclick="selectAnswer(this, '${data.correct_answer}')">${data.answer_choices[0]}</li>
                    <li onclick="selectAnswer(this, '${data.correct_answer}')">${data.answer_choices[1]}</li>
                    <li onclick="selectAnswer(this, '${data.correct_answer}')">${data.answer_choices[2]}</li>
                    <li onclick="selectAnswer(this, '${data.correct_answer}')">${data.answer_choices[3]}</li>
                </ul>`);
            $("#questionPopup").css("display", "block");
        })
        .catch(error => {
            console.error("Error fetching trivia question:", error);
            showWrongAnswerIcon();
        });
}

function displayTriviaQuestionOnClick() {
    showTriviaQuestion();
}

function selectAnswer(element, correctAnswer) {
    $("#questionPopup").css("display", "none");
    const selectedAnswer = $(element).text();

    if (selectedAnswer === correctAnswer) {
        jsConfetti.addConfetti();
        score += 500;
        updateScore();
    } else {
        showWrongAnswerIcon();
    }

    changeMarkerToRed();
}

function updateScore() {
    $("#score").text(`Score: ${score}`);
    localStorage.setItem('score', score); //saves the score to localstorage
}

function pauseGame() {
    $("#pausePopup").css("display", "block");
    clearInterval(countdown); //starts timer
}

function continueGame() {
    $("#pausePopup").css("display", "none");
    initializeTimer(); //resumes timer
}

function toggleMenu() {
    const menuPopup = $("#menuPopup");
    menuPopup.css("display", menuPopup.css("display") === "none" ? "block" : "none");
}

function openRules() {
    window.open("rules.html", "_blank");
}

function startGame() {
    initializeTimer();
}

function initializeTimer() {
    updateTimerDisplay();
    startTimer();
}

function updateTimerDisplay() {
    const displayMinutes = Math.floor(secondsRemaining / 60);
    const displaySeconds = secondsRemaining % 60;
    ele.innerHTML = `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;

    if (secondsRemaining === 5) {
        document.getElementById('timeAlert').style.display = 'block';
    }
}

function startTimer() {
    clearInterval(countdown);
    countdown = setInterval(() => {
        if (secondsRemaining <= 0) {
            clearInterval(countdown);
            ele.innerHTML = '00:00';
            showEndOfGameWarning();
        } else {
            secondsRemaining--;
            updateTimerDisplay();
            localStorage.setItem('timer', secondsRemaining);
        }
    }, 1000);
}

function showEndOfGameWarning() {
    document.getElementById("warningMessage").style.display = "block";
}

function viewScore() {

    document.getElementById('scorePopup').style.display = 'flex';
    document.getElementById("warningMessage").style.display = "none";


    let scoreMessage = '';
    if (score >= 1500) {
        scoreMessage = 'Impressive!!';
    } else if (score >= 1000) {
        scoreMessage = 'Nice Work!';
    } else if (score >= 500) {
        scoreMessage = 'Not Bad';
    } else {
        scoreMessage = 'Better Luck Next Time';
    }


    document.getElementById('scoreMessage').textContent = scoreMessage + ' - Score: ' + score;


    document.getElementById('scorePopup').style.display = 'flex';
    document.getElementById('scorePopupCloseButton').style.display = 'inline-block';
}


function closeScorePopup() {
    document.getElementById('scorePopup').style.display = 'none';
}
