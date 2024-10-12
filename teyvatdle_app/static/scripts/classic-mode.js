var characters_info_data = null
var answerData = null

function createBlankRow(){
    categories = ['image', 'gender', 'vision', 'weapon', 'nation', 'release']
    rowContainer = document.createElement('div')
    rowContainer.classList.add("flex", "text-white", "font-bold", "flex-row", "gap-x-[25px]",  "pb-[10px]")
    for (i = 0; i < categories.length; i++) {
        categoryDiv = document.createElement('div')
        categoryDiv.classList.add("flex", "w-[75px]", "h-[75px]", "items-center", "justify-center", "text-center", "border", "border-white", "shadow-[inset_0_4px_6px_rgba(0,0,0,0.5)]", "shadow-[0_4px_6px_rgba(0,0,0,0.5)]")
        categoryDiv.id = 'guess_' + categories[i]
        rowContainer.appendChild(categoryDiv)
    }
    console.log(rowContainer)
    return rowContainer
}

function test(row){
    console.log(row.querySelector("#guess_gender"))
    row.querySelector("#guess_gender").innerText = "hi"
}
function checkGuess(category, guessData, row) {
    console.log("now checking " + category)
    result_element = row.querySelector("#guess_" + category)
    result_element.innerText = guessData[category]

    if (guessData[category] == answerData[category]){
        result_element.style = "background-color: green"
    }
    else {
        result_element.style = "background-color: red"
    }
}
function placeIcon(iconElement, guessData){
    console.log("now placing icon")
    iconElement.style.backgroundImage = `url(https://genshin.jmp.blue/characters/${guessData["id"].toLowerCase().replace(' ', '-')}/icon-big)`
    iconElement.style.backgroundSize = '75px 75px'
    iconElement.style.backgroundPosition = 'center';
    iconElement.style.backgroundRepeat = 'no-repeat';
}

async function submitGuess(){
    let guess = document.getElementById("guess").value;
    let resultsContainer = document.getElementById('results')
    let guessData = null

    row = createBlankRow()

    for (var i = 0; i < characters_info_data.length; i++){
        var current_character = characters_info_data[i];
        console.log(current_character["name"])
        if (current_character["name"].toLowerCase() == guess.toLowerCase()){
            guessData = current_character
            break;
        }
    }

    //test(row)
    placeIcon(row.querySelector('#guess_image'), guessData)
    checkGuess("gender", guessData, row)
    checkGuess("vision", guessData, row)
    checkGuess("weapon", guessData, row)
    checkGuess("nation", guessData, row)
    checkGuess("release", guessData, row)
    console.log(row)
    resultsContainer.prepend(row)

    document.getElementById("guess").value = "";  //Removes all user input in text box
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
    console.log(characters_info_data)

    document.getElementById('guess').focus();
    document.addEventListener("keyup", checkSubmit)

};
