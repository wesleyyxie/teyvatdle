import json
from json.decoder import JSONDecodeError
import random
import os

current_directory = os.path.dirname(os.path.abspath(__file__))


def get_random_character():
    all_characters_path = os.path.join(
        current_directory, "..", "static", "data", "classicModeInfo.json"
    )
    previous_answers_path = os.path.join(
        current_directory, "..", "static", "answers", "spy", "previous_answers.json"
    )
    with open(all_characters_path, "r") as characters_json:
        characters = json.load(characters_json)

    with open(previous_answers_path, "r") as previous_answers_json:
        try:
            previous_answers = json.load(previous_answers_json)
            if len(previous_answers) == len(characters):
                previous_answers = []
        except JSONDecodeError:
            previous_answers = []

    while True:
        random_character = random.choice(characters)
        if previous_answers == [] or random_character not in previous_answers:
            print(f"Selected {random_character.get('name')}!")
            break
        print(f"{random_character.get('name')} was already an answer! Reselecting!")

    previous_answers.append(random_character)
    with open(previous_answers_path, "w") as previous_answers_json:
        json.dump(previous_answers, previous_answers_json, indent=4)

    return random_character


def update_spy_answer():
    random_character = (
        get_random_character()
    )  # Call the function to get a random character

    # Serializing json
    character_json = json.dumps(random_character, indent=4)
    # Writing to sample.json
    with open(
        os.path.join(
            current_directory, "..", "static", "answers", "spy", "todays_answer.json"
        ),
        "w",
    ) as outfile:
        outfile.write(character_json)
