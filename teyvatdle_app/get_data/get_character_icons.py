import json
import requests
from PIL import Image
import os
from io import BytesIO


def get_icons():
    cwd = os.getcwd()
    path_to_character_info = "./teyvatdle_app/static/data/classicModeInfo.json"
    path_to_icons_folder = os.path.join(
        cwd, "teyvatdle_app", "static", "images", "character_icons"
    )
    with open(path_to_character_info) as character_info:
        info = json.load(character_info)
        for c in info:
            id = c.get("id").lower()
            print(id)
            response = requests.get(f"https://genshin.jmp.blue/characters/{id}/icon")
            icon = Image.open(BytesIO(response.content))
            icon.save(os.path.join(path_to_icons_folder, f"{id}.png"))


if __name__ == "__main__":
    get_icons()
