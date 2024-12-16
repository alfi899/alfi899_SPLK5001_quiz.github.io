let questions = []; // Hier werden die Fragen aus der JSON-Datei gespeichert
let currentQuestionIndex = 0;

// HTML-Elemente referenzieren
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const questionCounterElement = document.getElementById("question-counter");
const answerButtonsElement = document.getElementById("answer-buttons");
const resultContainer = document.getElementById("result-container");
const resultMessage = document.getElementById("result-message");
const nextButton = document.getElementById("next-button");
const backButton = document.getElementById("back-button");

async function loadQuestions() {
  // JSON-Datei laden
  const response = await fetch("questions.json");
  questions = await response.json();
  shuffleQuestions();
  startQuiz();
}

// Fragen zufällig mischen
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }

function startQuiz() {
  currentQuestionIndex = 0;
  showQuestion(questions[currentQuestionIndex]);
  updateQuestionCounter();
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  answerButtonsElement.innerHTML = "";
  question.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(answer, button));
    answerButtonsElement.appendChild(button);
  });
  resultContainer.style.display = "none";
}

function updateQuestionCounter() {
  questionCounterElement.innerText = `Frage ${currentQuestionIndex + 1} / ${questions.length}`;
}

function selectAnswer(answer, button) {
  const correct = answer.correct;
  if (correct) {
    button.classList.add("correct");
    resultMessage.innerText = "Richtig!";
  } else {
    button.classList.add("wrong");
    resultMessage.innerText = "Falsch!";
  }
  // Erklärung anzeigen
  const explanation = document.createElement("p");
  explanation.innerText = questions[currentQuestionIndex].explanation;
  resultMessage.appendChild(explanation);
  resultContainer.style.display = "block";

  Array.from(answerButtonsElement.children).forEach(btn => {
    btn.disabled = true;
  });
}

// Nächste Frage
nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion(questions[currentQuestionIndex]);
    updateQuestionCounter();
  } else {
    questionElement.innerText = "Quiz abgeschlossen!";
    answerButtonsElement.innerHTML = "";
    resultContainer.style.display = "none";
    questionCounterElement.innerText = `Fragen beendet`;
  }
});

// Zurück zur vorherigen Frage
backButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(questions[currentQuestionIndex]);
    updateQuestionCounter();
  } else {
    resultMessage.innerText = "Keine vorherige Frage!";
    resultContainer.style.display = "block";
  }
});

// Quiz initialisieren
loadQuestions();
