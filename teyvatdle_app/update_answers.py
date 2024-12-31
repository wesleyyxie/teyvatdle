from get_answers.update_classic_answer import update_classic_answer
from get_answers.update_voiceline_answer import update_voiceline_answer
from get_answers.update_ability_answer import update_ability_answer
from get_answers.update_spy_answer import update_spy_answer


def update_answers():
    update_classic_answer()
    update_voiceline_answer()
    update_ability_answer()
    update_spy_answer()


if __name__ == "__main__":
    update_answers()
