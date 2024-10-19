import requests
from bs4 import BeautifulSoup
import re
import json


def get_voicelines():
    path_to_character_info = "./teyvatdle_app/static/data/classicModeInfo.json"

    with open(path_to_character_info) as character_info:
        info = json.load(character_info)
        for c in info:
            character_name = c.get("name")
            response = requests.get(
                f"https://genshin-impact.fandom.com/wiki/{character_name}/Voice-Overs"
            )
            html_content = response.text
            soup_page = BeautifulSoup(html_content, "html.parser")
            tables = soup_page.find_all("table", class_="wikitable")

            not_attacks_tds = []
            not_attacks = tables[0].find_all("td")
            for td in not_attacks:
                if td.find(attrs={"lang": "en"}):
                    not_attacks_tds.append(td)

            attacks_td = []
            attacks = tables[1].find_all("td")
            for td in attacks:
                if td.find(attrs={"lang": "en"}):
                    attacks_td.append(td)

            i = 0
            for t in not_attacks_tds:
                if i > 1:
                    break
                voiceline = {}
                audio = t.find("audio")
                if audio != -1:
                    audio_src = audio.get("src")
                quote_span_tag = t.find(attrs={"lang": "en"})
                if quote_span_tag:
                    for a in quote_span_tag.find_all("a"):
                        a_text = a.get_text()  # Get the text inside the <a> tag
                        a.replace_with(a_text)  # Replace <a> with its text

                    quote_text = quote_span_tag.get_text()
                    voiceline["name"] = character_name
                    voiceline["audio"] = audio_src
                    voiceline["quote"] = quote_text
                    voiceline["id"] = i

                    name_parts = character_name.split()
                    name_in_quote = False
                    for p in name_parts:
                        if p in quote_text:
                            name_in_quote = True
                    if (
                        name_in_quote == False
                        and len(quote_text.split()) >= 5
                        and len(quote_text.split()) <= 15
                    ):
                        # load it
                        with open(
                            "./teyvatdle_app/static/data/voicelines.json", "r"
                        ) as json_file:
                            file_data = json.load(json_file)
                        # change it
                        file_data.append(voiceline)
                        # write it all back
                        with open(
                            "./teyvatdle_app/static/data/voicelines.json", "w"
                        ) as json_file:
                            json.dump(file_data, json_file, indent=4)
                        print("added to json!")
                        i += 1

            j = 2
            for t in attacks_td:
                if j > 3:
                    break
                voiceline = {}
                audio = t.find("audio")
                if audio != -1:
                    audio_src = audio.get("src")
                quote_span_tag = t.find(attrs={"lang": "en"})
                if quote_span_tag:
                    for a in quote_span_tag.find_all("a"):
                        a_text = a.get_text()  # Get the text inside the <a> tag
                        a.replace_with(a_text)  # Replace <a> with its text

                    quote_text = quote_span_tag.get_text()
                    quote_text = re.sub(r"\(.*?\)\s*", "", quote_text)
                    voiceline["name"] = character_name
                    voiceline["audio"] = audio_src
                    voiceline["quote"] = quote_text
                    voiceline["id"] = j

                    name_parts = character_name.split()
                    name_in_quote = False
                    for p in name_parts:
                        if p in quote_text:
                            name_in_quote = True
                    if (
                        name_in_quote == False
                        and len(quote_text.split()) >= 5
                        and len(quote_text.split()) <= 15
                        and "~" not in quote_text
                    ):
                        # load it
                        with open(
                            "./teyvatdle_app/static/data/voicelines.json", "r"
                        ) as json_file:
                            file_data = json.load(json_file)
                        # change it
                        file_data.append(voiceline)
                        # write it all back
                        with open(
                            "./teyvatdle_app/static/data/voicelines.json", "w"
                        ) as json_file:
                            json.dump(file_data, json_file, indent=4)
                        print("added to json!")
                        j += 1


if __name__ == "__main__":
    get_voicelines()
