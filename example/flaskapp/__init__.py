from flask import Flask, jsonify, render_template
from random import randint


def create_app():
    app = Flask(__name__)

    @app.route("/", methods=["GET"])
    def main():
        return render_template("main.html")

    @app.route("/random/<int:rows>/<int:items>", methods=["GET"])
    def generate_random_array(rows=0, items=0):
        return jsonify([[randint(0, 200) for j in range(items)] for i in range(rows)])

    return app

