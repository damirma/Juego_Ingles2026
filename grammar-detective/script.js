// ---------------------------------------------
// GRAMMAR DETECTIVE AGENCY: USED TO & PASSIVE VOICE
// The Case of the Missing Debate Trophy
// ---------------------------------------------

const SUSPECTS = [
  { id: "cruz", icon: "🧹", name: "Mr. Cruz", role: "School security guard" },
  { id: "diana", icon: "🎒", name: "Diana", role: "Rival team captain (Lincoln High)" },
  { id: "reyes", icon: "🗝️", name: "Ms. Reyes", role: "School secretary, keeper of the keys" },
  { id: "tom", icon: "📚", name: "Tom", role: "New exchange student" },
];

const CULPRIT_ID = "diana";

const ACCUSATION_FEEDBACK = {
  diana: {
    correct: true,
    text: "🎉 Case closed! It was Diana. She used to leave right after practice, but that night she stayed very late. She also knew Mr. Cruz's OLD 9 PM patrol time — the exact moment he used to walk past the library, before his schedule changed. She needed Riverside's trophy gone before facing them in the final round.",
  },
  cruz: {
    correct: false,
    text: "Not quite, detective. Mr. Cruz's OLD schedule was exploited by someone else — remember, he doesn't patrol at 9 PM anymore. Ask yourself: who benefited from knowing his OLD time?",
  },
  reyes: {
    correct: false,
    text: "Not quite. Ms. Reyes keeps the keys safe, but nothing in the case file shows her breaking her own routine. Look again at Clue 2 and Clue 7.",
  },
  tom: {
    correct: false,
    text: "Good instinct, but Tom actually stopped visiting the library two weeks before the theft (see Clue 7) — that's his alibi. Think about who broke a routine, not who kept one.",
  },
};

// category, question, answer, unlockIcon, unlockText
const CASE_FILE = [
  {
    category: "Used To — affirmative",
    question:
      "Complete the sentence with 'used to': Every night, the security guard, Mr. Cruz, ______ (walk) past the library at exactly 9:00 PM. Last month, the school changed his schedule to 7:00 PM instead.",
    answer: "used to walk",
    unlockIcon: "⏰",
    unlockText:
      "TIME: The trophy disappeared around 9:00 PM — exactly when Mr. Cruz USED TO walk past the library. He doesn't anymore. Someone who knew his OLD schedule chose that time on purpose.",
  },
  {
    category: "Used To — negative",
    question:
      "Rewrite in the negative form: 'Diana used to leave right after her own team's practice.'",
    answer: "Diana didn't use to leave right after her own team's practice.",
    unlockIcon: "🎒",
    unlockText:
      "SUSPECT: Diana didn't use to leave right after practice — but the night the trophy disappeared, she stayed at Riverside very late. That's new behavior.",
  },
  {
    category: "Passive Voice — present",
    question:
      "Change to passive voice: 'Ms. Reyes keeps all the master keys in her office.'",
    answer: "All the master keys are kept in her office by Ms. Reyes.",
    unlockIcon: "🗝️",
    unlockText:
      "EVIDENCE: The master keys are kept in Ms. Reyes' office. Anyone who borrowed a key that night had to pass through her office first.",
  },
  {
    category: "Passive Voice — present",
    question:
      "Complete with the correct passive form: 'The library doors ______ (lock) automatically at 8:00 PM.'",
    answer: "are locked",
    unlockIcon: "🔒",
    unlockText:
      "LOCATION: The doors are locked automatically at 8:00 PM, but the trophy vanished at 9:00 PM. Someone was still inside after lock-time — or came back in.",
  },
  {
    category: "Passive Voice — past",
    question:
      "Change to passive voice: 'Somebody moved the trophy from the front hall to the library last week.'",
    answer: "The trophy was moved from the front hall to the library last week.",
    unlockIcon: "📍",
    unlockText:
      "LOCATION: The trophy was moved to the library just last week. Only someone who knew about this recent change could have found it there so quickly.",
  },
  {
    category: "Passive Voice — past",
    question:
      "Find and correct the mistake: 'The security camera were turned off five minutes before the theft.'",
    answer: "The security camera was turned off five minutes before the theft.",
    unlockIcon: "📷",
    unlockText:
      "EVIDENCE: The camera was deliberately turned off five minutes before the theft. This wasn't random — someone planned it in advance.",
  },
  {
    category: "Mixed Challenge",
    question:
      "Choose the correct sentence:\nA) Tom use to borrow books every Friday.\nB) Tom used to borrow books every Friday.",
    answer: "B — Tom used to borrow books every Friday.",
    unlockIcon: "📚",
    unlockText:
      "SUSPECT: True — but the librarian confirms Tom returned his last book two weeks ago and hasn't been back since. He may not be involved after all.",
  },
  {
    category: "Mixed Challenge — Final Clue",
    question:
      "Complete the final report using BOTH a 'used to' structure and a passive voice structure: 'Before the schedule changed, the guard ______ (patrol) the library at 9 PM, and that same night, the trophy ______ (see) for the last time on the shelf.'",
    answer:
      "...the guard used to patrol the library at 9 PM, and that same night, the trophy was seen for the last time on the shelf.",
    unlockIcon: "🔍",
    unlockText:
      "FINAL CLUE: Whoever did this knew the OLD 9 PM patrol time, knew the trophy's new spot in the library, and made sure the camera was off. This was someone close to the school's routine — but not on duty that night.",
  },
];

