var charactersInfoData = null
var answerData = null
let tries = 0;

// Creates a blank row for the hints
function createBlankRow(){
    categories = ['image', 'gender', 'vision', 'weapon', 'nation', 'release']
    rowContainer = document.createElement('div')
    rowContainer.classList.add("flex", "text-white", "font-bold", "text-[13px]", "flex-row", "gap-x-[12px]",  "pb-[10px]")
    for (i = 0; i < categories.length; i++) {
        categoryDiv = document.createElement('div')
        categoryDiv.classList.add("flex", "w-[75px]", "h-[75px]", "items-center", "justify-center", "bg-[#27343fcc]", "text-center", "border", "border-white", "shadow-[inset_0_4px_6px_rgba(0,0,0,0.5)]", "shadow-[0_4px_6px_rgba(0,0,0,0.5)]")
        categoryDiv.id = 'guess_' + categories[i]
        rowContainer.appendChild(categoryDiv)
    }   
    return rowContainer
}

// Checks whether or not the guess was correct or not and changes boxes accordingly
function checkGuess(category, guessData, row, i) {
    console.log("now checking " + category)
    result_element = row.querySelector("#guess_" + category)
    result_element.innerText = guessData[category]
    result_element.style.animationDelay = `${0.4 * i}s`
    
    if (guessData[category] == answerData[category]){   
        result_element.classList.add('fade-to-green')
        return true;
    }
    else {
        result_element.classList.add('fade-to-red')
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

function submitGuess(e) {
    e.preventDefault();
    let inputElement = document.getElementById("guess");
    let guess = inputElement.value;
    let resultsContainer = document.getElementById('results');
    let guessData = null;
    let categories = ["gender", "vision", "weapon", "nation", "release"];
    let gameOver = true;

    row = createBlankRow();
    tries++; // Increment tries count

    for (let i = 0; i < charactersInfoData.length; i++) {
        let currentCharacter = charactersInfoData[i];
        console.log(currentCharacter["name"]);
        if (currentCharacter["name"].toLowerCase() == guess.toLowerCase()) {
            guessData = currentCharacter;
            break;
        }
    }
    if (guessData) {
        placeIcon(row.querySelector('#guess_image'), guessData);

        for (let i = 0; i < categories.length; i++) {
            if (!(checkGuess(categories[i], guessData, row, i))) {
                gameOver = false;
            }
        }
        resultsContainer.prepend(row);

        // Save the guess data to localStorage
        const previousGuesses = JSON.parse(localStorage.getItem("previousGuesses")) || [];
        previousGuesses.push(guessData);
        localStorage.setItem("previousGuesses", JSON.stringify(previousGuesses));

        if (gameOver) {
            displayCongratulatoryMessage(tries); // Call to display message
            document.getElementById("submit").disabled = true;
            inputElement.disabled = true;

            // Save the game state to localStorage
            localStorage.setItem("gameOver", "true");
            localStorage.setItem("tries", tries);
        }
        let index = window.arr.findIndex(obj => obj["name"].toLowerCase() === inputElement.value.toLowerCase());
        window.arr.splice(index, 1)[0];
        inputElement.value = "";  // Remove all user input in text box
        inputElement.focus();
    }
}

function displayCongratulatoryMessage(tries) {
    const congratsMessageElement = document.getElementById("congrats_message");
    const triesTextElement = document.getElementById('tried-text')
    triesTextElement.innerText = tries < 2 ? "You guessed it in 1 try!" : `You guessed it in ${tries} tries!`;
    // Check if game state is loaded from storage
    const isLoadedFromStorage = localStorage.getItem("gameOver") === "true";

    // Use a shorter delay if loaded from storage, otherwise use the original delay
    const delay = isLoadedFromStorage ? 500 : 2200;

    setTimeout(() => {
        congratsMessageElement.classList.remove("hidden");
        congratsMessageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, delay);
}

// submit on enter
function checkSubmit(e) {
    if(e && e.keyCode == 13) {
       document.getElementById('submit').click()
    }
}

window.addEventListener('load', async function() {
    const answerRes = await fetch("/static/answers/classic/todays_answer.json");
    answerData = await answerRes.json();
    console.log(answerData);
    const characterInfoRes = await fetch("/static/data/classicModeInfo.json");
    charactersInfoData = await characterInfoRes.json();


    console.log(charactersInfoData);
    
    document.getElementById('guess').focus();
    document.addEventListener("keyup", checkSubmit);
    document.getElementById("guess-form").addEventListener("submit", submitGuess)

    // Load previous guesses from localStorage
    const previousGuesses = JSON.parse(localStorage.getItem("previousGuesses")) || [];
    const resultsContainer = document.getElementById('results');

    // Display each previous guess
    previousGuesses.forEach(guessData => {
        const row = createBlankRow();
        placeIcon(row.querySelector('#guess_image'), guessData);

        let gameOver = true;
        let categories = ["gender", "vision", "weapon", "nation", "release"];
        for (let i = 0; i < categories.length; i++) {
            if (!(checkGuess(categories[i], guessData, row, i))) {
                gameOver = false;
            }
        }
        resultsContainer.prepend(row);
    });

    // Check for saved game state
    if (localStorage.getItem("gameOver") === "true") {
        const tries = localStorage.getItem("tries");
        displayCongratulatoryMessage(tries); 
        document.getElementById("submit").disabled = true;
        document.getElementById("guess").disabled = true;
    }
});
