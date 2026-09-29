// ---------------------------------------------
// GRAMMAR JEOPARDY: USED TO & PASSIVE VOICE
// ---------------------------------------------

const CATEGORIES = ["Used To", "Passive – Present", "Passive – Past", "Mixed Challenge"];
const VALUES = [100, 200, 300, 400, 500];

// questions[categoryIndex][valueIndex] = { q, a }
const QUESTIONS = [
  // 0: Used To
  [
    { q: "Complete the sentence with the correct form of 'play': When I was a child, I ______ in the park every day.", a: "used to play" },
    { q: "Which sentence is grammatically correct?\nA) She use to live in Bogotá.\nB) She used to live in Bogotá.\nC) She uses to live in Bogotá.", a: "B — She used to live in Bogotá." },
    { q: "Rewrite in the negative form: 'He used to smoke.'", a: "He didn't use to smoke." },
    { q: "Find and correct the mistake: 'I use to wake up early when I was in school.'", a: "I used to wake up early when I was in school." },
    { q: "Turn this into a yes/no question: 'They used to live in Medellín.'", a: "Did they use to live in Medellín?" },
  ],
  // 1: Passive – Present
  [
    { q: "Change to passive voice: 'The teacher checks the homework every day.'", a: "The homework is checked by the teacher every day." },
    { q: "Complete with the correct passive form: 'The reports ______ (send) every Monday.'", a: "are sent" },
    { q: "Change to passive voice (don't mention who does it): 'They deliver the packages on Fridays.'", a: "The packages are delivered on Fridays." },
    { q: "Find and correct the mistake: 'The document is checking by the manager.'", a: "The document is checked by the manager." },
    { q: "Change to passive voice: 'Somebody cleans this office every morning.'", a: "This office is cleaned every morning." },
  ],
  // 2: Passive – Past
  [
    { q: "Change to passive voice: 'The company built this office in 2010.'", a: "This office was built by the company in 2010." },
    { q: "Complete with the correct passive form: 'The email ______ (send) yesterday.'", a: "was sent" },
    { q: "Find and correct the mistake: 'The cake were baked by my mom.'", a: "The cake was baked by my mom." },
    { q: "Change to passive voice: 'Someone stole my phone last night.'", a: "My phone was stolen last night." },
    { q: "Change to passive voice: 'The workers finished the project two weeks ago.'", a: "The project was finished two weeks ago." },
  ],
  // 3: Mixed Challenge
  [
    { q: "Choose the correct sentence:\nA) I used to be work here.\nB) I used to work here.", a: "B — I used to work here." },
    { q: "Is this sentence 'used to' (habit) or passive voice? 'This app is used by millions of people.'", a: "Passive voice (not 'used to')." },
    { q: "Complete using 'used to': 'In the 1990s, people ______ (not / have) internet at home.'", a: "didn't use to have" },
    { q: "Find and correct BOTH mistakes: 'The bridge is build in 1930 and people use to cross it by foot.'", a: "The bridge was built in 1930, and people used to cross it on foot." },
    { q: "FINAL CHALLENGE: Write one sentence using 'used to' AND one sentence in the passive voice, both about how technology has changed.", a: "Example: 'People used to write letters. Now, most messages are sent by phone.' (any correct equivalent counts)" },
  ],
];

let teams = [];
let currentCell = null; // { categoryIndex, valueIndex, points, btn }
let cellsAnswered = 0;
let cellResolved = false; // guards against double-award / double-close on one question
let currentTurnIndex = 0; // classic Jeopardy "control": who picks the next question
const TOTAL_CELLS = CATEGORIES.length * VALUES.length;

const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const teamInputsContainer = document.getElementById("team-inputs");
const addTeamBtn = document.getElementById("add-team-btn");
const startGameBtn = document.getElementById("start-game-btn");

const scoreboardEl = document.getElementById("scoreboard");
const turnIndicatorEl = document.getElementById("turn-indicator");
const boardEl = document.getElementById("board");
const resetGameBtn = document.getElementById("reset-game-btn");

const questionModal = document.getElementById("question-modal");
const modalCategory = document.getElementById("modal-category");
const modalPoints = document.getElementById("modal-points");
const modalQuestion = document.getElementById("modal-question");
const showAnswerBtn = document.getElementById("show-answer-btn");
const answerBlock = document.getElementById("answer-block");
const modalAnswer = document.getElementById("modal-answer");
const awardSection = document.getElementById("award-section");
const awardButtons = document.getElementById("award-buttons");
const noOneBtn = document.getElementById("no-one-btn");

const finalModal = document.getElementById("final-modal");
const finalScores = document.getElementById("final-scores");
const playAgainBtn = document.getElementById("play-again-btn");

// ---------- SETUP ----------

addTeamBtn.addEventListener("click", () => {
  const currentCount = teamInputsContainer.querySelectorAll(".team-name-input").length;
  if (currentCount >= 4) return;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "team-name-input";
  input.placeholder = `Team ${currentCount + 1} name`;
  input.value = `Team ${currentCount + 1}`;
  teamInputsContainer.appendChild(input);
  if (currentCount + 1 >= 4) addTeamBtn.disabled = true;
});

