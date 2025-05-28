// ==============================
// 初期データと設定
// ==============================

// 通常クイズデータ（初期設定）
const quizData = [
  {
    question: "HTMLとは何の略ですか？",
    choices: {
      a: "Hyper Text Markup Language",
      b: "High Transfer Machine Language",
      c: "Hyperlink and Text Modeling Language",
    },
    answer: "a",
  },
  {
    question: "CSSとは何の略ですか？",
    choices: {
      a: "Cascading Style Sheets",
      b: "Computer Style Syntax",
      c: "Color Sheet Script",
    },
    answer: "a",
  },
  {
    question: "JSONとは何の略ですか？",
    choices: {
      a: "Java Script Object Notation",
      b: "Java Serialized Object Name",
      c: "Java Source Output Network",
    },
    answer: "a",
  },
  {
    question: "UIとは何の略ですか？",
    choices: {
      a: "User Interface",
      b: "Unified Integration",
      c: "Universal Interaction",
    },
    answer: "a",
  },
  {
    question: "UXとは何の略ですか？",
    choices: {
      a: "User Experience",
      b: "Unified Example",
      c: "Universal Explosion",
    },
    answer: "a",
  },
];

// クイズ状態の初期化変数
let quizNum = 0;
let score = 0;
const maximum = 3; // 出題数上限
let missDate = [];
let shuffledData = [];
let isTimeAttack = false;
let timer = null;
const timeLimit = 10; // タイムアタック制限時間
let isCustomMode = false;

// ==============================
// 共通ユーティリティ
// ==============================

// 配列をシャッフル（Fisher-Yatesアルゴリズム）
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// クイズ表示用の親コンテナ
const container = document.createElement("div");
container.classList.add("container");
document.querySelector("#inner").appendChild(container);

// ==============================
// メインメニュー表示
// ==============================

const showMenu = () => {
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "モードを選んでください";
  container.appendChild(title);

  // 通常モード
  const normalBtn = document.createElement("button");
  normalBtn.textContent = "通常モード";
  normalBtn.classList.add("start");
  normalBtn.addEventListener("click", () => {
    isCustomMode = false;
    startQuiz(false);
  });
  container.appendChild(normalBtn);

  // タイムアタックモード
  const timeAttackBtn = document.createElement("button");
  timeAttackBtn.textContent = "タイムアタックモード";
  timeAttackBtn.classList.add("start");
  timeAttackBtn.addEventListener("click", () => {
    isCustomMode = false;
    startQuiz(true);
  });
  container.appendChild(timeAttackBtn);

  // 自作クイズ作成
  const createBtn = document.createElement("button");
  createBtn.textContent = "自作クイズを作成";
  createBtn.classList.add("createBtn", "start");
  createBtn.addEventListener("click", showCreateForm);
  container.appendChild(createBtn);

  // 自作クイズ一覧（編集・削除）
  const manageBtn = document.createElement("button");
  manageBtn.textContent = "自作クイズ一覧";
  manageBtn.classList.add("start");
  manageBtn.addEventListener("click", showCustomQuizList);
  container.appendChild(manageBtn);

  // スコア履歴
  const historyBtn = document.createElement("button");
  historyBtn.textContent = "スコア履歴を見る";
  historyBtn.classList.add("historyBtn");
  historyBtn.addEventListener("click", showHistory);
  container.appendChild(historyBtn);
};

// ==============================
// 自作クイズの作成・編集・一覧
// ==============================

const showCreateForm = () => {
  container.innerHTML = "<h2>クイズを作成</h2>";

  const form = document.createElement("form");
  form.innerHTML = `
    <div class="form-group"><label>問題文:<input type="text" id="question" required /></label></div>
    <div class="form-group"><label>選択肢A:<input type="text" id="a" required /></label></div>
    <div class="form-group"><label>選択肢B:<input type="text" id="b" required /></label></div>
    <div class="form-group"><label>選択肢C:<input type="text" id="c" required /></label></div>
    <div class="form-group"><label>正解:<select id="answer">
      <option value="a">A</option>
      <option value="b">B</option>
      <option value="c">C</option>
    </select></label></div>
    <button type="submit">保存する</button>
    <button type="button" onclick="showMenu()">キャンセル</button>
  `;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newQuiz = {
      question: form.question.value,
      choices: { a: form.a.value, b: form.b.value, c: form.c.value },
      answer: form.answer.value,
    };
    const saved = JSON.parse(localStorage.getItem("customQuizzes") || "[]");
    saved.push(newQuiz);
    localStorage.setItem("customQuizzes", JSON.stringify(saved));
    alert("クイズを保存しました！");
    showMenu();
  });

  container.appendChild(form);
};

