// ======================================================
// QUESTIONS
// ======================================================
const questions = [
   {
    question: "Which keyword declares a block-scoped variable that can later be reassigned?",
    choices: ["var", "let", "const", "static"],
    answer: 1,
    explanation: "let declares a block-scoped variable whose value may later be reassigned.",
   },
   {
    question: "What is the output of type of null in JavaScript?",
    choices: ["null", "undefined", "object", "number"],
    answer: 2,
    explanation: "Due to a historical bug in JavaScript, typeof null returns 'object'."
  },
  {
    question: "Which function is used to parse a string argument and return an integer?",
    choices: ["parseFloat()", "parseInt()", "Number()", "Math.floor()"],
    answer: 1,
    explanation: "parseInt() parses a string argument and returns an integer of the specified radix."
  },
  {
    question: "How do you write a single-line comment in JavaScript?",
    choices: ["<!-- comment -->", "/* comment */", "// comment", "** comment"],
    answer: 2,
    explanation: "Single-line comments in JavaScript start with two forward slashes (//)."
  },
  {
    question: "Which property gives the number of elements in a JavaScript array?",
    choices: ["size", "length", "count", "index"],
    answer: 1,
    explanation: "The length property returns the number of elements in an array."
  },
  {
    question: "What does the 'return' statement do inside a JavaScript function?",
    choices: ["Stops the function execution and sends a value back", "Restarts the function loop", "Prints a value to the console", "Declares a local variable"],
    answer: 0,
    explanation: "When the 'return' statement is reached, the function stops executing and returns the specified value to the caller."
  },
  {
    question: "Which operator is used to assign a default value to a variable if the expression to its left is null or undefined?",
    choices: ["&&", "||", "??", "?:"],
    answer: 2,
    explanation: "The nullish coalescing operator (??) returns its right-hand side operand when its left-hand side operand is null or undefined."
  },
  {
    question: "Which built-in JavaScript object method is used to round a number UP to its nearest integer?",
    choices: ["Math.floor()", "Math.round()", "Math.ceil()", "Math.trunc()"],
    answer: 2,
    explanation: "Math.ceil() rounds a number upward to its nearest integer."
  },
  {
    question: "Which method is used to combine two or more arrays in JavaScript?",
    choices: ["append()", "concat()", "join()", "combine()"],
    answer: 1,
    explanation: "The concat() method is used to merge two or more arrays without changing the existing arrays."
  },
  {
    question: "Which method converts a JavaScript object into a JSON string?",
    choices: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
    answer: 1,
    explanation: "JSON.stringify() converts a JavaScript value or object into a JSON string."
  },
];
// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = new Array(questions.length);

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
  if (currentQuestion < questions.length - 1) {
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
  currentQuestion = questions.length - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
function calculateScore() {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) {
      score = score + 1;
    }
  }
  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  return Math.round((score / questions.length) * 100);}

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
function buildCorrection() {
  let correction = "";

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
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
function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // --------------------------------------------------
  // QUESTION
  // --------------------------------------------------
  document.getElementById("questionText").textContent = q.question;

  // --------------------------------------------------
  // CHOICES
  // --------------------------------------------------
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

  // --------------------------------------------------
  // NAVIGATION BUTTONS
  // --------------------------------------------------
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
renderQuestion();
