import os
from PIL import Image


def pixelate_images():
    path_to_splash = "./teyvatdle_app/static/images/character_splashes"
    files = files = [
        i
        for i in os.listdir(path_to_splash)
        if not os.path.isdir(os.path.join(path_to_splash, i))
    ]
    for f in files:
        print(f)
        splash = Image.open(path_to_splash + "/" + f)
        for i in range(1, 5):
            splash_small = splash.resize(
                (i * 16, i * 16), resample=Image.Resampling.BILINEAR
            )
            splash_small = splash_small.resize(splash.size, Image.Resampling.NEAREST)
            splash_small.save(
                f'{path_to_splash}/pixelated/{f.split(".png")[0]}_pixelated_{i}.png'
            )


if __name__ == "__main__":
    pixelate_images()
