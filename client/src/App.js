import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import './style.css';
import CreateMovie from './CreateMovie';
import Register from './Register';
import Floor from './Floor';
import Login from './Login';
import Main from './Main';
import BaseReactComponent from "./BaseReactComponent";
import { readCookie } from "./actions";

class App extends BaseReactComponent {
  filterState({ currentUser, cookie, floor }) {
    return { currentUser, cookie, floor };
  }

  constructor(props) {
    super(props);
    readCookie();
    // this.state = { user: "R", cookie: false }
  }

  render() {
    const { currentUser, cookie, floor } = this.state;
    if (cookie === false) {
      return (<section className="content"> <header> <h1> Loading </h1> </header> </section>);
    }
    return (
      <BrowserRouter>
        <Switch> {/* Similar to a switch statement - shows the component depending on the URL path */}
          <Route exact path={"/floor"} render={({ history }) => (currentUser ? <Floor history={history} user={currentUser} floor={floor} /> : <Redirect to='/' />)} />
          <Route exact path={"/add-movie"} render={({ history }) => (currentUser ? <CreateMovie history={history} user={currentUser} /> : <Redirect to='/' />)} />
          <Route exact path={"/register"} render={({ history }) => (!currentUser ? <Register history={history} /> : <Redirect to='/' />)} />
          <Route exact path={"/login"} render={({ history }) => (!currentUser ? <Login history={history} /> : <Redirect to='/' />)} />
          <Route exact path={"/"} render={({ history }) => (currentUser ? <Main history={history} user={currentUser} /> : <Redirect to='/login' />)} />
          <Route render={() => <section className="content"> <header> <h1> 404 Not found </h1> </header> </section>} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
