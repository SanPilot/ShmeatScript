unanswered = [];
questionLis = [];
answers = [];

// Randomize delays
function rand(min, max) { return Math.random() * (max - min) + min; }

var EASY_TIME = easyDelay + rand(easyDelay * -0.2, easyDelay * 0.2);
var MODERATE_TIME = medDelay + rand(medDelay * -0.2, medDelay * 0.2);
var DIFFICULT_TIME = diffDelay + rand(diffDelay * -0.2, diffDelay * 0.2);

console.info("Randomized timings:", `\nD: ${DIFFICULT_TIME}`, `M: ${MODERATE_TIME}`, `E: ${EASY_TIME}`);

var arr = [];

for (var i = 0; i < ansArray.length; i++)
    for (var key in ansArray[i])
        if (ansArray[i].hasOwnProperty(key))
            arr.push( [ key, ansArray[i][key] ] );

ansArray = arr;

// Main function
function mainScript()
{
    answers = ansArray;

    console.log(answers);

    console.info(`Found ${answers.length} answers`);

    questionLis = document.getElementsByClassName("question-list-item");
    console.info(`Found ${questionLis.length} questions`);
    // Confirmation Prompt

    console.info(`Changing ${Math.ceil(((100 - accuracy) / 100) * questionLis.length)} answers to achieve ${Math.floor(Math.abs(((Math.ceil(((100 - accuracy) / 100) * questionLis.length)) - questionLis.length) / questionLis.length) * 100)}%`);
    adjustAccuracy(Math.ceil(((100 - accuracy) / 100) * questionLis.length));

    cont = confirm(`Questions: ${questionLis.length}\nAnswers: ${answers.length}\nTime to spend on each question:\nDifficult: ${DIFFICULT_TIME} seconds\nModerate: ${MODERATE_TIME} seconds\nEasy: ${EASY_TIME} seconds\nPROCEED?`);
    if(!cont) return;

    // Answer first question
    answer(0);
}

function answer(q)
{
    if(q >= questionLis.length) return summary(); // Reached last question

    difficulty = document.getElementsByClassName("question-list-item__difficulty")[q].innerHTML;
    questionName = questionLis[q].children[0].children[1].innerText;
    correctAns = findAns(questionName);

    // Determine if question is already answered
    answered = document.getElementsByClassName("question-attempt-indicator")[q].classList[1] !== "question-attempt-indicator--unanswered";

    console.info(`Question ${q+1} of ${questionLis.length}: ${questionName}`, `Difficulty: ${difficulty}`, `Answered: ${answered}`);

    // Skip if already answered or answer not found
    if(answered)
    {
        console.info("Already answered, skipping");
        return answer(++q);
    }

    if(correctAns == -1)
    {
        console.error("No answer found for " + questionName);
        unanswered.push(questionName);
        return answer(++q);
    }

    questionLis[q].children[0].click();

    // delay to ensure question is loaded
    setTimeout(() => {
        console.log(correctAns);
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
function findAns(question)
{
    for (let i = 0; i < answers.length; i++)
        if(answers[i][0].toLowerCase() == question.toLowerCase())
            return ['a', 'b', 'c', 'd', 'e'].indexOf(answers[i][1].toLowerCase());

    return -1;
}

function adjustAccuracy(n)
{
    if (n != 0)
    {
        var currentIndex = ansArray.length, temporaryValue, randomIndex;
        let array = {};

        for (let i = 0; i < ansArray.length - 1; i++)
            array[i] = i;

        while (currentIndex !== 0)
        {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        for (let i = 0; i < n; i++)
        {
            switch (ansArray[array[i]][1])
            {
                case 'A':
                    ansArray[array[i]][1] = ['B', 'C', 'D', 'E'][Math.floor(Math.random() * 4)]
                    break;
                case 'B':
                    ansArray[array[i]][1] = ['A', 'C', 'D', 'E'][Math.floor(Math.random() * 4)]
                    break;
                case 'C':
                    ansArray[array[i]][1] = ['A', 'B', 'D', 'E'][Math.floor(Math.random() * 4)]
                    break;
                case 'D':
                    ansArray[array[i]][1] = ['A', 'B', 'C', 'E'][Math.floor(Math.random() * 4)]
                    break;
                case 'E':
                    ansArray[array[i]][1] = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
                    break;
            }
        }
    }
}

function summary()
{
    uaString = "";
    unanswered.forEach((value) => {uaString += "\n"+value});
    alert("The following questions were not answered because no answer was found (check answer spelling):" + uaString);
}

mainScript();
