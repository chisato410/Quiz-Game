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

let quizNum = 0;
let score = 0;
const maximum = 3;
let missDate = [];
let shuffledData = [];

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const container = document.createElement("div");
container.classList.add("container");
document.querySelector("#inner").appendChild(container);

// トップメニュー画面
const showMenu = () => {
  container.innerHTML = "";

  const startBtn = document.createElement("button");
  startBtn.textContent = "クイズをはじめる";
  startBtn.classList.add("start");
  startBtn.addEventListener("click", () => {
    quizNum = 0;
    score = 0;
    missDate = [];
    shuffledData = shuffle([...quizData]);
    displayQuiz();
  });
  container.appendChild(startBtn);
};

// クイズ表示
const displayQuiz = () => {
  container.innerHTML = "";

  const quizNumData = shuffledData[quizNum];
  const quiz = document.createElement("h2");
  quiz.textContent = quizNumData.question;
  container.appendChild(quiz);

  const choicesWrap = document.createElement("div");
  choicesWrap.classList.add("choicesWrap");
  const choicesArray = Object.entries(quizNumData.choices);
  const shuffledChoices = shuffle(choicesArray);

  shuffledChoices.forEach(([key, value]) => {
    const btn = document.createElement("button");
    btn.textContent = value;
    btn.value = key;

    btn.addEventListener("click", () => {
      const isCorrect = key === quizNumData.answer;
      if (isCorrect) {
        score++;
      } else {
        missDate.push({
          question: quizNumData.question,
          answer: quizNumData.choices[quizNumData.answer],
          selected: value,
          judgement: "×",
        });
      }

      quizNum++;
      if (quizNum < maximum) {
        displayQuiz();
      } else {
        showResult();
      }
    });

    choicesWrap.appendChild(btn);
  });

  container.appendChild(choicesWrap);
};

// 結果画面
const showResult = () => {
  container.innerHTML = "";

  const scoreTitle = document.createElement("h2");
  scoreTitle.classList.add("scoreTitle");
  scoreTitle.textContent = `あなたのスコアは ${score} / ${maximum} です`;
  container.appendChild(scoreTitle);

  if (missDate.length > 0) {
    const missWrap = document.createElement("div");
    const missTitle = document.createElement("h3");
    missTitle.textContent = "間違えた問題";
    missTitle.classList.add("missTitle");
    missWrap.appendChild(missTitle);

    missDate.forEach((item) => {
      const missItem = document.createElement("p");
      missItem.classList.add("missItem");
      missItem.textContent = `${item.question} - 正解: ${item.answer}, あなたの選択: ${item.selected}`;
      missWrap.appendChild(missItem);
    });

    container.appendChild(missWrap);
  }

  const restartBtn = document.createElement("button");
  restartBtn.classList.add("restartBtn");
  restartBtn.textContent = "もう一度チャレンジ";
  restartBtn.addEventListener("click", () => {
    quizNum = 0;
    score = 0;
    missDate = [];
    shuffledData = shuffle([...quizData]);
    displayQuiz();
  });
  container.appendChild(restartBtn);

  const backMenuBtn = document.createElement("button");
  backMenuBtn.classList.add("backMenuBtn");
  backMenuBtn.textContent = "メニューに戻る";
  backMenuBtn.addEventListener("click", showMenu);
  container.appendChild(backMenuBtn);
};

// 初期表示はメニュー
showMenu();
