import requests
import json
import os


def fetch_character_data(api_url):
    response = requests.get(api_url)
    response.raise_for_status()  # Raise an error for bad responses
    return response.json()  # Return the JSON data


def write_json_file(file_path, content):
    # Check if the content is empty before writing
    with open(file_path, "w") as json_file:
        content_new_arr = []
        for character in content:
            character_info = {
                "name": character.get("name"),
                "title": character.get("title"),
                "vision": character.get("vision"),
                "weapon": character.get("weapon"),
                "gender": character.get("gender"),
                "nation": character.get("nation"),
                "affiliation": character.get("affiliation"),
                "release": character.get("release"),
                # maybe stars?
            }
            content_new_arr.append(character_info)
        json.dump(content_new_arr, json_file, indent=4)
        print(f"Data written to {file_path} successfully.")  # Confirmation message


def main():
    api_url = "https://genshin.jmp.blue/characters/all"  # Use the correct API URL

    character_data = fetch_character_data(api_url)
    # Write all character data to a JSON file
    output_file = "./teyvatdle/static/data/classicModeInfo.json"
    write_json_file(output_file, character_data)


if __name__ == "__main__":
    main()
