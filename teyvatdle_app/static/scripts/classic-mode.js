import { autocomplete } from './auto-complete.js'

var charactersInfoData = null
var answerData = null
let tries = localStorage.getItem("classicTries") || 0;
console.log(tries)

// Creates a blank row for the hints
function createBlankRow(){
    let categories = ['image', 'gender', 'vision', 'weapon', 'nation', 'release']
    let rowContainer = document.createElement('div')
    rowContainer.classList.add("flex", "text-white", "font-bold", "text-[13px]", "flex-row", "gap-x-[12px]",  "pb-[10px]")
    for (let i = 0; i < categories.length; i++) {
        let categoryDiv = document.createElement('div')
        categoryDiv.classList.add("flex", "w-[75px]", "h-[75px]", "items-center", "justify-center", "bg-[#27343fcc]", "text-center", "border", "border-white", "shadow-[inset_0_4px_6px_rgba(0,0,0,0.5)]", "shadow-[0_4px_6px_rgba(0,0,0,0.5)]")
        categoryDiv.id = 'guess_' + categories[i]
        rowContainer.appendChild(categoryDiv)
    }   
    return rowContainer
}

// Checks whether or not the guess was correct or not and changes boxes accordingly
function checkGuess(category, guessData, row, i) {
    let result_element = row.querySelector("#guess_" + category)
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
    iconElement.style.backgroundImage = `url('/static/images/character_icons/${guessData["id"].toLowerCase()}.png')`
    iconElement.style.backgroundSize = '75px 75px'
    iconElement.style.backgroundPosition = 'center';
    iconElement.style.backgroundRepeat = 'no-repeat';
}

function updateStreak() {
    let currentTime = new Date();
    let prevTime = new Date(parseInt(localStorage.getItem("prevTimeClassic")));

    let streak = parseInt(localStorage.getItem("streakClassic")) || 1;
    let maxStreak = parseInt(localStorage.getItem("maxStreakClassic")) || 1;

    if (!isNaN(prevTime.getTime())) {
        // Get the date parts only (ignoring time)
        const currentDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
        const prevDate = new Date(prevTime.getFullYear(), prevTime.getMonth(), prevTime.getDate());

        // Check if the dates are consecutive
        const diffInDays = (currentDate - prevDate) / (1000 * 60 * 60 * 24);

        if (diffInDays === 1) {
            streak += 1;
            if (streak > maxStreak) {
                maxStreak = streak;
            }
        } else if (diffInDays > 1) {
            streak = 1;
        }
    }

    // Update localStorage
    localStorage.setItem("prevTimeClassic", currentTime.getTime());
    localStorage.setItem("streakClassic", streak);
    localStorage.setItem("maxStreakClassic", maxStreak);
}
function submitGuess(e) {
    e.preventDefault();
    let inputElement = document.getElementById("guess");
    let guess = inputElement.value;
    let resultsContainer = document.getElementById('results');
    let guessData = null;
    let categories = ["gender", "vision", "weapon", "nation", "release"];
    let gameOver = true;

    let row = createBlankRow();
    tries++; // Increment tries count

    for (let i = 0; i < charactersInfoData.length; i++) {
        let currentCharacter = charactersInfoData[i];
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
        const previousGuesses = JSON.parse(localStorage.getItem("previousGuessesClassic")) || [];
        previousGuesses.push(guessData);

        let arrClassic = JSON.parse(localStorage.getItem('arrClassic'));
        let index = arrClassic.findIndex(obj => obj["name"].toLowerCase() === inputElement.value.toLowerCase());
        arrClassic.splice(index, 1)[0];
        localStorage.setItem("previousGuessesClassic", JSON.stringify(previousGuesses));
        localStorage.setItem("classicTries", tries);
        localStorage.setItem("arrClassic", JSON.stringify(arrClassic));

        if (gameOver) {
            updateStreak();
            displayCongratulatoryMessage(tries); // Call to display message
            document.getElementById("submit").disabled = true;
            inputElement.disabled = true;

            // Save the game state to localStorage
            localStorage.setItem("gameOverClassic", "true");
        }
        inputElement.value = "";  // Remove all user input in text box
        inputElement.focus();
        autocomplete(document.getElementById("guess"), arrClassic)
    }
}

function displayCongratulatoryMessage(tries) {
    const congratsMessageElement = document.getElementById("congrats_message");
    const triesTextElement = document.getElementById('tried-text')

    triesTextElement.innerText = tries < 2 ? "You guessed it in 1 try!" : `You guessed it in ${tries} tries!`;

    const streakTextElement = document.getElementById('streak')
    const streakLabelTextElement = document.getElementById('streak-label')
    const streak = localStorage.getItem("streakClassic")
    const maxStreak = localStorage.getItem("maxStreakClassic")
    streakTextElement.innerText = streak
    streakLabelTextElement.innerText = `Current Streak: ${streak} Max Streak: ${maxStreak}`
   
    // Check if game state is loaded from storage
    const isLoadedFromStorage = localStorage.getItem("gameOverClassic") === "true";

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

function resetGame(){
    const savedAnswer = localStorage.getItem("currentAnswerClassic");
    if (savedAnswer !== answerData.name) {
        // Clear saved data if the answer has changed
        localStorage.removeItem("previousGuessesClassic");
        localStorage.removeItem("gameOverClassic");
        localStorage.removeItem("classicTries");
        tries = 0;
        localStorage.setItem("currentAnswerClassic", answerData.name); // Update to the new answer
        localStorage.setItem('arrClassic', JSON.stringify(charactersInfoData))
    }
}

function displayPreviousGuesses() {
    // Load previous guesses from localStorage
    const previousGuesses = JSON.parse(localStorage.getItem("previousGuessesClassic")) || [];
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
}

window.addEventListener('load', async function() {
    const answerRes = await fetch("/static/answers/classic/todays_answer.json");
    answerData = await answerRes.json();
    console.log(answerData);
    const characterInfoRes = await fetch("/static/data/classicModeInfo.json");
    charactersInfoData = await characterInfoRes.json();


    // Check if the current answer is different from the saved one
    resetGame()
    
    document.getElementById('guess').focus();
    document.addEventListener("keyup", checkSubmit);
    document.getElementById("guess-form").addEventListener("submit", submitGuess)

    displayPreviousGuesses()

    // Check for saved game state
    if (localStorage.getItem("gameOverClassic") === "true") {
        displayCongratulatoryMessage(tries); 
        document.getElementById("submit").disabled = true;
        document.getElementById("guess").disabled = true;
    }


    var arrClassic = localStorage.getItem('arrClassic');
    if (arrClassic == null) {
        arrClassic = charactersInfoData
        localStorage.setItem('arrClassic', JSON.stringify(arrClassic))
    }
    else {
        arrClassic = JSON.parse(arrClassic)
    }
    autocomplete(document.getElementById("guess"), arrClassic);
});

