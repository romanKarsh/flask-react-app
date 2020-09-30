import React from 'react';
import { imdbSearch, softDelete } from "./actions";

class Movie extends React.Component {
  render() {
    const { movie } = this.props;
    return (
      <li className="movieList">
        <article className="post">
          {movie.imdbInfo && <div className="imdb">
            Year: {movie.Year} <br />
            Runtime: {movie.Runtime} <br />
            IMDb Raiting: {movie.imdbRating} <br />
            Genre: {movie.Genre} <br />
            Director: {movie.Director} <br />
            Actors: {movie.Actors}
          </div>}
          <header>
            <div>
              <h1> {movie.name} </h1>
              <div className="about"> at {movie.location} </div>
            </div>
          </header>
          <p className="body">
            {movie.bluray && "Bluray Copy"}
            {movie.bluray && movie.dvd && <br />}
            {movie.dvd && "DVD Copy"}
          </p>
          <button className="movieBtn" onClick={(e) => softDelete(movie._id)}> Delete </button>
          <button className="movieBtn" onClick={(e) => imdbSearch(movie._id, movie.name)}> IMDB </button>
          <hr />
        </article>
      </li>
    );
  }
}

export default Movie;