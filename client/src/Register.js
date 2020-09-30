import React from 'react';
import Header from './Header';
import { updateForm, register } from "./actions";
import BaseReactComponent from "./BaseReactComponent";

class Register extends BaseReactComponent {
  filterState({ registerForm }) {
    return { registerForm };
  }

  render() {
    const currentUser = this.props.user;
    const { registerForm } = this.state;
    return (
      <div>
        <Header user={currentUser} />
        <section className="content">
          <header>
            <h1>Register</h1>
          </header>
          {/*<div class="flash"> Error </div> */}
          <form onSubmit={e => register(e)}>
            <label>Username</label>
            <input name="name"
                  className="registerForm"
                  value={registerForm.name}
                  onChange={e => updateForm(e.target)}
                  required />
            <label>Password</label>
            <input type="password"
                  name="password"
                  className="registerForm"
                  value={registerForm.password}
                  onChange={e => updateForm(e.target)} 
                  required />
            <input type="submit" value="Register" className="movieBtn" />
          </form>
        </section>
      </div>
    );
  }
}

export default Register;