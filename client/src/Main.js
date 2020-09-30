import React from 'react';
import Header from './Header';
import { Link } from "react-router-dom";
import Movie from './Movie';
import { getMovies } from "./actions";
import BaseReactComponent from "./BaseReactComponent";

class Main extends BaseReactComponent {
  filterState({ movieList }) {
    return { movieList };
  }
  constructor(props) {
    super(props);
    getMovies();
  }
  render() {
    const { movieList } = this.state;
    const currentUser = this.props.user;
    return (
      <div>
        <Header user={currentUser} />
        <section className="content">
          <header>
            <h1>Movies</h1>
            <Link to="/add-movie" className="action"> Add New Movie </Link>
          </header>
          <ul className="movieList">
            {movieList.map((movie) => {
              return (<Movie key={movie._id} movie={movie} />);
            })}
          </ul>
        </section>
      </div>
    );
  }
}

export default Main;