let teams = [];
let currentClueIndex = 0;
let currentPoints = 100; // fixed value per clue, kept simple on purpose

const setupScreen = document.getElementById("setup-screen");
const caseScreen = document.getElementById("case-screen");
const teamInputsContainer = document.getElementById("team-inputs");
const addTeamBtn = document.getElementById("add-team-btn");
const startGameBtn = document.getElementById("start-game-btn");

const scoreboardEl = document.getElementById("scoreboard");
const progressLabel = document.getElementById("progress-label");
const clueCategory = document.getElementById("clue-category");
const clueQuestion = document.getElementById("clue-question");
const showAnswerBtn = document.getElementById("show-answer-btn");
const answerBlock = document.getElementById("answer-block");
const answerText = document.getElementById("answer-text");
const awardButtons = document.getElementById("award-buttons");
const noOneBtn = document.getElementById("no-one-btn");
const unlockBlock = document.getElementById("unlock-block");
const unlockText = document.getElementById("unlock-text");
const nextClueBtn = document.getElementById("next-clue-btn");
const caseFileList = document.getElementById("case-file-list");
const suspectsList = document.getElementById("suspects-list");
const resetGameBtn = document.getElementById("reset-game-btn");

const accusationModal = document.getElementById("accusation-modal");
const accusationSuspects = document.getElementById("accusation-suspects");
const accusationFeedback = document.getElementById("accusation-feedback");
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

  buildScoreboard();
  buildSuspectsPanel();
  showClue(0);

  setupScreen.classList.add("hidden");
  caseScreen.classList.remove("hidden");
});

resetGameBtn.addEventListener("click", () => location.reload());
playAgainBtn.addEventListener("click", () => location.reload());

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

// ---------- SUSPECTS PANEL ----------

function buildSuspectsPanel() {
  suspectsList.innerHTML = "";
  SUSPECTS.forEach((s) => {
    const row = document.createElement("div");
    row.className = "suspect-mini";
    row.innerHTML = `
      <span class="icon">${s.icon}</span>
      <div>
        <div class="name">${escapeHtml(s.name)}</div>
        <div class="role">${escapeHtml(s.role)}</div>
      </div>
    `;
    suspectsList.appendChild(row);
  });
}

// ---------- CLUES ----------

function showClue(index) {
  currentClueIndex = index;
  const clue = CASE_FILE[index];

  progressLabel.textContent = `Clue ${index + 1} of ${CASE_FILE.length}`;
  clueCategory.textContent = clue.category;
  clueQuestion.textContent = clue.question;
  answerText.textContent = clue.answer;
  unlockText.textContent = `${clue.unlockIcon} ${clue.unlockText}`;

  answerBlock.classList.add("hidden");
  unlockBlock.classList.add("hidden");
  showAnswerBtn.classList.remove("hidden");

  buildAwardButtons();
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
  teams[teamIndex].score += currentPoints;
  updateScoreboard();
  unlockClue();
}

noOneBtn.addEventListener("click", () => unlockClue());

function unlockClue() {
  const clue = CASE_FILE[currentClueIndex];
  addToCaseFile(clue);
  unlockBlock.classList.remove("hidden");
}

function addToCaseFile(clue) {
  const emptyNote = caseFileList.querySelector(".empty-note");
  if (emptyNote) emptyNote.remove();

  const li = document.createElement("li");
  li.textContent = `${clue.unlockIcon} ${clue.unlockText}`;
  caseFileList.appendChild(li);
}

nextClueBtn.addEventListener("click", () => {
  if (currentClueIndex + 1 < CASE_FILE.length) {
    showClue(currentClueIndex + 1);
  } else {
    openAccusation();
  }
});

// ---------- ACCUSATION ----------

function openAccusation() {
  accusationSuspects.innerHTML = "";
  accusationFeedback.classList.add("hidden");
  playAgainBtn.classList.add("hidden");

  SUSPECTS.forEach((s) => {
    const card = document.createElement("div");
    card.className = "suspect-card";
    card.innerHTML = `
      <span class="icon">${s.icon}</span>
      <div class="name">${escapeHtml(s.name)}</div>
      <div class="role">${escapeHtml(s.role)}</div>
    `;
    card.addEventListener("click", () => makeAccusation(s.id));
    accusationSuspects.appendChild(card);
  });

  accusationModal.classList.remove("hidden");
}

function makeAccusation(suspectId) {
  const result = ACCUSATION_FEEDBACK[suspectId];

  accusationFeedback.textContent = result.text;
  accusationFeedback.className = `accusation-feedback ${result.correct ? "correct" : "wrong"}`;
  accusationFeedback.classList.remove("hidden");

  if (result.correct) {
    playAgainBtn.classList.remove("hidden");
  }
}

// ---------- HELPERS ----------

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
