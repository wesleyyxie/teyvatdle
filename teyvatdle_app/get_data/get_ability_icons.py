import json
import requests
from PIL import Image
import os
from io import BytesIO


def get_icons():
    cwd = os.getcwd()
    path_to_character_info = "./teyvatdle_app/static/data/classicModeInfo.json"
    path_to_icons_folder = os.path.join(
        cwd, "teyvatdle_app", "static", "images", "ability_icons"
    )
    with open(path_to_character_info) as character_info:
        info = json.load(character_info)
        for c in info:
            id = c.get("id").lower()
            print(id)
            
            no_icons = ["kachina", "kinich", "mualani"] # These needs to be manually retrieved
            if id not in no_icons:
                response_burst = requests.get(f"https://genshin.jmp.blue/characters/{id}/talent-burst")
                burst_icon = Image.open(BytesIO(response_burst.content))
                burst_icon.save(os.path.join(path_to_icons_folder, f"{id}_burst.png"))

                response_skill = requests.get(f"https://genshin.jmp.blue/characters/{id}/talent-skill")
                skill_icon = Image.open(BytesIO(response_skill.content))
                skill_icon.save(os.path.join(path_to_icons_folder, f"{id}_skill.png"))


if __name__ == "__main__":
    get_icons()
