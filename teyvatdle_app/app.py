from flask import Flask, render_template, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import datetime

from get_answers.update_classic_answer import update_classic_answer
from get_answers.update_voiceline_answer import update_voiceline_answer
from get_answers.update_ability_answer import update_ability_answer
from get_answers.update_spy_answer import update_spy_answer

app = Flask(__name__)
# IF DEBUG MODE IS ON, IT WILL TRIGGER THE SCHEDULER AGAIN


def update_answers():
    print("Updating answers...")
    update_classic_answer()
    update_voiceline_answer()
    update_ability_answer()
    update_spy_answer()


def scheduler():
    print("running scheduler")
    scheduler = BackgroundScheduler()
    trigger = CronTrigger(
        year="*",
        month="*",
        day="*",
        hour="*",
        minute="*",
        second="10",
        timezone=datetime.UTC,
    )
    scheduler.add_job(func=update_answers, trigger=trigger)
    scheduler.start()


# scheduler()
update_answers()


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
