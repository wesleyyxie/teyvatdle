var charactersInfoData = null   
var answerData = null
let tries = 0;

function createBlankRow() {
    rowContainer = document.createElement('div');
    rowContainer.classList.add("flex", "text-white", "font-bold", "text-[13px]", "flex-row", "gap-x-[12px]",  "mb-[10px]");
    
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

    // If your images are named using character names
    imageName = guessData["character_id"].toLowerCase().replace(/\s+/g, '-');
    //imageName = guessData["id"];  

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


function submitGuess(e) {
    e.preventDefault();  // Prevent form submission
    let inputElement = document.getElementById("guess");
    let guess = inputElement.value;
    let resultsContainer = document.getElementById('results');
    let audioCountdown = document.getElementById('audio_countdown')
    let guessData = null;
    let gameOver = false;
    // Loop through the characters to find the guessed character
    for (let i = 0; i < charactersInfoData.length; i++) {
        let currentCharacter = charactersInfoData[i];
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

        // Save the guess data to localStorage
        const previousGuesses = JSON.parse(localStorage.getItem("voicelinePreviousGuesses")) || [];
        previousGuesses.push(guessData);
        localStorage.setItem("voicelinePreviousGuesses", JSON.stringify(previousGuesses));


        if (gameOver) {
            document.getElementById("submit").disabled = true;
            inputElement.disabled = true;

            localStorage.setItem("voicelineGameOver", "true");
            localStorage.setItem("voicelineTries", tries);
        }
        let index = window.arr.findIndex(obj => obj["name"].toLowerCase() === inputElement.value.toLowerCase());
        window.arr.splice(index, 1)[0];
        inputElement.value = "";
        inputElement.focus();
        if (tries < 5) {
            audioCountdown.innerText = `Audio clue in ${5 - tries} tries`
        }
    }

    if (tries == 5) {
        let audioContainer = document.getElementById('audio_container')
        audioContainer.classList.remove('hidden')
        audioCountdown.classList.add('hidden')
    }
}

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

window.addEventListener('load', async function() {
    const answerRes = await fetch("/static/answers/voiceline/todays_answer.json");
    answerData = await answerRes.json(); // Load today's answer
    console.log("Today's Answer Data:", answerData);
    
    const characterInfoRes = await fetch("/static/data/voicelines.json");
    charactersInfoData = await characterInfoRes.json(); // Load all character info
    console.log("Characters Info Data:", charactersInfoData);
    
    // Display today's answer quote from todays_answer.json
    const randomQuoteElement = document.getElementById('random_quote');
    randomQuoteElement.innerText = `"${answerData.quote}"`; 

    // Check if the current answer is different from the saved one
    const savedAnswer = localStorage.getItem("voicelineCurrentAnswer");
    console.log("Saved Answer:", savedAnswer);
    console.log("Current Answer:", answerData.name);

    if (savedAnswer !== answerData.name) {
        // Clear saved data if the answer has changed
        console.log("Answer has changed. Clearing saved data...");
        localStorage.removeItem("voicelinePreviousGuesses");
        localStorage.removeItem("voicelineGameOver");
        localStorage.removeItem("voicelineTries");
        localStorage.setItem("voicelineCurrentAnswer", answerData.name); // Update to the new answer
    } else {
        console.log("Answer has not changed. Keeping saved data.");
    }

    // Load previous guesses from localStorage
    const previousGuesses = JSON.parse(localStorage.getItem("voicelinePreviousGuesses")) || [];
    const resultsContainer = document.getElementById('results');

    // Display each previous guess
    previousGuesses.forEach(guessData => {
        const row = createBlankRow();
        placeIcon(row.querySelector("#guess_result"), guessData);

        if (guessData["name"].toLowerCase() === answerData["name"].toLowerCase()) {
            row.querySelector("#guess_result").classList.add('bg-green');
        } else {
            row.querySelector("#guess_result").classList.add('bg-red');
        }
        resultsContainer.prepend(row);
    });

    // Check if the game was already won
    if (localStorage.getItem("voicelineGameOver") === "true") {
        const tries = localStorage.getItem("voicelineTries");
        displayCongratulatoryMessage(tries);
        document.getElementById("submit").disabled = true;
        document.getElementById("guess").disabled = true;
    }

    document.getElementById('guess').focus();
    document.addEventListener("keyup", checkSubmit);
    document.getElementById("guess-form").addEventListener("submit", submitGuess);
});

// Get Quote

function getRandomQuoteForCharacter(characterName) {
    const filteredQuotes = charactersInfoData.filter(quote => quote.name.toLowerCase() === characterName.toLowerCase());
    
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        return filteredQuotes[randomIndex].quote;
    }
    return null;  
}

function playAudio() {
    let audio = new Audio(`/static/data/voiceline_audios/${answerData.character_id}${answerData.id}.mp3`)
    audio.volume = document.getElementById('audioLevel').value
    audio.play()
}

