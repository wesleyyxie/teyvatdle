import { autocomplete } from "./auto-complete.js";

var voicelineInfoData = null;
var charactersInfoData = null;
var answerData = null;
let tries = localStorage.getItem("voicelineTries") || 0;

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

  categoryDiv.id = "guess_result"; // Single box for the result
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
    result_element.classList.add("bg-green"); // Turn green if correct
    return true;
  } else {
    result_element.classList.add("bg-red"); // Turn red if incorrect
    return false;
  }
}

// Places the character icon
function placeIcon(iconElement, guessData) {
  let imageName;

  // If your images are named using character names
  imageName = guessData["id"].toLowerCase().replace(/\s+/g, "-");
  //imageName = guessData["id"];

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
  let currentTime = new Date();
  let prevTime = new Date(parseInt(localStorage.getItem("prevTimeVoiceline")));

  let streak = parseInt(localStorage.getItem("streakVoiceline")) || 1;
  let maxStreak = parseInt(localStorage.getItem("maxStreakVoiceline")) || 1;

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
  localStorage.setItem("prevTimeVoiceline", currentTime.getTime());
  localStorage.setItem("streakVoiceline", streak);
  localStorage.setItem("maxStreakVoiceline", maxStreak);
}

function submitGuess(e) {
  e.preventDefault(); // Prevent form submission
  let inputElement = document.getElementById("guess");
  let guess = inputElement.value;
  let resultsContainer = document.getElementById("results");
  let audioCountdown = document.getElementById("audio_countdown");
  let guessData = null;
  let gameOver = false;
  // Loop through the characters to find the guessed character
  for (let i = 0; i < voicelineInfoData.length; i++) {
    let currentCharacter = voicelineInfoData[i];
    if (currentCharacter["name"].toLowerCase() === guess.toLowerCase()) {
      guessData = currentCharacter;
      break;
    }
  }

  if (guessData) {
    const previousGuesses =
      JSON.parse(localStorage.getItem("voicelinePreviousGuesses")) || [];

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

    let arrVoiceline = JSON.parse(localStorage.getItem("arrVoiceline"));
    let index = arrVoiceline.findIndex(
      (obj) => obj["name"].toLowerCase() === inputElement.value.toLowerCase()
    );
    arrVoiceline.splice(index, 1)[0];
    localStorage.setItem(
      "voicelinePreviousGuesses",
      JSON.stringify(previousGuesses)
    );
    localStorage.setItem("voicelineTries", tries);
    localStorage.setItem("arrVoiceline", JSON.stringify(arrVoiceline));

    if (gameOver) {
      document.getElementById("submit").disabled = true;
      inputElement.disabled = true;

      localStorage.setItem("voicelineGameOver", "true");
    }

    autocomplete(document.getElementById("guess"), arrVoiceline);
    inputElement.value = "";
    inputElement.focus();
    if (tries < 3) {
      audioCountdown.innerText = `Audio clue in ${3 - tries} tries`;
    }
  }

  if (tries == 3) {
    let audioContainer = document.getElementById("audio_container");
    audioContainer.classList.remove("hidden");
    audioCountdown.classList.add("hidden");
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
  const streak = localStorage.getItem("streakVoiceline");
  const maxStreak = localStorage.getItem("maxStreakVoiceline");
  streakTextElement.innerText = streak;
  streakLabelTextElement.innerText = `Current Streak: ${streak} Max Streak: ${maxStreak}`;

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
  const savedAnswer = localStorage.getItem("voicelineCurrentAnswer");
  if (savedAnswer !== answerData.name) {
    // Clear saved data if the answer has changed
    localStorage.removeItem("voicelinePreviousGuesses");
    localStorage.removeItem("voicelineGameOver");
    localStorage.removeItem("voicelineTries");
    tries = 0;
    localStorage.setItem("voicelineCurrentAnswer", answerData.name); // Update to the new answer
    localStorage.setItem("arrVoiceline", JSON.stringify(charactersInfoData));
  }
}

function playAudio() {
  let audioPlayer = document.createElement('audio');
  let audioContainer = document.getElementById('audio_container');

  audioPlayer.src = `/static/data/voiceline_audios/${answerData.id}${answerData.voiceline_id}.mp3`;
  audioPlayer.volume = document.getElementById("audioLevel").value;
  audioContainer.appendChild(audioPlayer);
  audioPlayer.play();
}

window.playAudio = playAudio;

window.addEventListener("load", async function () {
  
  const answerRes = await fetch("/static/answers/voiceline/todays_answer.json");
  answerData = await answerRes.json(); // Load today's answer
  
  const characterInfoRes = await fetch("/static/data/classicModeInfo.json");
  charactersInfoData = await characterInfoRes.json(); // Load all character info

  const voicelineInfoRes = await fetch("/static/data/voicelines.json");
  voicelineInfoData = await voicelineInfoRes.json();

  // Display today's answer quote from todays_answer.json
  const randomQuoteElement = document.getElementById("random_quote");
  randomQuoteElement.innerText = `"${answerData.quote}"`;

  // Check if the current answer is different from the saved one
  resetGame();

  // Load previous guesses from localStorage
  const previousGuesses =
    JSON.parse(localStorage.getItem("voicelinePreviousGuesses")) || [];
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
  if (localStorage.getItem("voicelineGameOver") === "true") {
    const tries = localStorage.getItem("voicelineTries");
    displayCongratulatoryMessage(tries);
    document.getElementById("submit").disabled = true;
    document.getElementById("guess").disabled = true;
  }

  const cluesCountdownElement = document.getElementById("audio_countdown");
  const audioContainer = document.getElementById("audio_container");
  if (tries < 3) {
    if (tries == 1) {
      cluesCountdownElement.innerText = `Audio clue in 1 try`;
    }
    else {
      cluesCountdownElement.innerText = `Audio clue in ${3 - tries} tries`;
    }
  } else {
    cluesCountdownElement.classList.add("hidden");
    audioContainer.classList.remove("hidden");
  }
  document.getElementById("guess").focus();
  document.addEventListener("keyup", checkSubmit);
  document.getElementById("guess-form").addEventListener("submit", submitGuess);
  //document.getElementById("play_audio").addEventListener("click", playAudio);

  var arrVoiceline = localStorage.getItem("arrVoiceline");
  if (arrVoiceline == null) {
    arrVoiceline = charactersInfoData;
    localStorage.setItem("arrVoiceline", JSON.stringify(arrVoiceline));
  } else {
    arrVoiceline = JSON.parse(arrVoiceline);
  }
  autocomplete(document.getElementById("guess"), arrVoiceline);
});