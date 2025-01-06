import { autocomplete } from "./auto-complete.js";

var charactersInfoData = null;
var answerData = null;
let tries = localStorage.getItem("abilityTries") || 0;

function createBlankRow() {
  // Creates an empty row for previous answer
  let rowContainer = document.createElement("div");
  rowContainer.classList.add(
    "flex",
    "text-white",
    "font-bold",
    "text-[13px]",
    "flex-row",
    "gap-x-[12px]",
    "mb-[10px]"
  );

  // Create one box for the character icon and result (red or green)
  let categoryDiv = document.createElement("div");
  categoryDiv.classList.add(
    "flex",
    "w-[270px]",
    "h-[130px]",
    "border",
    "justify-center",
    "border-white",
    "shadow-[inset_0_4px_6px_rgba(0,0,0,0.5)]",
    "shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
  );

  categoryDiv.id = "guess_result"; // Single box for the result
  rowContainer.appendChild(categoryDiv);

  return rowContainer;
}

function checkGuess(guessData, row) {
  // Checks whether or not the guess was correct or not and changes boxes accordingly
  const result_element = row.querySelector("#guess_result");

  // Display the character icon in the result box
  placeIcon(result_element, guessData);
  // Check if the guessed character is correct
  if (guessData["name"].toLowerCase() === answerData["name"].toLowerCase()) {
    result_element.classList.add("bg-green"); // Turn green if correct
    return true;
  } else {
    result_element.classList.add("bg-red"); // Turn red if incorrect
    return false;
  }
}

function placeIcon(iconElement, guessData) {
  // Places the character icon
  let imageName;

  // If your images are named using character names
  imageName = guessData["id"].toLowerCase().replace(/\s+/g, "-");

  const imageUrl = `/static/images/character_icons/${imageName}.png`;

  iconElement.style.backgroundImage = `url('${imageUrl}')`;
  iconElement.style.backgroundSize = "75px 75px";
  iconElement.style.backgroundPosition = "center 10px";
  iconElement.style.backgroundRepeat = "no-repeat";

  let spanElement = document.createElement("span");
  spanElement.classList.add("mt-[90px]", "bottom-[8px]", "text-lg");
  spanElement.innerText = guessData["name"];
  iconElement.appendChild(spanElement);
}

function updateStreak() {
  /* Calculates the difference between the time of current guess
   and previous guess and update streak and max streak */
  let currentTime = new Date();
  let prevTime = new Date(parseInt(localStorage.getItem("prevTimeAbility")));

  let streak = parseInt(localStorage.getItem("streakAbility")) || 1;
  let maxStreak = parseInt(localStorage.getItem("maxStreakAbility")) || 1;

  if (!isNaN(prevTime.getTime())) {
    // Get the date parts only (ignoring time)
    const currentDate = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate()
    );
    const prevDate = new Date(
      prevTime.getFullYear(),
      prevTime.getMonth(),
      prevTime.getDate()
    );

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
  localStorage.setItem("prevTimeAbility", currentTime.getTime());
  localStorage.setItem("streakAbility", streak);
  localStorage.setItem("maxStreakAbility", maxStreak);
}

function submitGuess(e) {
  e.preventDefault(); // Prevent form submission
  let inputElement = document.getElementById("guess");
  let guess = inputElement.value;
  let resultsContainer = document.getElementById("results");
  let clueCountdown = document.getElementById("clue_countdown");
  let guessData = null;
  let gameOver = false;
  // Loop through the characters to find the guessed character
  for (let i = 0; i < charactersInfoData.length; i++) {
    let currentCharacter = charactersInfoData[i];
    if (currentCharacter["name"].toLowerCase() === guess.toLowerCase()) {
      guessData = currentCharacter;
      break;
    }
  }

  if (guessData) {
    const previousGuesses =
      JSON.parse(localStorage.getItem("abilityPreviousGuesses")) || [];

    for (let j = 0; j < previousGuesses.length; j++) {
      if (guessData.name == previousGuesses[j].name) {
        return
      }
    }

    previousGuesses.push(guessData);

    // If guess is not empty, place a row with the guess
    const row = createBlankRow();
    tries++;
    if (checkGuess(guessData, row)) {
      // User wins
      updateStreak();
      displayCongratulatoryMessage(tries);
      gameOver = true;
    }
    resultsContainer.prepend(row);

    // Save the guess data to localStorage
    localStorage.setItem(
      "abilityPreviousGuesses",
      JSON.stringify(previousGuesses)
    );

    // Update for auto complete
    let arrAbility = JSON.parse(localStorage.getItem("arrAbility"));
    let index = arrAbility.findIndex(
      (obj) => obj["name"].toLowerCase() === inputElement.value.toLowerCase()
    );
    arrAbility.splice(index, 1)[0];
    localStorage.setItem("abilityTries", tries);
    localStorage.setItem("arrAbility", JSON.stringify(arrAbility));

    // User wins
    if (gameOver) {
      document.getElementById("submit").disabled = true;
      inputElement.disabled = true;
      localStorage.setItem("abilityGameOver", "true");
      localStorage.setItem("abilityTries", tries);
    }

    inputElement.value = "";
    inputElement.focus();
    autocomplete(document.getElementById("guess"), arrAbility);
    if (tries < 5) {
      if (5 - tries == 1) {
        clueCountdown.innerText = `Clues in 1 try`;
      }
      else {
        clueCountdown.innerText = `Clues in ${5 - tries} tries`;
      }
    }
  }

  // Show clue
  if (tries == 5) {
    let nameClue = document.getElementById("name_clue");
    clueCountdown.classList.add("hidden");
    nameClue.classList.remove("hidden");
    nameClue.innerText = answerData["abilityName"];
    document.getElementById("ability-icon").classList.remove("grayscale");
  }
}

