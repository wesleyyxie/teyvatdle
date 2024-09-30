const answer = "Amber"
var character_data = null

window.onload = async function() {
    const res = await fetch("/static/data/classicModeInfo.json");
    character_data = await res.json();
};

async function submitGuess(answer){
    guess = document.getElementById("guess").value;

    for (var i = 0; i < character_data.length; i++){
        var current_character = character_data[i];
        console.log(current_character["name"])
        if (current_character["name"] == guess){
            console.log("CORRECT")
            break;
        }
    }
}
 