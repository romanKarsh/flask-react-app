import functools
import os
from flask import (
    Blueprint, g, redirect, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash
from app.db import get_db
from werkzeug.utils import secure_filename
from jose import jwt

SECRET = os.environ.get('SECRET_KEY') or 'dev'
ALGO = os.environ.get('ALGO')

bp = Blueprint('auth', __name__, url_prefix='/auth')


@bp.route("check-session")
def check_session():
    user_name = session.get('user')
    floor = session.get('floor')
    if user_name:
        return {"currentUser": user_name, "floor": floor}
    else:
        return {}  # no user on session cookie


@bp.route('/login', methods=['POST'])
def login():
    body = request.json
    username = body['name']
    password = body['password']
    if username is None or password is None:
        return {"error": "Request should have the user name and password"}, 400
    mongo = get_db()
    # check credentials
    user = mongo.db.users.find_one({"name": username})
    if user is None:
        return {"error": "Incorrect username"}, 400
    elif not check_password_hash(user['password'], password):
        return {"error": "Incorrect password"}, 400
    session.clear()
    session['user'] = user['name']
    session['floor'] = user['floor']
    session['jwt'] = jwt.encode({'id': str(user["_id"])}, SECRET, algorithm=ALGO)
    print({"currentUser": user['name'], "floor": user['floor']})
    return {"currentUser": user['name'], "floor": user['floor']}


@bp.route('/logout')
def logout():
    session.clear()
    return redirect("/")


@bp.route('/register', methods=['POST'])
def register():
    body = request.json
    username = body['name']
    password = body['password']
    if username is None or password is None:
        return {"error": "Request should have the user name and password"}, 400
    mongo = get_db()
    user = mongo.db.users.find_one({"name": username})
    if user is not None:
        return {"error": 'User {} is already registered'.format(username)}
    user = mongo.db.users.insert_one({"name": username,
                               "password": generate_password_hash(password),
                               "floor": False})
    if user.acknowledged:  # check user.acknowledged
        return {"registered": True}
    return {"error": "Server error"}, 500


@bp.before_app_request
def load_logged_in_user():
    user_name = session.get('user')
    if user_name is None:
        g.user = None
        g.floor = False
    else:
        user = get_db().db.users.find_one({"name": user_name})
        g.user = secure_filename(user["name"])
        g.floor = user["floor"]


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))
        return view(**kwargs)
    return wrapped_view
