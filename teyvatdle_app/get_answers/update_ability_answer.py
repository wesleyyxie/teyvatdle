import json
from json.decoder import JSONDecodeError
import random
import os

current_directory = os.path.dirname(os.path.abspath(__file__))


def get_random_ability():
    all_abilities_path = os.path.join(
        current_directory, "..", "static", "data", "abilities.json"
    )
    previous_answers_path = os.path.join(
        current_directory, "..", "static", "answers","ability", "previous_answers.json"
    )
    with open(all_abilities_path, "r") as abilities_json:
            abilities = json.load(abilities_json)

    with open(previous_answers_path, "r") as previous_answers_json:
        try:
            previous_answers = json.load(previous_answers_json)
            if len(previous_answers) == len(abilities):
                previous_answers = []
        except JSONDecodeError:
            previous_answers = []
    

    while True:
        random_ability = random.choice(abilities)
        if previous_answers == [] or random_ability not in previous_answers:
            print(f"Selected {random_ability.get('name')}!")
            break
        print(f"{random_ability.get('name')} was already an answer! Reselecting!")

    previous_answers.append(random_ability)
    with open(previous_answers_path, "w") as previous_answers_json:
        json.dump(previous_answers, previous_answers_json, indent=4)

    return random_ability


def update_ability_answer():
    random_ability = (
        get_random_ability()
    )  # Call the function to get a random character
    
    # Serializing json
    ability_json = json.dumps(random_ability, indent=4)
    # Writing to sample.json
    with open(
        os.path.join(
            current_directory, "..", "static", "answers", "ability", "todays_answer.json"
        ),
        "w",
    ) as outfile:
        outfile.write(ability_json)
    
if __name__ == "__main__":
    update_ability_answer()

