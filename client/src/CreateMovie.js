import React from 'react';
import Header from './Header';
import { getLocations, updateForm, updateCheckBox, addMovie } from "./actions";
import BaseReactComponent from "./BaseReactComponent";

class CreateMovie extends BaseReactComponent {
  filterState({ locationList, addMovieForm }) {
    return { locationList, addMovieForm };
  }
  constructor(props) {
    super(props);
    getLocations();
  }
  render() {
    const currentUser = this.props.user;
    const { locationList, addMovieForm } = this.state;
    return (
      <div>
        <Header user={currentUser} />
        <section className="content">
          <header>
            <h1>New Movie</h1>
          </header>
          <form onSubmit={e => addMovie(e)}>
            <label>Title</label>
            <input className="addMovieForm" name="name" type="text"
                  value={addMovieForm.name} onChange={e => updateForm(e.target)} required />
            <label>Location (select existing or enter new)</label>
            <select className="addMovieForm" name="locations" value={addMovieForm.locations} onChange={e => updateForm(e.target)}>
              <option value='"Location"'>"Location"</option>
              { locationList.map((location) => <option value={location}>{location}</option> ) }
            </select>
            <input className="addMovieForm" name="location" type="text"
                  value={addMovieForm.location} onChange={e => updateForm(e.target)} id="loc"/>
            <label> Bluray Copy <input type="checkbox" checked={addMovieForm.bluray} className="addMovieForm"
                  onChange={e => updateCheckBox(e.target)} name="bluray" /> </label>
            <label> DVD Copy <input type="checkbox" checked={addMovieForm.dvd} className="addMovieForm"
                  onChange={e => updateCheckBox(e.target)} name="dvd" /> </label>
            <input className="movieBtn" type="submit" value="Save" />
          </form>
        </section>
      </div>
    );
  }
}

export default CreateMovie;