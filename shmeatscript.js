/*
ShmeatScript v1.1.1 by SanPilot
-----------------------------
This purpose of this script is to make Albert.io responses seem legitimate
by timing each question based on its difficulty

INSTRUCTIONS
------------
1. Press F12 to open devtools
2. Paste this script into the console
3. Adjust the difficulty timings below to your shmeat preference
4. Hit enter to run ShmeatScript
5. Paste the answers into the textbox that appears
  Note: answers must be of the following format:
  Question name: A
6. Click Submit
7. Leave that bih to work overnight
*/

/*
Timings for each of the three difficulties (in seconds)
These times are randomized by 20%
*/
DIFFICULT_TIME = 300;
MODERATE_TIME = 120;
EASY_TIME = 60;

// Create the answer textbox
answerDiv = document.createElement("div");
answerDiv.innerHTML = "<b>Paste answers:</b><br>";
answerDiv.style.position = "fixed";
answerDiv.style.zIndex = "9999999";
answerDiv.style.backgroundColor = "white";
answerDiv.style.width = answerDiv.style.height = "100%";
textbox = document.createElement("textarea");
textbox.placeholder = "Question Name: A";
textbox.id = "answers";
subbtn = document.createElement("button");
subbtn.innerText = "Submit";
subbtn.onclick = mainScript;
answerDiv.appendChild(textbox);
answerDiv.appendChild(subbtn);
document.body.insertBefore(answerDiv, document.body.firstChild);

// Store questions and answers
unanswered = [];
questionLis = [];
answers = [];
// Randomize delays
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
DIFFICULT_TIME += rand(DIFFICULT_TIME * -0.2, DIFFICULT_TIME * 0.2);
MODERATE_TIME += rand(MODERATE_TIME * -0.2, MODERATE_TIME * 0.2);
EASY_TIME += rand(EASY_TIME * -0.2, EASY_TIME * 0.2);
console.info("Randomized timings:", `D: ${DIFFICULT_TIME}`, `M: ${MODERATE_TIME}`, `E: ${EASY_TIME}`);

// Main function
function mainScript() {
  answerDiv.style.display = "none";
  answers = textbox.value.split("\n");
  answers.forEach((value, index) => {
    answers[index] = value.split(": ");
  });
  console.info(`Found ${answers.length} answers`);

  questionLis = document.getElementsByClassName("question-list-item");
  console.info(`Found ${questionLis.length} questions`);
  // Prompt if questions != answers
  if(questionLis.length != answers.length) {
    if (!confirm(`Number of questions (${questionLis.length}) does not match number of answers (${answers.length}). Check answer formatting. Continue anyways?`)) return;
  }

  // Confirmation Prompt
  cont = confirm(`Questions: ${questionLis.length}\nAnswers: ${answers.length}\nTime to spend on each question:\nDifficult: ${DIFFICULT_TIME} seconds\nModerate: ${MODERATE_TIME} seconds\nEasy: ${EASY_TIME} seconds\nPROCEED?`);
  if(!cont) return;

  // Answer first question
  answer(0);
}

function answer(q) {
  if(q >= questionLis.length) return summary(); // Reached last question

  difficulty = document.getElementsByClassName("question-list-item__difficulty")[q].innerHTML;
  questionName = questionLis[q].children[0].children[1].innerText;
  correctAns = findAns(questionName);

  // Determine if question is already answered
  answered = document.getElementsByClassName("question-attempt-indicator")[q].classList[1] !== "question-attempt-indicator--unanswered";

  console.info(`Question ${q+1} of ${questionLis.length}: ${questionName}`, `Difficulty: ${difficulty}`, `Answered: ${answered}`);

// Skip if already answered or answer not found
  if(answered) {
    console.info("Already answered, skipping");
    return answer(++q);
  }
  if(correctAns == -1) {
    console.error("No answer found for " + questionName);
    unanswered.push(questionName);
    return answer(++q);
  }

  questionLis[q].children[0].click();

  // delay to ensure question is loaded
  setTimeout(() => {
    document.getElementsByClassName("mcq-option__letter-wrapper")[correctAns].click();
    // Delay before next question
    delay = (difficulty == "D" ? DIFFICULT_TIME : (difficulty == "M" ? MODERATE_TIME : EASY_TIME)) * rand(0.98, 1.02);
    console.info("Delaying for: " + delay);
    setTimeout(() => {
      // Click submit
      document.getElementsByClassName("sg-button")[0].click();
      // Another short delay before going to the next question
      setTimeout(()=>{answer(++q);}, 5000);
    }, delay * 1000);
  }, 5000);

}

// Find the answer for a question
function findAns(question) {
  for(i = 0; i < answers.length; i++) {
    if(answers[i][0].toLowerCase() == question.toLowerCase()) return ['a', 'b', 'c', 'd', 'e'].indexOf(answers[i][1].toLowerCase());
  }
  return -1;
}

function summary() {
  uaString = "";
  unanswered.forEach((value) => {uaString += "\n"+value});
  alert("The following questions were not answered because no answer was found (check answer spelling):" + uaString);
}
