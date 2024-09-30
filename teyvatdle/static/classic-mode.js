character_dictionary = { 
    "Amber" : 1, 
    "Qiqi": 2, 
    "Kaeya" : 3,
};

async function getCharacter(id){
    const characterResponse = await fetch(`https://gsi.fly.dev/characters/${id}`);
    const json = await characterResponse.json();
    console.log(json)
}

async function submitGuess(answer){
    guess = document.getElementById("guess");

    if (character_dictionary[guess] != answer) {
        console.log("try again!")
    }
    else {
        console.log("NICE")
    }
}

