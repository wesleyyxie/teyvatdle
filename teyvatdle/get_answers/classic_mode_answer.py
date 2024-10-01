import json
import random
import os


def get_random_character():
    # Ensure the file is in the 'data' directory within the script's directory
    current_directory = os.path.dirname(os.path.abspath(__file__))
    data_directory = os.path.join(
        current_directory, "..", "static", "data"
    )  # Adjust the path to the data folder
    file_path = os.path.join(data_directory, "classicModeInfo.json")

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


def get_classic_answer():
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
        print(character_info)
        return character_info
    else:
        print("No characters found in the JSON file.")  # Debug


if __name__ == "__main__":
    get_classic_answer()
