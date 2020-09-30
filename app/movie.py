from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for, session, send_from_directory, jsonify
)
from werkzeug.exceptions import abort
from app.auth import login_required
from app.db import get_db
from jose import jwt
from bson.objectid import ObjectId
import requests
import os

bp = Blueprint('movie', __name__)
IMDB_KEY = os.environ.get('IMDB_KEY')
SECRET = os.environ.get('SECRET_KEY') or 'dev'
ALGO = os.environ.get('ALGO')


@bp.route('/movies')
@login_required
def get_movies():
    # print("in get movies")
    token = session.get('jwt')
    if token is None:
        return abort(401)
    user_id = jwt.decode(token, SECRET, algorithms=[ALGO])['id']
    mongo = get_db()
    all_movies = mongo.db.movies.find({"user_id": ObjectId(user_id)})
    movies = [{"name": movie["name"],
               "location": movie["location"],
               "bluray": movie["bluray"],
               "dvd": movie["dvd"],
               "_id": str(movie["_id"])} for movie in all_movies]
    return jsonify(movies)


@bp.route('/locations')
@login_required
def get_locations():
    # print("in get locations")
    token = session.get('jwt')
    if token is None:
        return abort(401)
    user_id = jwt.decode(token, SECRET, algorithms=[ALGO])['id']
    mongo = get_db()
    locations_cur = mongo.db.locations.find({"user_id": ObjectId(user_id)})
    all_locations = [loc["name"] for loc in locations_cur]
    return jsonify(all_locations)


@bp.route('/addMovie', methods=['POST'])
@login_required
def create():
    token = session.get('jwt')
    if token is None:
        return abort(401)
    user_id = jwt.decode(token, SECRET, algorithms=[ALGO])['id']
    mongo = get_db()
    locations_cur = mongo.db.locations.find({"user_id": ObjectId(user_id)})
    all_locations = [loc["name"] for loc in locations_cur]

    body = request.json
    title = body['name']
    locations = body['locations']
    location = body['location']
    bluray = body['bluray']
    dvd = body['dvd']
    if locations != '"Location"':
        location = locations
    if not title:
        return {"error": "Title is required"}, 400
    elif not location:
        return {"error": "Some location is required"}, 400
    elif not bluray and not dvd:
        return {"error": "Movie must have at least one copy"}, 400
    mongo.db.movies.insert_one({"name": title, "location": location,
                                "bluray": bluray, "dvd": dvd, "user_id": ObjectId(user_id)})
    if location not in all_locations:
        mongo.db.locations.insert_one({"name": location, "user_id": ObjectId(user_id)})
    return {"name": title, "location": location,
                                "bluray": bluray, "dvd": dvd}


@bp.route('/imdb/<movie>')
@login_required
def imdb_movie(movie):
    r = requests.get('https://www.omdbapi.com/?t=' + movie + '&apikey=' + IMDB_KEY)
    return r.json()


@bp.route('/movies/<movie_id>', methods=['DELETE'])
@login_required
def delete_movie(movie_id):
    token = session.get('jwt')
    if token is None:
        return abort(401)
    user_id = jwt.decode(token, SECRET, algorithms=[ALGO])['id']
    mongo = get_db()
    movie = mongo.db.movies.delete_one({'_id': ObjectId(movie_id), 'user_id': ObjectId(user_id)})
    if movie.acknowledged and movie.deleted_count == 1:  # check movie.acknowledged first
        return {"movie_id": movie_id}
    return {"error": "Server error"}, 500
