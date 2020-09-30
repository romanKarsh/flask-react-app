import os
from flask import Flask, send_from_directory, session
from . import db
from . import auth
from . import movie

MONGO = os.environ.get('MONGO_URI') or "mongodb://localhost:27017/FlaskAPI"
SECRET = os.environ.get('SECRET_KEY') or 'dev'


def create_app():
    # create and configure the app
    app = Flask(__name__, static_folder='../client/build')
    app.config.from_mapping(
        SECRET_KEY=SECRET,
        MONGO_URI=MONGO,
    )
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    app.register_blueprint(auth.bp)
    app.register_blueprint(movie.bp)

    # Serve React App
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        print("in serve")
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app
