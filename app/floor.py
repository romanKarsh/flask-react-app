from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, session, send_from_directory, jsonify
)
import os
import boto3
from werkzeug.exceptions import abort
from werkzeug.utils import secure_filename
from bson.objectid import ObjectId
from app.auth import login_required
from app.db import get_db
from jose import jwt

bp = Blueprint('floor', __name__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
BUCKET = "flaskmovie"
SECRET = os.environ.get('SECRET_KEY') or 'dev'
ALGO = os.environ.get('ALGO')

@bp.route('/uploads/<username>/floor_plan.jpg')
@login_required
def uploaded_file(username):
    print("in get uploaded_file")
    if g.user != username:
        return abort(401)
    elif not g.floor:
        return {}
    return send_from_directory("..", download_file_helper(secure_filename(g.user) + "_floor_plan.jpg"))


@bp.route('/floor', methods=['POST'])
@login_required
def upload_file():
    print("post floor")
    token = session.get('jwt')
    if token is None:
        return abort(401)
    user_id = jwt.decode(token, SECRET, algorithms=[ALGO])['id']
    mongo = get_db()
    # check if the post request has the file part
    if 'file' not in request.files:
        return {"error": "No file part"}
    file = request.files['file']
    if file and allowed_file(file.filename):
        file.save(secure_filename(g.user) + "_floor_plan.jpg")
        upload_file_helper(secure_filename(g.user) + "_floor_plan.jpg")
        mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"floor": True}})
        session['floor'] = True
        return {"floor": True}
    else:
        return {"error": "Bad file"}


""" ## Helpers ## """


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_file_helper(file_name):
    s3_client = boto3.client('s3')
    response = s3_client.upload_file(file_name, BUCKET, file_name)
    return response


def download_file_helper(file_name):
    s3 = boto3.resource('s3')
    s3.Bucket(BUCKET).download_file(file_name, file_name)
    return file_name
