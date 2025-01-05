import requests
import json


def fetch_character_data(api_url):
    response = requests.get(api_url)
    response.raise_for_status()  # Raise an error for bad responses
    return response.json()  # Return the JSON data


def write_json_file(file_path, content):
    # Check if the content is empty before writing
    with open(file_path, "w") as json_file:
        content_new_arr = []
        for character in content:
            if "Traveler" not in character.get("name"):
                character_elemental_skill = {
                    "name": character.get("name"),
                    "id": character.get("id").lower(),
                    "type": "skill",
                    "abilityName": character.get("skillTalents")[1].get("name"),
                }
                character_elemental_burst = {
                    "name": character.get("name"),
                    "id": character.get("id").lower(),
                    "type": "burst",
                    "abilityName": character.get("skillTalents")[2].get("name"),
                }
                content_new_arr.append(character_elemental_skill)
                content_new_arr.append(character_elemental_burst)
        json.dump(content_new_arr, json_file, indent=4)
        print(f"Data written to {file_path} successfully.")  # Confirmation message


def main():
    api_url = "https://genshin.jmp.blue/characters/all"  # Use the correct API URL

    character_data = fetch_character_data(api_url)
    # Write all character data to a JSON file
    output_file = "./teyvatdle_app/static/data/abilities.json"
    write_json_file(output_file, character_data)


if __name__ == "__main__":
    main()
