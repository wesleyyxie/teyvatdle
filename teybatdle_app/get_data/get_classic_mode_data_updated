from flask import Flask, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
import json
import random
import os
from datetime import datetime

app = Flask(__name__)


# Global variables that store the daily character

current_character = None
chosen_characters_file = "chosen_characters.json" # Stores the chosen characters in a list


# Get every character from the JSON file
def get_all_characters(file_name="classicModeInfo.json"):

    current_directory = os.path.dirname(os.path.abspath(__file__))
    data_directory = os.path.join(current_directory, "static", "data")
    file_path = os.path.join(data_directory, file_name)

    if os.path.exists(file_path):
        with open(file_path, "r") as json_file:
            return json.load(json_file)
    return []

# Get the chosen characters from the JSON file
def get_chosen_characters():
    if os.path.exists(chosen_characters_file):
        with open(chosen_characters_file, "r") as file:
            return json.load(file)
    return []

# Saves the chosen characters to the JSON file
def save_chosen_characters(chosen_characters):
    """Save the chosen characters to a JSON file."""
    with open(chosen_characters_file, "w") as file:
        json.dump(chosen_characters, file, indent=4)

# Updates the daily character and also makes sure that the character doesn't repeat until every other characters have been chosen
def update_character_of_the_day():
    global current_character

    all_characters = get_all_characters()
    chosen_characters = get_chosen_characters()

    # Resets the chosen character list after every character has been chosen
    if len(chosen_characters) == len(all_characters):
        chosen_characters = []

    remaning_characters = [char for char in all_characters if char["name"] not in chosen_characters]

    if remaning_characters:
        current_character = random.choice(remaning_characters) # Selects a random character from the list of remaning characters
        chosen_characters.append(current_character["name"]) # Adds character to chosen characters JSON list
        save_chosen_characters(chosen_characters) # Saves the updated list

        print(f"Character updated: {current_character['name']} at {datetime.now()}")

    else:
        print("No characters left to choose from.")


def get_random_character(file_name="classicModeInfo.json"):
    # Ensure the file is in the 'data' directory within the script's directory
    current_directory = os.path.dirname(os.path.abspath(__file__))
    data_directory = os.path.join(
        current_directory, "static", "data"
    )  # Adjust the path to the data folder
    file_path = os.path.join(data_directory, file_name)

    # Read the JSON file
    if os.path.exists(file_path):  # Check if the file exists
        with open(file_path, "r") as json_file:
            characters = json.load(json_file)  # Load the list of characters

        # Check if characters list is not empty
        if characters:
            # Select a random character
            random_character = random.choice(characters)
            return random_character
    else:
        print(
            f"No JSON file found at: {file_path}"
        )  # Inform the user if the file is not found (Debug)

    return None

# Set up a scheduler to update the character every midnight
scheduler = BackgroundScheduler()
scheduler.add_job(func=update_character_of_the_day, trigger="interval", minutes=1)
scheduler.start()

# API endpoint to get the current character
@app.route("/current-character", methods=["GET"])
def current_character_api():
    if current_character:
        character_info = {
            "name": current_character.get("name"),
            "title": current_character.get("title"),
            "vision": current_character.get("vision"),
            "weapon": current_character.get("weapon"),
            "gender": current_character.get("gender"),
            "nation": current_character.get("nation"),
            "affiliation": current_character.get("affiliation"),
            "release": current_character.get("release"),
        }
        return jsonify(character_info)
    return jsonify({"error": "No character selected yet"}), 500

# Initialize the first character when the server starts
update_character_of_the_day()


def main():
    random_character = (
        get_random_character()
    )  # Call the function to get a random character
    if random_character:
        # Specific Attributes
        character_info = {
            "name": random_character.get("name"),
            "title": random_character.get("title"),
            "vision": random_character.get("vision"),
            "weapon": random_character.get("weapon"),
            "gender": random_character.get("gender"),
            "nation": random_character.get("nation"),
            "affiliation": random_character.get("affiliation"),
            "release": random_character.get("release"),
            # maybe stars?
        }

        print(json.dumps(character_info, indent=4))
    else:
        print("No characters found in the JSON file.")  # Debug


if __name__ == "__main__":
    main()
