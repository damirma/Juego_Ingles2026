// ---------------------------------------------
// GRAMMAR DETECTIVE AGENCY: USED TO & PASSIVE VOICE
// The Case of the Missing Debate Trophy
//
// Deduction logic: each suspect has exactly 2 clues. Once both of a
// suspect's clues are revealed, that suspect is marked CLEARED or
// SUSPICIOUS based on the evidence. Only one suspect (Diana) stays
// SUSPICIOUS after all 8 clues — that's who the players must accuse.
// ---------------------------------------------

const SUSPECTS = [
  {
    id: "cruz",
    icon: "🧹",
    name: "Mr. Cruz",
    role: "School security guard",
    verdict: "cleared",
    verdictText:
      "✅ CLEARED — The badge scanner confirms Mr. Cruz's location all night: he was at the front gate, not near the trophy.",
  },
  {
    id: "reyes",
    icon: "🗝️",
    name: "Ms. Reyes",
    role: "School secretary, keeper of the keys",
    verdict: "cleared",
    verdictText:
      "✅ CLEARED — The master keys never left their locked box that night. Ms. Reyes had no way to open the trophy case.",
  },
  {
    id: "tom",
    icon: "📚",
    name: "Tom",
    role: "New exchange student",
    verdict: "cleared",
    verdictText:
      "✅ CLEARED — Tom stopped visiting the library two weeks ago and wasn't even in the building that night.",
  },
  {
    id: "diana",
    icon: "🎒",
    name: "Diana",
    role: "Rival team captain (Lincoln High)",
    verdict: "suspicious",
    verdictText:
      "⚠️ SUSPICIOUS — Diana broke her own routine that night, and she's the only visiting student who could have known the trophy's new location.",
  },
];

const CULPRIT_ID = "diana";

const ACCUSATION_FEEDBACK = {
  diana: {
    correct: true,
    text: "🎉 Case closed! It was Diana. She used to leave right after practice, but that night she stayed very late. She also toured the building recently, so she knew the trophy had been moved to the library — something most visiting teams didn't use to know. Everyone else has a confirmed alibi.",
  },
  cruz: {
    correct: false,
    text: "Not quite. Mr. Cruz is CLEARED — the badge scanner confirms his location at the front gate all night. Look for the suspect who is still SUSPICIOUS in the sidebar.",
  },
  reyes: {
    correct: false,
    text: "Not quite. Ms. Reyes is CLEARED — the digital log shows the key box was never opened that night. Look for the suspect who is still SUSPICIOUS in the sidebar.",
  },
  tom: {
    correct: false,
    text: "Not quite. Tom is CLEARED — the sign-in sheet shows he wasn't even in the library that night. Look for the suspect who is still SUSPICIOUS in the sidebar.",
  },
};

// Each clue belongs to exactly one suspect (suspectId).
// category / question / answer / unlockText follow the same pattern as before.
const CASE_FILE = [
  {
    suspectId: "cruz",
    category: "Used To — affirmative",
    question:
      "Complete with 'used to': Every night, Mr. Cruz ______ (lock) the front gate at exactly 9:00 PM, and the security camera confirms he did exactly that again this time.",
    answer: "used to lock",
    unlockText:
      "Mr. Cruz's nightly routine: he used to lock the front gate at 9 PM sharp — right when the trophy disappeared. The camera shows him doing exactly that, again, this time.",
  },
  {
    suspectId: "reyes",
    category: "Passive Voice — present",
    question:
      "Change to passive voice: 'The school keeps every master key inside a fingerprint-locked box in Ms. Reyes' office.'",
    answer:
      "Every master key is kept inside a fingerprint-locked box in Ms. Reyes' office.",
    unlockText:
      "Every master key is kept inside a fingerprint-locked box — only Ms. Reyes' fingerprint can open it.",
  },
  {
    suspectId: "tom",
    category: "Mixed Challenge",
    question:
      "Choose the correct sentence:\nA) Tom use to borrow books every Friday.\nB) Tom used to borrow books every Friday.",
    answer: "B — Tom used to borrow books every Friday.",
    unlockText:
      "It's true — Tom used to borrow books every Friday. He knows the library well... or he did, until recently.",
  },
  {
    suspectId: "diana",
    category: "Used To — negative",
    question:
      "Rewrite in the negative form: 'Diana used to leave right after her own team's practice.'",
    answer: "Diana didn't use to leave right after her own team's practice.",
    unlockText:
      "Diana didn't use to leave right after practice — but the night the trophy disappeared, she stayed long after everyone else had gone home.",
  },
  {
    suspectId: "cruz",
    category: "Passive Voice — present",
    question:
      "Complete with the correct passive form: 'Every guard's location ______ (record) automatically by the badge scanner at the front gate.'",
    answer: "is recorded",
    unlockText:
      "The badge scanner confirms it: Mr. Cruz's location is recorded automatically, and the log places him at the front gate all night.",
  },
  {
    suspectId: "reyes",
    category: "Passive Voice — past",
    question:
      "Find and correct the mistake: 'The key box were not opened at all that night, according to the digital log.'",
    answer:
      "The key box was not opened at all that night, according to the digital log.",
    unlockText:
      "The digital log confirms it: the key box was not opened at all that night. Whoever did this didn't use Ms. Reyes' keys.",
  },
  {
    suspectId: "tom",
    category: "Passive Voice — past",
    question:
      "Complete with the correct passive form: 'Tom ______ (not / see) in the library for the last two weeks, according to the sign-in sheet.'",
    answer: "was not seen",
    unlockText:
      "The sign-in sheet shows Tom was not seen in the library for two weeks. He wasn't even in the building that night.",
  },
  {
    suspectId: "diana",
    category: "Mixed Challenge — Final Clue",
    question:
      "Complete using BOTH a 'used to' structure and a passive voice structure: 'Most visiting teams ______ (not / know) about the trophy's new spot, because it ______ (move) to the library only last week — but Diana had just toured the building.'",
    answer: "didn't use to know / was moved",
    unlockText:
      "Most visiting teams didn't use to know about the trophy's new spot, because it was moved to the library only last week. But Diana had just toured the building — she knew exactly where to look.",
  },
];

