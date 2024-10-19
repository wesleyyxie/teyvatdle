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
        categoryDiv.classList.add("flex", "w-[75px]", "h-[75px]", "items-center", "justify-center", "text-center", "border", "border-white", "shadow-[inset_0_4px_6px_rgba(0,0,0,0.5)]", "shadow-[0_4px_6px_rgba(0,0,0,0.5)]")
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
        if (gameOver) {
            displayCongratulatoryMessage(tries); // Call to display message
            document.getElementById("submit").disabled = true;
            inputElement.disabled = true;
        }
        let index = window.arr.findIndex(obj => obj["name"].toLowerCase() === inputElement.value.toLowerCase());
        window.arr.splice(index, 1)[0];
        inputElement.value = "";  // Remove all user input in text box
        inputElement.focus();
    }
}

function displayCongratulatoryMessage(tries) {
    const congratsMessageElement = document.getElementById("congrats_message");
    congratsMessageElement.innerHTML = ""; 
    let message = "Congrats!";

    // Congrats text
    const congratsText = document.createElement("div");
    congratsText.innerText = message;
    congratsText.classList.add("font-bold", "text-3xl", "text-center"); // Increased font size

    // Number of tries text
    const triesText = document.createElement("div");
    triesText.innerText = tries < 2 ? "You guessed it in 1 try!" : `You guessed it in ${tries} tries!`;
    triesText.classList.add("text-lg", "text-center");

    // Other Modes header
    const modesHeader = document.createElement("div");
    modesHeader.innerText = "Other Modes";
    modesHeader.classList.add("font-bold", "text-xl", "text-center", "mt-4"); 

    // Function to show tooltip
    function showTooltip(button, text) {
        const tooltip = document.getElementById("tooltip");
        tooltip.innerText = text;

        const buttonRect = button.getBoundingClientRect(); // Get the button's position
        tooltip.style.left = `${buttonRect.left + (buttonRect.width / 2) - (tooltip.offsetWidth / 2)}px`; // Center tooltip above button
        tooltip.style.top = `${buttonRect.top - tooltip.offsetHeight - 5}px`; // Position above button with some space
        tooltip.classList.remove("hidden");
    }

    // Function to hide tooltip
    function hideTooltip() {
        const tooltip = document.getElementById("tooltip");
        tooltip.classList.add("hidden");
    }

    // Create button container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex", "gap-4", "justify-center", "mt-2"); // Adjust margin 

    // Voiceline Mode button
    const voicelineButton = document.createElement("img");
    voicelineButton.src = "/static/images/buttons/voiceline_1.png"; 
    voicelineButton.alt = "Voiceline Mode";
    voicelineButton.classList.add("w-[50px]", "h-[50px]", "cursor-pointer", "hover:scale-button"); // Adjust size 
    voicelineButton.onclick = () => window.location.href = "voiceline";

    voicelineButton.addEventListener("mouseenter", () => showTooltip(voicelineButton, "Voiceline"));
    voicelineButton.addEventListener("mouseleave", hideTooltip);


    // Ability Mode button
    const abilityButton = document.createElement("img");
    abilityButton.src = "/static/images/buttons/ability_1.png"; 
    abilityButton.alt = "Ability Mode";
    abilityButton.classList.add("w-[50px]", "h-[50px]", "cursor-pointer", "hover:scale-button"); // Adjust size 
    abilityButton.onclick = () => window.location.href = "ability";

    abilityButton.addEventListener("mouseenter", () => showTooltip(abilityButton, "Ability"));
    abilityButton.addEventListener("mouseleave", hideTooltip);

    // Spy Mode button
    const spyButton = document.createElement("img");
    spyButton.src = "/static/images/buttons/spy_1.png"; 
    spyButton.alt = "Spy Mode";
    spyButton.classList.add("w-[50px]", "h-[50px]", "cursor-pointer", "hover:scale-button"); // Adjust size 
    spyButton.onclick = () => window.location.href = "spy";

    spyButton.addEventListener("mouseenter", () => showTooltip(spyButton, "Spy"));
    spyButton.addEventListener("mouseleave", hideTooltip);

    buttonContainer.appendChild(voicelineButton);
    buttonContainer.appendChild(abilityButton);
    buttonContainer.appendChild(spyButton);

    // Append everything to the congrats message element
    setTimeout(() => {
        congratsMessageElement.appendChild(congratsText);
        congratsMessageElement.appendChild(triesText);
        congratsMessageElement.appendChild(modesHeader); 
        congratsMessageElement.appendChild(buttonContainer);
        congratsMessageElement.classList.remove("hidden");
        congratsMessageElement.classList.add("text-white", "bg-green-800", "border-4", "border-green-600", "p-6", "mt-4", "rounded"); // Increased padding
        congratsMessageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 2200); // Delay
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
});