startGameBtn.addEventListener("click", () => {
  const inputs = [...teamInputsContainer.querySelectorAll(".team-name-input")];
  teams = inputs.map((el, i) => ({
    name: el.value.trim() || `Team ${i + 1}`,
    score: 0,
  }));

  currentTurnIndex = 0;
  buildScoreboard();
  buildBoard();
  updateTurnIndicator();

  setupScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
});

resetGameBtn.addEventListener("click", () => {
  location.reload();
});

playAgainBtn.addEventListener("click", () => {
  location.reload();
});

// ---------- SCOREBOARD ----------

function buildScoreboard() {
  scoreboardEl.innerHTML = "";
  teams.forEach((team, i) => {
    const card = document.createElement("div");
    card.className = "score-card";
    card.id = `score-card-${i}`;
    card.innerHTML = `
      <div class="team-label">${escapeHtml(team.name)}</div>
      <div class="team-score">${team.score}</div>
    `;
    scoreboardEl.appendChild(card);
  });
}

function updateScoreboard() {
  teams.forEach((team, i) => {
    const card = document.getElementById(`score-card-${i}`);
    if (card) card.querySelector(".team-score").textContent = team.score;
  });
}

function updateTurnIndicator() {
  teams.forEach((team, i) => {
    const card = document.getElementById(`score-card-${i}`);
    if (card) card.classList.toggle("active-turn", i === currentTurnIndex);
  });
  turnIndicatorEl.innerHTML = `${emoji("point-right")} ${escapeHtml(teams[currentTurnIndex].name)}'s turn — pick a category!`;
}

// ---------- BOARD ----------

function buildBoard() {
  boardEl.innerHTML = "";

  // header row
  CATEGORIES.forEach((cat) => {
    const header = document.createElement("div");
    header.className = "category-header";
    header.textContent = cat;
    boardEl.appendChild(header);
  });

  // value rows
  VALUES.forEach((value, valueIndex) => {
    CATEGORIES.forEach((cat, categoryIndex) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = `$${value}`;
      cell.dataset.categoryIndex = categoryIndex;
      cell.dataset.valueIndex = valueIndex;
      cell.addEventListener("click", () => openQuestion(categoryIndex, valueIndex, value, cell));
      boardEl.appendChild(cell);
    });
  });
}

// ---------- QUESTION MODAL ----------

function openQuestion(categoryIndex, valueIndex, points, cellEl) {
  const item = QUESTIONS[categoryIndex][valueIndex];
  currentCell = { categoryIndex, valueIndex, points, cellEl };
  cellResolved = false;

  modalCategory.textContent = CATEGORIES[categoryIndex];
  modalPoints.textContent = `$${points}`;
  modalQuestion.textContent = item.q;
  modalAnswer.textContent = item.a;

  answerBlock.classList.add("hidden");
  awardSection.classList.remove("hidden");
  showAnswerBtn.classList.remove("hidden");

  buildAwardButtons();

  questionModal.classList.remove("hidden");
}

showAnswerBtn.addEventListener("click", () => {
  answerBlock.classList.remove("hidden");
  showAnswerBtn.classList.add("hidden");
});

function buildAwardButtons() {
  awardButtons.innerHTML = "";
  teams.forEach((team, i) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = team.name;
    btn.addEventListener("click", () => awardPoints(i));
    awardButtons.appendChild(btn);
  });
}

function awardPoints(teamIndex) {
  if (cellResolved) return;
  cellResolved = true;
  awardSection.classList.add("hidden");

  teams[teamIndex].score += currentCell.points;
  updateScoreboard();
  currentTurnIndex = teamIndex; // classic Jeopardy rule: correct answer keeps control
  updateTurnIndicator();
  closeQuestion();
}

noOneBtn.addEventListener("click", () => {
  if (cellResolved) return;
  cellResolved = true;
  awardSection.classList.add("hidden");

  currentTurnIndex = (currentTurnIndex + 1) % teams.length; // pass control to the next team
  updateTurnIndicator();
  closeQuestion();
});

function closeQuestion() {
  currentCell.cellEl.classList.add("used");
  questionModal.classList.add("hidden");
  cellsAnswered++;
  currentCell = null;

  if (cellsAnswered >= TOTAL_CELLS) {
    showFinalScore();
  }
}

// ---------- FINAL SCORE ----------

function showFinalScore() {
  // game over: no team has the turn anymore
  document.querySelectorAll(".score-card").forEach((card) => card.classList.remove("active-turn"));
  turnIndicatorEl.innerHTML = `${emoji("checkered-flag")} Game over!`;

  const sorted = [...teams].sort((a, b) => b.score - a.score);
  finalScores.innerHTML = sorted
    .map(
      (team, i) => `
      <div class="final-row">
        <span>${i === 0 ? emoji("trophy") + " " : ""}${escapeHtml(team.name)}</span>
        <span>${team.score} pts</span>
      </div>
    `
    )
    .join("");
  finalModal.classList.remove("hidden");
}

// ---------- HELPERS ----------

// OpenMoji image (assets/openmoji/<name>.svg) used instead of system emojis
function emoji(name) {
  return `<img class="emoji" src="../assets/openmoji/${name}.svg" alt="">`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
