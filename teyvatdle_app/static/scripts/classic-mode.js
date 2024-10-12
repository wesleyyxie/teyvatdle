var characters_info_data = null
var answerData = null

// Creates a blank row for the hints
function createBlankRow(){
    categories = ['image', 'gender', 'vision', 'weapon', 'nation', 'release']
    rowContainer = document.createElement('div')
    rowContainer.classList.add("flex", "text-white", "font-bold", "text-[13px]", "flex-row", "gap-x-[12px]",  "pb-[10px]")
    for (i = 0; i < categories.length; i++) {
        categoryDiv = document.createElement('div')
        categoryDiv.classList.add("flex", "w-[75px]", "h-[75px]", "items-center", "justify-center", "text-center", "border", "border-white", "shadow-[inset_0_4px_6px_rgba(0,0,0,0.5)]", "shadow-[0_4px_6px_rgba(0,0,0,0.5)]")
        categoryDiv.id = 'guess_' + categories[i]
        rowContainer.appendChild(categoryDiv)
    }   
    return rowContainer
}

// Checks whether or not the guess was correct or not and changes boxes accordingly
function checkGuess(category, guessData, row) {
    console.log("now checking " + category)
    result_element = row.querySelector("#guess_" + category)
    result_element.innerText = guessData[category]

    if (guessData[category] == answerData[category]){
        result_element.style = "background-color: green"
        return true;
    }
    else {
        result_element.style = "background-color: red"
        return false
    }
}

// Places the character icon
function placeIcon(iconElement, guessData){
    console.log("now placing icon")
    console.log(guessData["id"])
    iconElement.style.backgroundImage = `url('/static/images/character_icons/${guessData["id"].toLowerCase()}.png')`
    iconElement.style.backgroundSize = '75px 75px'
    iconElement.style.backgroundPosition = 'center';
    iconElement.style.backgroundRepeat = 'no-repeat';
}

// submits the guess
function submitGuess(){
    let inputElement = document.getElementById("guess");
    let guess = inputElement.value
    let resultsContainer = document.getElementById('results')
    let guessData = null
    let categories = ["gender", "vision", "weapon", "nation", "release"]
    let gameOver = true

    row = createBlankRow()

    for (var i = 0; i < characters_info_data.length; i++){
        var current_character = characters_info_data[i];
        console.log(current_character["name"])
        if (current_character["name"].toLowerCase() == guess.toLowerCase()){
            guessData = current_character
            break;
        }
    }

    placeIcon(row.querySelector('#guess_image'), guessData)
    for (i = 0; i < categories.length; i++) {
        if (!(checkGuess(categories[i], guessData, row))) {
            gameOver = false
        }
    }
    resultsContainer.prepend(row)
    if (gameOver) {
        document.getElementById("submit").disabled = true
        inputElement.disabled = true    
    }
    inputElement.value = "";  //Removes all user input in text box

}

function checkSubmit(e) {
    if(e && e.keyCode == 13) {
       document.getElementById('submit').click()
    }
 }



window.onload = async function() {
    const answer_res = await fetch("/static/answers/classic/todays_answer.json");
    answerData = await answer_res.json();
    console.log(answerData);
    const character_info_res = await fetch("/static/data/classicModeInfo.json");
    characters_info_data = await character_info_res.json();
    console.log(characters_info_data);

    document.getElementById('guess').focus();
    document.addEventListener("keyup", checkSubmit);
};
