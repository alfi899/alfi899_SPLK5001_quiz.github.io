let questions = []; // Hier werden die Fragen aus der JSON-Datei gespeichert
let currentQuestionIndex = 0;
let correctCount = 0; // Anzahl der richtig beantworteten Fragen
let wrongCount = 0;   // Anzahl der falsch beantworteten Fragen

// HTML-Elemente referenzieren
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const questionCounterElement = document.getElementById("question-counter");
const answerButtonsElement = document.getElementById("answer-buttons");
const resultContainer = document.getElementById("result-container");
const resultMessage = document.getElementById("result-message");
const nextButton = document.getElementById("next-button");
const backButton = document.getElementById("back-button");

// Neues Element für die Endstatistik
const statsContainer = document.createElement("div");
statsContainer.id = "stats-container";
statsContainer.style.display = "none";
document.body.appendChild(statsContainer);

async function loadQuestions() {
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
  correctCount = 0;
  wrongCount = 0;
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
    correctCount++; // Richtige Antwort zählen
  } else {
    button.classList.add("wrong");
    resultMessage.innerText = "Falsch!";
    wrongCount++; // Falsche Antwort zählen
  }

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
    showFinalStats();
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

// Zeigt die Endstatistik an
function showFinalStats() {
  questionContainer.innerHTML = ""; // Löscht den Fragebereich
  resultContainer.style.display = "none";

  const percentage = ((correctCount / questions.length) * 100).toFixed(2); // Prozentzahl berechnen

  statsContainer.style.display = "block";
  statsContainer.innerHTML = `
    <h2>Quiz abgeschlossen!</h2>
    <p>Richtig beantwortet: ${correctCount}</p>
    <p>Falsch beantwortet: ${wrongCount}</p>
    <p>Gesamtanzahl der Fragen: ${questions.length}</p>
    <p><strong>Ergebnis: ${percentage}% richtig</strong></p>
  `;
}

loadQuestions();
