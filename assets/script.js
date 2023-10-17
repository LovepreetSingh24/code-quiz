document.addEventListener("DOMContentLoaded", function () {
    
    const quizQuestions = [
        {
            question: "Commonly used data types DO NOT include:",
            answers: ["strings", "booleans", "alerts", "numbers"],
            correctAnswer: "alerts"
        },
        {
            question: "The condition in an if / else statement is enclosed with _____.",
            answers: ["quotes", "curly brackets", "parenthesis", "square brackets"],
            correctAnswer: "parenthesis"
        },
        {
            question: "Arrays in JavaScript can be used to store _____.",
            answers: ["numbers and strings", "other arrays", "booleans", "all of the above"],
            correctAnswer: "all of the above"
        },
        {
            question: "String values must be enclosed within _____ when being assigned to variables.",
            answers: ["commas", "curly brackets", "quotes", "parenthesis"],
            correctAnswer: "quotes"
        },
        {
            question: "A very useful tool used during developtment and debugging for printing content to the debugger is:",
            answers: ["JavaScript", "terminal/bash", "for loops", "console.log"],
            correctAnswer: "console.log"
        },
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let time = 60;
    let timerInterval;

    const startButton = document.getElementById("start-button");
    const timerElement = document.getElementById("timer");
    const questionContainer = document.getElementById("question-container");
    const gameOverElement = document.getElementById("game-over");
    const initialsInput = document.getElementById("initials");

    function startQuiz() {
        startButton.style.display = "none";
        timerInterval = setInterval(updateTimer, 1000);
        displayQuestion();
    }

    startButton.addEventListener("click", startQuiz);

    function updateTimer() {
        time--;
        timerElement.textContent = `Time: ${time}`;

        if (time <= 0 || currentQuestionIndex >= quizQuestions.length) {
            endQuiz();
        }
    }

    function displayQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <h2>${currentQuestion.question}</h2>
            <ul>
                ${currentQuestion.answers.map(answer => `<li>${answer}</li>`).join("")}
            </ul>
        `;

        const answerElements = questionContainer.querySelectorAll("li");
        answerElements.forEach(answer => {
            answer.addEventListener("click", checkAnswer);
        });
    }

    function checkAnswer(event) {
        const selectedAnswer = event.target.textContent;
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const feedbackMessage = document.getElementById("feedback-message");
    
        if (selectedAnswer === currentQuestion.correctAnswer) {
            score = time;
            feedbackMessage.textContent = "Correct!";
        } else {
            time -= 10;
            feedbackMessage.textContent = "Wrong!"
        }
    
        currentQuestionIndex++;
    
        if (currentQuestionIndex < quizQuestions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }

    function displayHighScores() {
        const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        const highScoresElement = document.getElementById("high-scores");
        highScoresElement.innerHTML = "";

        const highScoresParagraph = document.createElement("p");
        highScoresParagraph.textContent = "High Scores:";
        highScoresElement.appendChild(highScoresParagraph);

        const ul = document.createElement("ul");
        highScores.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${entry.initials} - ${entry.score}`;
            ul.appendChild(listItem);
        });

        highScoresElement.appendChild(ul);
    }

    function endQuiz() {
        clearInterval(timerInterval);
        timerElement.textContent = "Time's up!";
        questionContainer.style.display = "none";
        gameOverElement.style.display = "block";
        initialsInput.style.display = "block";

        document.getElementById("score").textContent = score;
    }

    initialsInput.addEventListener("input", function () {
        initialsInput.value = initialsInput.value.slice(0, 3);
    });

    function saveScore() {
        const initials = initialsInput.value.trim();
        if (initials === "") {
            alert("Please enter your initials.");
            return;
        }
    
        const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push({ initials, score });
        
        highScores.sort((a, b) => b.score - a.score);
    
        highScores.splice(10);
    
        localStorage.setItem("highScores", JSON.stringify(highScores));
        
        displayHighScores();
    }

    const saveScoreButton = document.getElementById("save-score");
    saveScoreButton.addEventListener("click", saveScore);

    const retryButton = document.createElement("button");
    retryButton.textContent = "Retry Quiz";
    const clearScoresButton = document.createElement("button");
    clearScoresButton.textContent = "Clear High Scores";

    const highScoresElement = document.createElement("div");
    highScoresElement.id = "high-scores";

    gameOverElement.appendChild(retryButton);
    gameOverElement.appendChild(clearScoresButton);
    gameOverElement.appendChild(highScoresElement);

    retryButton.addEventListener("click", startQuizAgain);

    clearScoresButton.addEventListener("click", clearHighScores);

    function startQuizAgain() {
        currentQuestionIndex = 0;
        score = 0;
        time = 60;
        clearInterval(timerInterval);
        timerElement.textContent = `Time: ${time}`;
        questionContainer.style.display = "block";
        gameOverElement.style.display = "none";
        initialsInput.style.display = "none";
        startQuiz();
        const feedbackMessage = document.getElementById("feedback-message");
        feedbackMessage.textContent = ""
    }

    function clearHighScores() {
        localStorage.removeItem("highScores");
        displayHighScores();
    }

    displayHighScores();
});