var characters_info_data = null
var answerData = null

window.onload = async function() {
    const answer_res = await fetch("/classic_answer");
    answerData = await answer_res.json();
    console.log(answerData);

    const character_info_res = await fetch("/static/data/classicModeInfo.json");
    characters_info_data = await character_info_res.json();
    console.log(characters_info_data)
};

function checkGuess(category, guessData) {
    console.log("guess_" + category)
    result = document.getElementById("guess_" + category)
    result.innerHTML = category + ": " + guessData[category]
    if (guessData[category] == answerData[category]){
        result.style = "background-color: green"
    }
    else {
        result.style = "background-color: red"
    }
}

async function submitGuess(){
    let guess = document.getElementById("guess").value;
    let guessData = null

    let result = document.getElementById("result")

    for (var i = 0; i < characters_info_data.length; i++){
        var current_character = characters_info_data[i];
        console.log(current_character["name"])
        if (current_character["name"].toLowerCase() == guess.toLowerCase()){
            guessData = current_character
            break;
        }
    }

    checkGuess("gender", guessData)
    checkGuess("vision", guessData)
    checkGuess("weapon", guessData)
    checkGuess("nation", guessData)
    checkGuess("release", guessData)
    
    if (guessData["name"] == answerData["name"]){
        result.innerHTML = "CORRECT"
    }
    else {
        result.innerHTML = "WRONG"
    }
}
