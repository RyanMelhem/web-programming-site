// ======================================================
// QUESTIONS
// ======================================================
let total = 0;
const cache = {};
// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = [];

// ======================================================
// HELPER FETCHES ONE QUESTION
// ======================================================
async function getQuestion(index) {
  if(cache[index] !== undefined){
    return cache[index];
  }
  const response = await fetch(`/api/question/${index}`)
  if(!response.ok){
    throw new Error("HTTP " + response.status);
  }
  const data = await response.json();
  cache[index] = data;
  return data;
}

// ======================================================
// SAVE AN ANSWER
// ======================================================
function saveAnswer(choiceIndex) {
  userAnswers[currentQuestion] = choiceIndex;
}

// ======================================================
// NAVIGATION
// ======================================================
function goNext() {
  if (currentQuestion < total - 1) {
    currentQuestion = currentQuestion + 1;
    renderQuestion();
  }
}

function goPrevious() {
  if (currentQuestion > 0) {
    currentQuestion = currentQuestion - 1;
    renderQuestion();
  }
}

function goFirst() {
  currentQuestion = 0;
  renderQuestion();
}
function goLast() {
  currentQuestion = total - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
async function calculateScore() {
  let score = 0;
  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    if (userAnswers[i] === q.answer) {
      score = score + 1;
    }
  }
  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  return Math.round((score / total) * 100);}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60) {
    return "Good";
  } else if (percentage >= 50) {
    return "Pass";
  } else {
    return "Needs improvement";
  }
}

// ======================================================
// BUILD CORRECTION
// ======================================================
async function buildCorrection() {
  let correction = "";

  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    const userAnswerIndex = userAnswers[i];
    const userAnswerText =
      userAnswerIndex === undefined ? "Not answered" : q.choices[userAnswerIndex];
    const correctAnswerText = q.choices[q.answer];
    const isCorrect = userAnswerIndex === q.answer;

    correction += `Question ${i + 1}: ${q.question}\n`;
    correction += `Your answer: ${userAnswerText}\n`;
    correction += `Correct answer: ${correctAnswerText}\n`;
    correction += `Result: ${isCorrect ? "Correct" : "Incorrect"}\n`;
    correction += `Explanation: ${q.explanation}\n\n`;
  }

  return correction;
}

// ======================================================
// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.
// ======================================================

// ======================================================
// SUBMIT QUIZ
// ======================================================
async function submitQuiz() {
  const error = document.getElementById("error");
  try{
    const score = await calculateScore();
    const percentage = calculatePercentage(score);
    const message = getPerformanceMessage(percentage);
    const correction = await buildCorrection();
    showResults(score, percentage, message, correction);
  }
  catch(err){
    error.textContent = "Could not submit the quiz: " + err.message;
    error.hidden = false;
  }
}

async function renderQuestion() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  loading.hidden = false;
  error.hidden = true;
  try {
    const q = await getQuestion(currentQuestion);
    document.getElementById("progress").textContent = `Question ${currentQuestion + 1} of ${total}`;
    document.getElementById("questionText").textContent = q.question;
    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";
    for (let i = 0; i < q.choices.length; i++) {
      const label = document.createElement("label");
      label.className = "choice";
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "answer";
      radio.value = i;
      // Restore an answer previously selected
      // by the user.
      if (userAnswers[currentQuestion] === i) {
        radio.checked = true;
      }
      // When the user selects this answer,
      // save its index.
      radio.onclick = function () {
        saveAnswer(i);
      };
      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + q.choices[i]));
      choicesContainer.appendChild(label);
    }
    document.getElementById("firstBtn").disabled = currentQuestion === 0;
    document.getElementById("previousBtn").disabled = currentQuestion === 0;
    document.getElementById("nextBtn").disabled =
      currentQuestion === total - 1;
    document.getElementById("lastBtn").disabled =
      currentQuestion === total - 1;
    }
    catch(err){
      error.textContent = "Could not load the question: " + err.message;
      error.hidden = false;
    }
    finally{
      loading.hidden = true;
    }
}


// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${total}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
async function init(){
  const error = document.getElementById("error");
  try{
    const response = await fetch("/api/questions/count");
    if(!response.ok){
      throw new Error("HTTP " + response.status);
    }
    const data = await response.json();
    total = data.count;
    await renderQuestion();
 }
 catch (errr){
  error.textContent = "Could not load the quiz: " + errr.message;
  error.hidden = false;
 }
}
init();