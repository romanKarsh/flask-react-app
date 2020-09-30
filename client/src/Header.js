import React from 'react';
import { Link } from "react-router-dom";
import { logout } from "./actions";

class Header extends React.Component {
  render() {
    const currentUser = this.props.user;
    return (
      <nav>
        <h1>Flask Movie API</h1>
        {currentUser ?
          <ul>
            <li><span>{currentUser}</span> </li>
            <li><Link to="/"> Home </Link> </li>
            <li><Link to="/floor"> Floor Plan </Link> </li>
            <li><button className="logout" onClick={logout}> Log Out </button> </li>
          </ul>
          :
          <ul>
            <li><Link to="/register"> Register </Link> </li>
            <li><Link to="/login"> Log In </Link> </li>
          </ul>
        }
      </nav>
    );
  }
}

export default Header;
