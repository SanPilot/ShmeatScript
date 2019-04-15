var qList = document.getElementsByClassName("markdown-renderer-v2 question-list-item__title");
var resultsArray = [];

var q = 0;

function startChain()
{
    qList[q].click();

    setTimeout(() => {
        if (q != qList.length - 1)
            getAnswer(q);
        else
            createCSV();

    }, 5000);
}

function getAnswer(i)
{
    if (document.querySelector('#app > div > div.common-content > div.interaction-engine-v2 > div.interaction-engine-v2__wrapper > div.interaction-engine-v2__active-question-area.interaction-engine-v2__active-question-area--in-view > div > div.active-question-wrapper > div > div.active-question-content > div.active-question-content__meta > div.active-question-content__meta-question-sub-type') == undefined)
    {
        let question = qList[q].getElementsByClassName("paragraph")[0].innerHTML.split('>')[1].split('<')[0];
        let answer = document.getElementsByClassName("correctness-indicator-wrapper__indicator fa fa-check correctness-indicator-wrapper__indicator--correct")[0].parentElement.getElementsByClassName("mcq-option__letter-wrapper")[0].getElementsByClassName("mcq-option__letter")[0].innerText;

        let x = {};
        x[question] = answer;
        resultsArray.push(x)
    }

    q++;
    startChain();
}

function createCSV()
{
    let jsonContent = "data:text/json;charset=utf-8," + JSON.stringify(resultsArray);
    let encodedUri = encodeURI(jsonContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", document.getElementsByClassName("subheader__title")[0].innerText.toLowerCase().replace(" ", "_") + ".json");
    document.body.appendChild(link);

    link.click();
}

startChain();
