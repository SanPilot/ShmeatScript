let shmeatButton = document.getElementById('nsu_shmeat');
let genButton = document.getElementById('nsu_JSON');
let jsonPicker = document.getElementById('json_picker');

let easyDelay = document.getElementById('easy_delay');
let medDelay = document.getElementById('med_delay');
let diffDelay = document.getElementById('diff_delay');

let newArr = {};

shmeatButton.onclick = function()
{
    chrome.tabs.executeScript({
        code: 'var ansArray = ' + JSON.stringify(newArr) + ';var easyDelay = ' + easyDelay.value + ';var medDelay = ' + medDelay.value + ';var diffDelay = ' + diffDelay.value + ';'
    }, function()
    {
        chrome.tabs.executeScript({
            file: 'answerAssignment.js'
        });
    });
}

genButton.onclick = function()
{
    chrome.tabs.executeScript({
        file: 'generateAnswerJSON.js'
    });
}

jsonPicker.addEventListener('change', (event) =>
{
    var file = event.target.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
});

easyDelay.addEventListener('change', (event) =>
{

});

medDelay.addEventListener('change', (event) =>
{

});

diffDelay.addEventListener('change', (event) =>
{

});

function receivedText(e)
{
    let lines = e.target.result;
    newArr = JSON.parse(lines);
    console.log("Collected " + newArr.length + " answers");

    shmeatButton.disabled = false;
}
