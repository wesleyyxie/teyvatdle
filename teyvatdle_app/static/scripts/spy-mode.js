var charactersInfoData = null;   
var answerData = null;
let tries = 0;

function createBlankRow() {
    rowContainer = document.createElement('div');
    rowContainer.classList.add("flex", "text-white", "font-bold", "text-[13px]", "flex-row", "gap-x-[12px]", "mb-[10px]");
    
    // Create one box for the character icon and result (red or green)
    categoryDiv = document.createElement('div');
    categoryDiv.classList.add("flex", "w-[270px]", "h-[130px]", "border", "justify-center", "border-white", "shadow-[inset_0_4px_6px_rgba(0,0,0,0.5)]", "shadow-[0_4px_6px_rgba(0,0,0,0.5)]");

    categoryDiv.id = 'guess_result';  // Single box for the result
    rowContainer.appendChild(categoryDiv);
    
    return rowContainer;
}

// Checks whether or not the guess was correct or not and changes boxes accordingly
function checkGuess(guessData, row) {
    const result_element = row.querySelector("#guess_result");

    // Display the character icon in the result box
    placeIcon(result_element, guessData);
    // Check if the guessed character is correct
    if (guessData["name"].toLowerCase() === answerData["name"].toLowerCase()) {   
        result_element.classList.add('bg-green');  // Turn green if correct
        return true;
    } else {
        result_element.classList.add('bg-red');  // Turn red if incorrect
        return false;
    }
}

// Places the character icon
function placeIcon(iconElement, guessData) {
    console.log("Now placing icon");
    let imageName;

    // Assuming icons are named using character names
    imageName = guessData["id"].toLowerCase().replace(/\s+/g, '-');

    const imageUrl = `/static/images/character_icons/${imageName}.png`;
    console.log("Image URL:", imageUrl);

    iconElement.style.backgroundImage = `url('${imageUrl}')`;
    iconElement.style.backgroundSize = '75px 75px';
    iconElement.style.backgroundPosition = 'center 10px';
    iconElement.style.backgroundRepeat = 'no-repeat';

    spanElement = document.createElement('span')
    spanElement.classList.add('mt-[90px]','bottom-[8px]', 'text-lg')
    spanElement.innerText = guessData["name"]
    iconElement.appendChild(spanElement)
}

// Handles submission of guess
function submitGuess(e) {
    e.preventDefault();  // Prevent form submission
    let inputElement = document.getElementById("guess");
    let guess = inputElement.value;
    let resultsContainer = document.getElementById('results');
    let clueCountdown = document.getElementById('clue_countdown')
    let guessData = null;
    let gameOver = false;

    // Loop through the characters to find the guessed character
    for (let i = 0; i < charactersInfoData.length; i++) {
        let currentCharacter = charactersInfoData[i];
        console.log(currentCharacter)
        console.log(guess)
        if (currentCharacter["name"].toLowerCase() === guess.toLowerCase()) {
            guessData = currentCharacter;
            tries++;
            break;
        }
    }

    if (guessData) {
        const row = createBlankRow();

        if (checkGuess(guessData, row)) {
            displayCongratulatoryMessage(tries);  
            gameOver = true;
        }
        resultsContainer.prepend(row);

        if (gameOver) {
            document.getElementById("submit").disabled = true;
            inputElement.disabled = true;
        }
        let index = window.arr.findIndex(obj => obj["name"].toLowerCase() === inputElement.value.toLowerCase());
        window.arr.splice(index, 1)[0];
        inputElement.value = "";
        inputElement.focus();
        if (tries < 5) {
            clueCountdown.innerText = `Clues in ${5 - tries} tries`
        }
    }

    if (tries == 5) {
        let nameClue = document.getElementById('name_clue')
        clueCountdown.classList.add('hidden')
        nameClue.classList.remove('hidden')
        nameClue.innerText = answerData["abilityName"]
        document.getElementById('splash-icon').classList.remove('grayscale')
    }
}

// Displays congratulatory message when the correct guess is made
function displayCongratulatoryMessage(tries) {
    const congratsMessageElement = document.getElementById("congrats_message");
    const triesTextElement = document.getElementById('tried-text')
    triesTextElement.innerText = tries < 2 ? "You guessed it in 1 try!" : `You guessed it in ${tries} tries!`;
    setTimeout(() => {
        congratsMessageElement.classList.remove("hidden");
        congratsMessageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 500); // Delay
}

// submit on enter
function checkSubmit(e) {
    if(e && e.keyCode == 13) {
        e.preventDefault();
        document.getElementById('submit').click()
    }
}

// Load data and initialize event listeners on window load
window.addEventListener('load', async function() {
    // Fetch today's answer
    const answerRes = await fetch("/static/answers/spy/todays_answer.json");
    answerData = await answerRes.json();  // Load today's answer
    console.log(answerData);
    
    // Fetch character info data
    const characterInfoRes = await fetch("/static/data/classicModeInfo.json");
    charactersInfoData = await characterInfoRes.json();  // Load all character info
    
    // Display today's answer splash image instead of ability icon
    const splashElement = document.getElementById('splash-icon');
    let splashImageName = answerData["id"].toLowerCase().replace(/\s+/g, '-');
    splashElement.style.backgroundImage = `url('/static/images/character_splashes/${splashImageName}_splash.png')`;
    splashElement.style.backgroundSize = "16px 16px;"
    splashElement.style.backgroundPosition = "center";
    splashElement.style.imageRendering = "pixelated";  // Apply pixelated rendering

    // Focus the guess input and add event listeners
    document.getElementById('guess').focus();
    document.addEventListener("keyup", checkSubmit);
    document.getElementById("guess-form").addEventListener("submit", submitGuess);
});