function displayCongratulatoryMessage(tries) {
  const congratsMessageElement = document.getElementById("congrats_message");
  const triesTextElement = document.getElementById("tried-text");
  triesTextElement.innerText =
    tries < 2
      ? "You guessed it in 1 try!"
      : `You guessed it in ${tries} tries!`;

  const streakTextElement = document.getElementById("streak");
  const streakLabelTextElement = document.getElementById("streak-label");
  const streak = localStorage.getItem("streakAbility");
  const maxStreak = localStorage.getItem("maxStreakAbility");
  streakTextElement.innerText = streak;
  streakLabelTextElement.innerText = `Current Streak: ${streak}\nMax Streak: ${maxStreak}`;

  setTimeout(() => {
    congratsMessageElement.classList.remove("hidden");
    congratsMessageElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, 500); // Delay
}

// submit on enter
function checkSubmit(e) {
  if (e && e.keyCode == 13) {
    e.preventDefault();
    document.getElementById("submit").click();
  }
}

function resetGame() {
  const savedAnswer = localStorage.getItem("abilityCurrentAnswer");
  if (savedAnswer !== answerData.name) {
    // Clear saved data if the answer has changed
    localStorage.removeItem("abilityPreviousGuesses");
    localStorage.removeItem("abilityGameOver");
    localStorage.removeItem("abilityTries");
    tries = 0;
    localStorage.setItem("abilityCurrentAnswer", answerData.name); // Update to the new answer
    localStorage.setItem("arrAbility", JSON.stringify(charactersInfoData));
  }
}

window.addEventListener("load", async function () {
  const answerRes = await fetch("/static/answers/ability/todays_answer.json");
  answerData = await answerRes.json(); // Load today's answer

  const characterInfoRes = await fetch("/static/data/classicModeInfo.json");
  charactersInfoData = await characterInfoRes.json(); // Load all character info

  // Display today's answer quote from todays_answer.json
  const randomAbilityElement = document.getElementById("ability-icon");
  randomAbilityElement.style.backgroundImage = `url('/static/images/ability_icons/${answerData["id"]}_${answerData["type"]}.png')`;
  randomAbilityElement.style.backgroundSize = "90px 90px";

  // Check if the current answer is different from the saved one
  resetGame();

  // Load previous guesses from localStorage
  const previousGuesses =
    JSON.parse(localStorage.getItem("abilityPreviousGuesses")) || [];
  const resultsContainer = document.getElementById("results");

  // Display each previous guess
  previousGuesses.forEach((guessData) => {
    const row = createBlankRow();
    placeIcon(row.querySelector("#guess_result"), guessData);

    if (guessData["name"].toLowerCase() === answerData["name"].toLowerCase()) {
      row.querySelector("#guess_result").classList.add("bg-green");
    } else {
      row.querySelector("#guess_result").classList.add("bg-red");
    }
    resultsContainer.prepend(row);
  });

  // Check if the game was already won
  if (localStorage.getItem("abilityGameOver") === "true") {
    const tries = localStorage.getItem("abilityTries");
    displayCongratulatoryMessage(tries);
    document.getElementById("submit").disabled = true;
    document.getElementById("guess").disabled = true;
  }

  // Clues countdown
  let cluesCountdownElement = document.getElementById("clue_countdown");
  let nameClue = document.getElementById("name_clue");
  if (tries < 5) {
    if (5 - tries == 1) {
      cluesCountdownElement.innerText = `Clues in 1 try`;
    }
    else {
      cluesCountdownElement.innerText = `Clues in ${5 - tries} tries`;
    }
  } else {
    cluesCountdownElement.classList.add("hidden");
    document.getElementById("ability-icon").classList.remove("grayscale");
    nameClue.classList.remove("hidden");
    nameClue.innerText = answerData["abilityName"];
  }

  document.getElementById("guess").focus();
  document.addEventListener("keyup", checkSubmit);
  document.getElementById("guess-form").addEventListener("submit", submitGuess);

  var arrAbility = localStorage.getItem("arrAbility");
  if (arrAbility == null) {
    arrAbility = charactersInfoData;
    localStorage.setItem("arrAbility", JSON.stringify(arrAbility));
  } else {
    arrAbility = JSON.parse(arrAbility);
  }
  autocomplete(document.getElementById("guess"), arrAbility);
});
