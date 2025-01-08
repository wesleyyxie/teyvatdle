import { autocomplete } from "./auto-complete.js";

var charactersInfoData = null;
var answerData = null;
var splashImageName = null;
var tries = localStorage.getItem("spyTries") || 0;
var pathToPixelatedFolder = "/static/images/character_splashes/pixelated/";
var pathToSplashFolder = "/static/images/character_splashes/";

function createBlankRow() {
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

  categoryDiv.id = "guess-result"; // Single box for the result
  rowContainer.appendChild(categoryDiv);

  return rowContainer;
}

// Checks whether or not the guess was correct and changes boxes accordingly
function checkGuess(guessData, row) {
  const resultElement = row.querySelector("#guess-result");

  // Display the character icon in the result box
  placeIcon(resultElement, guessData);

  // Check if the guessed character is correct
  if (guessData["name"].toLowerCase() === answerData["name"].toLowerCase()) {
    resultElement.classList.add("bg-green"); // Turn green if correct
    return true;
  } else {
    resultElement.classList.add("bg-red"); // Turn red if incorrect
    return false;
  }
}

// Places the character icon
function placeIcon(iconElement, guessData) {
  let imageName = guessData["id"].toLowerCase().replace(/\s+/g, "-");
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

// Handles submission of guess
function submitGuess(e) {
  e.preventDefault(); // Prevent form submission
  let inputElement = document.getElementById("guess");
  let guess = inputElement.value;
  let resultsContainer = document.getElementById("results");
  let clueCountdown = document.getElementById("clue-countdown");
  let splashElement = document.getElementById("splash-icon");
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
      JSON.parse(localStorage.getItem("spyPreviousGuesses")) || [];

    // If current guess is in previous guess, return
    for (let j = 0; j < previousGuesses.length; j++) {
      if (guessData.name == previousGuesses[j].name) {
        return
      }
    }
    previousGuesses.push(guessData);
    const row = createBlankRow();
    tries++;
    if (checkGuess(guessData, row)) {
      updateStreak();
      displayCongratulatoryMessage(tries);
      gameOver = true;
    }
    resultsContainer.prepend(row);

    // Save the guess data to localStorage
    localStorage.setItem("spyPreviousGuesses", JSON.stringify(previousGuesses));

    let arrSpy = JSON.parse(localStorage.getItem("arrSpy"));
    let index = arrSpy.findIndex(
      (obj) => obj["name"].toLowerCase() === inputElement.value.toLowerCase()
    );
    arrSpy.splice(index, 1)[0];
    localStorage.setItem("spyTries", tries);
    localStorage.setItem("arrSpy", JSON.stringify(arrSpy));

    if (gameOver) {
      document.getElementById("submit").disabled = true;
      inputElement.disabled = true;
      localStorage.setItem("spyGameOver", "true");
      localStorage.setItem("spyTries", tries);
    }
    autocomplete(document.getElementById("guess"), arrSpy);
    inputElement.value = "";
    inputElement.focus();
    if (tries <= 6) {
      let i = 2 - (tries % 2)
      if (i == 1) {
        clueCountdown.innerText = `Clue in 1 try`;
      }
      else {
        clueCountdown.innerText = `Clue in ${i} tries`;
      }
    }
  }

  if (tries >= 6) {
    clueCountdown.classList.add("hidden");
    splashElement.style.backgroundImage = `url('${pathToPixelatedFolder}${splashImageName}_splash_pixelated_${4}.png')`;
  } else if (tries >= 4) {
    splashElement.style.backgroundImage = `url('${pathToPixelatedFolder}${splashImageName}_splash_pixelated_${3}.png')`;
  } else if (tries >= 2) {
    splashElement.style.backgroundImage = `url('${pathToPixelatedFolder}${splashImageName}_splash_pixelated_${2}.png')`;
  }
  if (gameOver) {
    splashElement.style.backgroundImage = `url('${pathToSplashFolder}${splashImageName}_splash.png')`;
  }
}

function updateStreak() {
  let currentTime = new Date();
  let prevTime = new Date(parseInt(localStorage.getItem("prevTimeSpy")));

  let streak = parseInt(localStorage.getItem("streakSpy")) || 1;
  let maxStreak = parseInt(localStorage.getItem("maxStreakSpy")) || 1;

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
  localStorage.setItem("prevTimeSpy", currentTime.getTime());
  localStorage.setItem("streakSpy", streak);
  localStorage.setItem("maxStreakSpy", maxStreak);
}

