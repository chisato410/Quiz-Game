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

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

let shuffledData = shuffle([...quizData]);

const container = document.createElement("div");
container.classList.add("container");
document.querySelector("#inner").appendChild(container);

const displayQuiz = () => {
  container.innerHTML = "";

  const quizNumData = shuffledData[quizNum];
  const quiz = document.createElement("h2");
  quiz.classList.add("question");
  quiz.textContent = quizNumData.question;
  container.appendChild(quiz);

  const choicesWrap = document.createElement("div");
  for (const [key, value] of Object.entries(quizNumData.choices)) {
    const btn = document.createElement("button");
    btn.textContent = value;
    btn.setAttribute("name", "answer");
    btn.setAttribute("value", key);

    btn.addEventListener("click", () => {
      let judgement = "";
      if (key === quizNumData.answer) {
        score++;
        judgement = "○";
      } else {
        judgement = "×";
        missDate.push({
          question: quizNumData.question,
          answer: quizNumData.choices[quizNumData.answer],
          selected: value,
          judgement: judgement,
        });
      }

      quizNum++;

      if (quizNum < maximum) {
        displayQuiz();
      } else {
        container.innerHTML = "";

        const scoreTitle = document.createElement("h2");
        scoreTitle.classList.add("scoreTitle");
        scoreTitle.textContent = `あなたのスコアは ${score} / ${maximum} です`;
        container.appendChild(scoreTitle);

        if (missDate.length > 0) {
          const result = document.createElement("div");
          const missTitle = document.createElement("h3");
          missTitle.classList.add("missTitle");
          missTitle.textContent = "間違えた問題";
          result.appendChild(missTitle);

          missDate.forEach((ereata) => {
            const missItem = document.createElement("p");
            missItem.classList.add("missItem");
            missItem.textContent = `${ereata.question} - 正解: ${ereata.answer}, あなたの選択: ${ereata.selected}, 判定: ${ereata.judgement}`;
            result.appendChild(missItem);
          });

          container.appendChild(result);
        }

        const restart = document.createElement("button");
        restart.classList.add("restartBtn");
        restart.textContent = "再挑戦";
        restart.addEventListener("click", () => {
          quizNum = 0;
          score = 0;
          missDate = [];
          shuffledData = shuffle([...quizData]);
          displayQuiz();
        });
        container.appendChild(restart);
      }
    });

    choicesWrap.appendChild(btn);
  }
  container.appendChild(choicesWrap);
};

displayQuiz();
