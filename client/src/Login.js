import React from 'react';
import Header from './Header';
import { updateForm, login } from "./actions";
import BaseReactComponent from "./BaseReactComponent";

class Login extends BaseReactComponent {
  filterState({ loginForm }) {
    return { loginForm };
  }

  render() {
    const currentUser = this.props.user;
    const { loginForm } = this.state;
    return (
      <div>
        <Header user={currentUser} />
        <section className="content">
          <header>
            <h1>Login</h1>
          </header>
          <form onSubmit={e => login(e)}>
            <label>Username</label>
            <input name="name"
                  className="loginForm"
                  value={loginForm.name}
                  onChange={e => updateForm(e.target)}
                  required />
            <label>Password</label>
            <input type="password"
                  name="password"
                  className="loginForm"
                  value={loginForm.password}
                  onChange={e => updateForm(e.target)} 
                  required />
            <input type="submit" value="Login" />
          </form>
        </section>
      </div>
    );
  }
}

export default Login;