// Displays congratulatory message when the correct guess is made
function displayCongratulatoryMessage(tries) {
  const congratsMessageElement = document.getElementById("congrats-message");
  const triesTextElement = document.getElementById("tried-text");
  triesTextElement.innerText =
    tries < 2
      ? "You guessed it in 1 try!"
      : `You guessed it in ${tries} tries!`;

  const streakTextElement = document.getElementById("streak");
  const streakLabelTextElement = document.getElementById("streak-label");
  const streak = localStorage.getItem("streakSpy");
  const maxStreak = localStorage.getItem("maxStreakSpy");
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
  const savedAnswer = localStorage.getItem("spyCurrentAnswer");
  if (savedAnswer !== answerData.name) {
    // Clear saved data if the answer has changed
    localStorage.removeItem("spyPreviousGuesses");
    localStorage.removeItem("spyGameOver");
    localStorage.removeItem("spyTries");
    tries = 0;
    localStorage.setItem("spyCurrentAnswer", answerData.name); // Update to the new answer
    localStorage.setItem("arrSpy", JSON.stringify(charactersInfoData));
  }
}

window.addEventListener("load", async function () {
  // Fetch today's answer
  const answerRes = await fetch("/static/answers/spy/todays_answer.json");
  answerData = await answerRes.json();

  // Fetch character info data
  const characterInfoRes = await fetch("/static/data/classicModeInfo.json");
  charactersInfoData = await characterInfoRes.json();

  // Display today's answer splash image
  const splashElement = document.getElementById("splash-icon");
  splashImageName = answerData["id"].toLowerCase().replace(/\s+/g, "-");

  // Check if the current answer is different from the saved one
  resetGame();

  let clueCountdown = document.getElementById("clue-countdown");

  if (tries < 6) {
    let i = 2 - (tries % 2)
    if (i == 1) {
      clueCountdown.innerText = `Clue in 1 try`;
    }
    else {
      clueCountdown.innerText = `Clue in ${i} tries`;
    }
  }

  if (tries >= 6) {
    clueCountdown.classList.add("hidden");
    splashElement.style.backgroundImage = `url('${pathToPixelatedFolder}${splashImageName}_splash_pixelated_${4}.png')`;
  } else if (tries >= 4) {
    splashElement.style.backgroundImage = `url('${pathToPixelatedFolder}${splashImageName}_splash_pixelated_${3}.png')`;
  } else if (tries >= 2) {
    splashElement.style.backgroundImage = `url('${pathToPixelatedFolder}${splashImageName}_splash_pixelated_${2}.png')`;
  } else if (tries < 2) {
    splashElement.style.backgroundImage = `url('${pathToPixelatedFolder}${splashImageName}_splash_pixelated_${1}.png')`;
  }

  // Load previous guesses from localStorage
  const previousGuesses =
    JSON.parse(localStorage.getItem("spyPreviousGuesses")) || [];
  const resultsContainer = document.getElementById("results");

  // Display each previous guess
  previousGuesses.forEach((guessData) => {
    const row = createBlankRow();
    placeIcon(row.querySelector("#guess-result"), guessData);

    if (guessData["name"].toLowerCase() === answerData["name"].toLowerCase()) {
      row.querySelector("#guess-result").classList.add("bg-green");
    } else {
      row.querySelector("#guess-result").classList.add("bg-red");
    }
    resultsContainer.prepend(row);
  });

  // Check if the game was already won
  if (localStorage.getItem("spyGameOver") === "true") {
    const tries = localStorage.getItem("spyTries");
    displayCongratulatoryMessage(tries);
    document.getElementById("submit").disabled = true;
    document.getElementById("guess").disabled = true;
    splashElement.style.backgroundImage = `url('${pathToSplashFolder}${splashImageName}_splash.png')`;
  }

  // Focus the guess input and add event listeners
  document.getElementById("guess").focus();
  document.addEventListener("keyup", checkSubmit);
  document.getElementById("guess-form").addEventListener("submit", submitGuess);

  var arrSpy = localStorage.getItem("arrSpy");
  if (arrSpy == null) {
    arrSpy = charactersInfoData;
    localStorage.setItem("arrSpy", JSON.stringify(arrSpy));
  } else {
    arrSpy = JSON.parse(arrSpy);
  }
  autocomplete(document.getElementById("guess"), arrSpy);
});
