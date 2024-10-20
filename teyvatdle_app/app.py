from flask import Flask, render_template, jsonify
from apscheduler.schedulers.background import BackgroundScheduler

from get_answers.update_classic_answer import update_classic_answer

import os

app = Flask(__name__)
# IF DEBUG MODE IS ON, IT WILL TRIGGER THE SCHEDULER AGAIN
# scheduler = BackgroundScheduler()
# scheduler.add_job(func=update_classic_answer, trigger=”cron”, hour = 0, minute = 0)
# scheduler.start()

update_classic_answer()


@app.route("/spy")
def spy():
    return render_template("spy_mode.html")


@app.route("/ability")
def ability():
    return render_template("ability_mode.html")


@app.route("/voiceline")
def voiceline():
    return render_template("voiceline_mode.html")


@app.route("/classic")
def classic():
    return render_template("classic_mode.html")


@app.route("/")
def hello_world():
    return render_template("home.html")


if __name__ == "__main__":
    app.run(debug=True)
