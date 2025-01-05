import json
import requests
from PIL import Image
import os
from io import BytesIO
from bs4 import BeautifulSoup


def get_splashes(info):
    cwd = os.getcwd()
    path_to_splash_folder = os.path.join(
        cwd, "teyvatdle_app", "static", "images", "character_splashes"
    )
    response = requests.get(
        f"https://genshin-impact.fandom.com/wiki/Wish/Gallery",
    )

    html_content = response.text
    soup_page = BeautifulSoup(html_content, "html.parser")
    gallery_container = soup_page.find("div", id="gallery-3")
    item_containers = gallery_container.find_all("div", class_="wikia-gallery-item")

    for i in item_containers:
        url = i.find("img").get("src").split(".png")[0] + ".png"
        character_name = url[
            len(
                "https://static.wikia.nocookie.net/gensin-impact/images/c/c3/Character_"
            ) : -len("_Full_Wish.png")
        ]

        print(url)
        response_burst = requests.get(url, timeout=30)
        splash = Image.open(BytesIO(response_burst.content)).convert("RGBA")
        original_width, original_height = splash.size

        if original_height > original_width:
            new_dimension = original_height
        else:
            new_dimension = original_width

        new_splash = Image.new("RGBA", (new_dimension, new_dimension), (0, 0, 0, 0))
        position = (
            (new_dimension - original_width) // 2,
            (new_dimension - original_height) // 2,
        )
        new_splash.paste(splash, position, splash)
        for c in info:
            if c.get("name").lower().replace(" ", "_") == character_name.lower():
                new_splash.save(
                    os.path.join(
                        path_to_splash_folder, f"{c.get("id").lower()}_splash.png"
                    )
                )
                print("saved as " + c.get("id").lower() + "_splash.png")


def check_if_all_in_folder(info):
    cwd = os.getcwd()
    path_to_splash_folder = os.path.join(
        cwd, "teyvatdle_app", "static", "images", "character_splashes"
    )
    for c in info:
        id = c.get("id").lower()
        in_folder = False
        for filename in os.listdir(path_to_splash_folder):
            if filename == f"{id}_splash.png":
                in_folder = True
        if in_folder == False:
            print(f"{id} is not in splash folder!")


if __name__ == "__main__":
    path_to_character_info = "./teyvatdle_app/static/data/classicModeInfo.json"
    with open(path_to_character_info) as character_info:
        info = json.load(character_info)
        get_splashes(info)