const showCustomQuizList = () => {
  container.innerHTML = "<h2>自作クイズ一覧</h2>";

  const quizzes = JSON.parse(localStorage.getItem("customQuizzes") || "[]");

  if (quizzes.length === 0) {
    container.innerHTML += "<p>自作クイズが登録されていません。</p>";
  } else {
    quizzes.forEach((quiz, index) => {
      const div = document.createElement("div");
      div.classList.add("quizItem");

      const title = document.createElement("p");
      title.textContent = `${index + 1}. ${quiz.question}`;
      div.appendChild(title);

      const editBtn = document.createElement("button");
      editBtn.textContent = "編集";
      editBtn.addEventListener("click", () => showEditForm(index));
      div.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "削除";
      deleteBtn.addEventListener("click", () => {
        if (confirm("このクイズを削除しますか？")) {
          quizzes.splice(index, 1);
          localStorage.setItem("customQuizzes", JSON.stringify(quizzes));
          showCustomQuizList();
        }
      });
      div.appendChild(deleteBtn);

      container.appendChild(div);
    });
  }

  const backBtn = document.createElement("button");
  backBtn.textContent = "メニューに戻る";
  backBtn.classList.add("backMenuBtn");
  backBtn.addEventListener("click", showMenu);
  container.appendChild(backBtn);
};

const showEditForm = (index) => {
  const quizzes = JSON.parse(localStorage.getItem("customQuizzes") || "[]");
  const quiz = quizzes[index];

  container.innerHTML = "<h2>クイズを編集</h2>";

  const form = document.createElement("form");
  form.innerHTML = `
    <div class="form-group"><label>問題文:<input type="text" id="question" value="${
      quiz.question
    }" required /></label></div>
    <div class="form-group"><label>選択肢A:<input type="text" id="a" value="${
      quiz.choices.a
    }" required /></label></div>
    <div class="form-group"><label>選択肢B:<input type="text" id="b" value="${
      quiz.choices.b
    }" required /></label></div>
    <div class="form-group"><label>選択肢C:<input type="text" id="c" value="${
      quiz.choices.c
    }" required /></label></div>
    <div class="form-group"><label>正解:<select id="answer">
      <option value="a" ${quiz.answer === "a" ? "selected" : ""}>A</option>
      <option value="b" ${quiz.answer === "b" ? "selected" : ""}>B</option>
      <option value="c" ${quiz.answer === "c" ? "selected" : ""}>C</option>
    </select></label></div>
    <button type="submit">保存する</button>
    <button type="button" onclick="showCustomQuizList()">キャンセル</button>
  `;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const updatedQuiz = {
      question: form.question.value,
      choices: {
        a: form.a.value,
        b: form.b.value,
        c: form.c.value,
      },
      answer: form.answer.value,
    };
    quizzes[index] = updatedQuiz;
    localStorage.setItem("customQuizzes", JSON.stringify(quizzes));
    alert("クイズを更新しました！");
    showCustomQuizList();
  });

  container.appendChild(form);
};

// ==============================
// クイズ実行・出題・結果表示
// ==============================

const startQuiz = (timeAttack) => {
  quizNum = 0;
  score = 0;
  missDate = [];
  isTimeAttack = timeAttack;

  const baseData = isCustomMode
    ? JSON.parse(localStorage.getItem("customQuizzes") || "[]")
    : quizData;

  if (baseData.length === 0) {
    alert("自作クイズが見つかりません！");
    showMenu();
    return;
  }

  shuffledData = shuffle([...baseData]);
  isTimeAttack ? showCountdown(displayQuiz) : displayQuiz();
};

const showCountdown = (callback) => {
  container.innerHTML = "";
  const countDownEl = document.createElement("h2");
  countDownEl.classList.add("countdown");
  countDownEl.textContent = "3";
  container.appendChild(countDownEl);

  let count = 3;
  const countdownInterval = setInterval(() => {
    count--;
    countDownEl.textContent = count;
    if (count === 0) {
      clearInterval(countdownInterval);
      callback();
    }
  }, 800);
};

