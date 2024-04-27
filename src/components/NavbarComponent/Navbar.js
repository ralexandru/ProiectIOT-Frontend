import React from "react";
import "./Navbar.css";

function Navbar() {
  const homeText = "Home"
  return (
    <nav id="navbar">
      <div className="wrapper">
        <div className="logo">
          <a href="#">Logo</a>
        </div>
        <input type="radio" name="slider" id="menu-btn" />
        <input type="radio" name="slider" id="close-btn" />
        <ul className="nav-links">
          <label htmlFor="close-btn" className="btn close-btn">
            <i className="fas fa-times"></i>
          </label>
          <li>
            <a href="#">{homeText}</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
            <input type="checkbox" id="showMega" />
            <li>
            <a href="#">Feedback</a>
          </li>
        </ul>
        <label htmlFor="menu-btn" className="btn menu-btn">
          <i className="fas fa-bars"></i>
        </label>
      </div>
    </nav>
  );
}

export default Navbar;
