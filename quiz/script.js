const app = document.getElementById("app");

const quizData = [
  { q: "日本の首都は？", a: "東京" },
  { q: "富士山の標高は？", a: "3776" },
  { q: "りんごは英語で？", a: "apple" },
  { q: "3×4は？", a: "12" },
  { q: "地球は何番目の惑星？", a: "3" },
];

let shuffledQuiz = [];
let currentIndex = 0;
let correctCount = 0;
let incorrectAnswers = [];
let timer = null;
let timeLeft = 20;
let mode = "normal";

function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function showMenu() {
  app.innerHTML = `
    <h2>モード選択</h2>
    <button onclick="startQuiz('normal')">通常モード</button>
    <button onclick="startQuiz('timeAttack')">タイムアタック</button>
  `;
}

function startQuiz(selectedMode) {
  mode = selectedMode;
  shuffledQuiz = shuffleArray(quizData);
  currentIndex = 0;
  correctCount = 0;
  incorrectAnswers = [];
  if (mode === "timeAttack") {
    timeLeft = 20;
    startTimer();
  }
  showQuestion();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResult();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerDiv = document.getElementById("timer");
  if (timerDiv) timerDiv.textContent = `残り時間: ${timeLeft}秒`;
}

function showQuestion() {
  if (mode === "timeAttack" && timeLeft <= 0) return;

  if (currentIndex >= shuffledQuiz.length) {
    if (mode === "timeAttack") {
      // タイムアタック中でもクイズが尽きたら終わり
      clearInterval(timer);
    }
    showResult();
    return;
  }

  const current = shuffledQuiz[currentIndex];
  app.innerHTML = `
    ${
      mode === "timeAttack"
        ? `<div id="timer">残り時間: ${timeLeft}秒</div>`
        : ""
    }
    <h2>Q${currentIndex + 1}: ${current.q}</h2>
    <input type="text" id="answer" placeholder="答えを入力" />
    <button onclick="submitAnswer()">回答する</button>
  `;
}

function submitAnswer() {
  const input = document.getElementById("answer");
  const userAnswer = input.value.trim();
  const correctAnswer = shuffledQuiz[currentIndex].a;

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    correctCount++;
  } else {
    incorrectAnswers.push({
      q: shuffledQuiz[currentIndex].q,
      your: userAnswer,
      correct: correctAnswer,
    });
  }

  currentIndex++;
  showQuestion();
}

function showResult() {
  clearInterval(timer);
  let html = `
    <h2>結果</h2>
    <p>正解数: ${correctCount} / ${shuffledQuiz.length}</p>
    ${incorrectAnswers.length ? "<h3>間違えた問題:</h3>" : ""}
    <ul>
      ${incorrectAnswers
        .map(
          (item) => `
        <li>
          <strong>${item.q}</strong><br>
          あなたの答え: ${item.your}<br>
          正解: ${item.correct}
        </li>
      `
        )
        .join("")}
    </ul>
    <button onclick="showMenu()">メニューに戻る</button>
  `;
  app.innerHTML = html;
}

// 初期表示
showMenu();