const displayQuiz = () => {
  container.innerHTML = "";
  const quizNumData = shuffledData[quizNum];

  // プログレスバー
  const progressWrap = document.createElement("div");
  progressWrap.classList.add("progress");
  const progressBar = document.createElement("div");
  progressBar.classList.add("progressBar");
  progressBar.style.width = `${(quizNum / maximum) * 100}%`;
  progressWrap.appendChild(progressBar);
  container.appendChild(progressWrap);

  // 問題文表示
  const quiz = document.createElement("h2");
  quiz.textContent = quizNumData.question;
  container.appendChild(quiz);

  // タイマー表示
  let timerDisplay;
  if (isTimeAttack) {
    timerDisplay = document.createElement("p");
    timerDisplay.classList.add("timer");
    container.appendChild(timerDisplay);

    let timeRemaining = timeLimit;
    timerDisplay.textContent = `制限時間: ${timeRemaining}秒`;

    timer = setInterval(() => {
      timeRemaining--;
      timerDisplay.textContent = `制限時間: ${timeRemaining}秒`;
      if (timeRemaining <= 0) {
        clearInterval(timer);
        missDate.push({
          question: quizNumData.question,
          answer: quizNumData.choices[quizNumData.answer],
          selected: "（未回答）",
          judgement: "×",
        });
        quizNum++;
        quizNum < maximum ? displayQuiz() : showResult();
      }
    }, 1000);
  }

  // 選択肢表示
  const choicesWrap = document.createElement("div");
  choicesWrap.classList.add("choicesWrap");
  const shuffledChoices = shuffle(Object.entries(quizNumData.choices));

  shuffledChoices.forEach(([key, value]) => {
    const btn = document.createElement("button");
    btn.textContent = value;
    btn.value = key;
    btn.addEventListener("click", () => {
      if (isTimeAttack && timer) clearInterval(timer);

      const isCorrect = key === quizNumData.answer;
      btn.classList.add(isCorrect ? "correct" : "incorrect");
      choicesWrap
        .querySelectorAll("button")
        .forEach((b) => (b.disabled = true));

      setTimeout(() => {
        if (!isCorrect) {
          missDate.push({
            question: quizNumData.question,
            answer: quizNumData.choices[quizNumData.answer],
            selected: value,
            judgement: "×",
          });
        } else {
          score++;
        }
        quizNum++;
        quizNum < maximum ? displayQuiz() : showResult();
      }, 800);
    });
    choicesWrap.appendChild(btn);
  });

  container.appendChild(choicesWrap);
};

const showResult = () => {
  container.innerHTML = "";

  const scoreTitle = document.createElement("h2");
  scoreTitle.textContent = `あなたのスコアは ${score} / ${maximum} です`;
  container.appendChild(scoreTitle);

  // 間違えた問題一覧
  if (missDate.length > 0) {
    const missTitle = document.createElement("h3");
    missTitle.textContent = "間違えた問題:";
    missTitle.classList.add("missTitle");
    container.appendChild(missTitle);

    missDate.forEach((item) => {
      const p = document.createElement("p");
      p.textContent = `${item.question} - 正解: ${item.answer}, 選択: ${item.selected}`;
      p.classList.add("missItem");
      container.appendChild(p);
    });
  }

  // 履歴保存
  const now = new Date();
  const record = {
    date: now.toLocaleString(),
    score,
    total: maximum,
    mode: isTimeAttack
      ? "タイムアタック"
      : isCustomMode
      ? "自作クイズ"
      : "通常",
  };
  const history = JSON.parse(localStorage.getItem("scoreHistory") || "[]");
  history.unshift(record);
  localStorage.setItem("scoreHistory", JSON.stringify(history.slice(0, 10)));

  // 再挑戦・戻るボタン
  const retryBtn = document.createElement("button");
  retryBtn.textContent = "もう一度";
  retryBtn.classList.add("restartBtn");
  retryBtn.addEventListener("click", () => {
    quizNum = 0;
    score = 0;
    missDate = [];
    shuffledData = shuffle([...shuffledData]);
    displayQuiz();
  });
  container.appendChild(retryBtn);

  const backBtn = document.createElement("button");
  backBtn.textContent = "メニューに戻る";
  backBtn.classList.add("backMenuBtn");
  backBtn.addEventListener("click", showMenu);
  container.appendChild(backBtn);
};

// ==============================
// スコア履歴の表示
// ==============================

const showHistory = () => {
  container.innerHTML = '<h2 class="scoreHistoryTitle">スコア履歴</h2>';
  const history = JSON.parse(localStorage.getItem("scoreHistory") || "[]");

  if (history.length === 0) {
    container.innerHTML += "<p>履歴がありません。</p>";
  } else {
    history.forEach((item) => {
      const p = document.createElement("p");
      p.textContent = `${item.date} - スコア: ${item.score}/${item.total} (${item.mode})`;
      p.classList.add("historyEntry"); // ← クラス追加
      container.appendChild(p);
    });
  }

  const backBtn = document.createElement("button");
  backBtn.textContent = "メニューに戻る";
  backBtn.classList.add("backMenuBtn");
  backBtn.addEventListener("click", showMenu);
  container.appendChild(backBtn);
};
// ==============================
// アプリ起動時の初期表示
// ==============================
showMenu();