const CLUES_PER_SUSPECT = 2;

let teams = [];
let currentClueIndex = 0;
let currentPoints = 100; // fixed value per clue, kept simple on purpose
let clueResolved = false; // guards against double-award / double-unlock on one clue
let caseClosed = false; // guards against changing the accusation or double-awarding the bonus
const SOLVE_BONUS = 300;
const revealedCountBySuspect = {};

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
const awardSection = document.getElementById("award-section");
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
const bonusSection = document.getElementById("bonus-section");
const bonusButtons = document.getElementById("bonus-buttons");
const noBonusBtn = document.getElementById("no-bonus-btn");
const finalScores = document.getElementById("final-scores");

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

  SUSPECTS.forEach((s) => (revealedCountBySuspect[s.id] = 0));

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
    row.id = `suspect-mini-${s.id}`;
    row.innerHTML = `
      <span class="icon">${s.icon}</span>
      <div class="info">
        <div class="name">${escapeHtml(s.name)}</div>
        <div class="role">${escapeHtml(s.role)}</div>
        <span class="status-badge unknown" id="status-badge-${s.id}">❓ Unknown</span>
      </div>
    `;
    suspectsList.appendChild(row);
  });
}

function maybeRevealVerdict(suspectId) {
  revealedCountBySuspect[suspectId] = (revealedCountBySuspect[suspectId] || 0) + 1;
  if (revealedCountBySuspect[suspectId] < CLUES_PER_SUSPECT) return;

  const suspect = SUSPECTS.find((s) => s.id === suspectId);
  const badge = document.getElementById(`status-badge-${suspectId}`);
  if (badge) {
    badge.className = `status-badge ${suspect.verdict}`;
    badge.textContent = suspect.verdict === "cleared" ? "✅ Cleared" : "⚠️ Suspicious";
  }

  addToCaseFile({ unlockIcon: "🕵️", unlockText: `VERDICT on ${suspect.name}: ${suspect.verdictText}` });
}

// ---------- CLUES ----------

function showClue(index) {
  currentClueIndex = index;
  clueResolved = false;
  const clue = CASE_FILE[index];

  progressLabel.textContent = `Clue ${index + 1} of ${CASE_FILE.length}`;
  clueCategory.textContent = clue.category;
  clueQuestion.textContent = clue.question;
  answerText.textContent = clue.answer;
  unlockText.textContent = `🔎 ${clue.unlockText}`;

  answerBlock.classList.add("hidden");
  unlockBlock.classList.add("hidden");
  awardSection.classList.remove("hidden");
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
  if (clueResolved) return;
  teams[teamIndex].score += currentPoints;
  updateScoreboard();
  unlockClue();
}

noOneBtn.addEventListener("click", () => unlockClue());

function unlockClue() {
  if (clueResolved) return;
  clueResolved = true;
  awardSection.classList.add("hidden");

  const clue = CASE_FILE[currentClueIndex];
  addToCaseFile({ unlockIcon: "🔓", unlockText: clue.unlockText });
  maybeRevealVerdict(clue.suspectId);

  unlockBlock.classList.remove("hidden");
}

function addToCaseFile(entry) {
  const emptyNote = caseFileList.querySelector(".empty-note");
  if (emptyNote) emptyNote.remove();

  const li = document.createElement("li");
  li.textContent = `${entry.unlockIcon} ${entry.unlockText}`;
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
      <span class="status-badge ${s.verdict}">${s.verdict === "cleared" ? "✅ Cleared" : "⚠️ Suspicious"}</span>
    `;
    card.addEventListener("click", () => makeAccusation(s.id));
    accusationSuspects.appendChild(card);
  });

  accusationModal.classList.remove("hidden");
}

function makeAccusation(suspectId) {
  if (caseClosed) return;
  const result = ACCUSATION_FEEDBACK[suspectId];

  accusationFeedback.textContent = result.text;
  accusationFeedback.className = `accusation-feedback ${result.correct ? "correct" : "wrong"}`;
  accusationFeedback.classList.remove("hidden");

  if (result.correct) {
    caseClosed = true;
    accusationSuspects.classList.add("closed");
    showBonusSection();
  }
}

// ---------- SOLVE BONUS & FINAL SCORE ----------

function showBonusSection() {
  bonusButtons.innerHTML = "";
  teams.forEach((team, i) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = team.name;
    btn.addEventListener("click", () => awardBonus(i));
    bonusButtons.appendChild(btn);
  });
  bonusSection.classList.remove("hidden");
}

function awardBonus(teamIndex) {
  if (bonusSection.classList.contains("hidden")) return;
  teams[teamIndex].score += SOLVE_BONUS;
  updateScoreboard();
  showFinalScore();
}

noBonusBtn.addEventListener("click", () => showFinalScore());

function showFinalScore() {
  bonusSection.classList.add("hidden");
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  finalScores.innerHTML =
    `<h3>🏆 Final Score</h3>` +
    sorted
      .map(
        (team, i) => `
      <div class="final-row">
        <span>${i === 0 ? "🏆 " : ""}${escapeHtml(team.name)}</span>
        <span>${team.score} pts</span>
      </div>
    `
      )
      .join("");
  finalScores.classList.remove("hidden");
  playAgainBtn.classList.remove("hidden");
}

// ---------- HELPERS ----------

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
