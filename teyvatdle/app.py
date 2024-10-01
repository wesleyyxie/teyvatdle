from flask import Flask, render_template, jsonify
from get_answers.classic_mode_answer import get_classic_answer

app = Flask(__name__)

todays_answers = get_classic_answer()
print(todays_answers)


@app.route("/classic_answer")
def classic_answer():
    return jsonify(todays_answers)


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
