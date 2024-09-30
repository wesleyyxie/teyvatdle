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
        json.dump(
            content, json_file, indent=4
        )  # Write content as JSON with indentation
        print(f"Data written to {file_path} successfully.")  # Confirmation message


def main():
    api_url = "https://genshin.jmp.blue/characters/all"  # Use the correct API URL

    character_data = fetch_character_data(api_url)
    # Write all character data to a JSON file
    output_file = "./teyvatdle/static/data/classicModeInfo.json"
    write_json_file(output_file, character_data)


if __name__ == "__main__":
    main()
