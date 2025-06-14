import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./Header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const passwords = {
    book2: "edu/2",
    book3: "edu/b3",
    book4: "edu/b4",
    ielts: "test-work"
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = (e, bookKey, path) => {
    const access = localStorage.getItem(`${bookKey}_access`);
    if (access === "true") return;

    e.preventDefault();
    const input = prompt(`${bookKey} Plase enter password:`);
    if (input === passwords[bookKey]) {
      localStorage.setItem(`${bookKey}_access`, "true");
      navigate(path);
    } else {
      alert("Password incorrect!");
    }
  };

  return (
    <div className='header'>
      <div className='header-text'>
        <h1>Edu <span>/</span> Nest</h1> 
      </div>
      <ul className='header-ul'>
        <li className={isActive("/") ? "active-link" : ""}>
          <Link to="/"><i className="fa-solid fa-house"></i>  Home</Link>
        </li>
        <li className={isActive("/game") ? "active-link" : ""}>
          <Link to="/game"><i className="fa-solid fa-users"></i>  Group</Link>
        </li>
        <li className={isActive("/book1") ? "active-link" : ""}>
          <Link to="/book1" onClick={(e) => handleLinkClick(e, "book1", "/book1")}>Book-1</Link>
        </li>
        <li className={isActive("/book2") ? "active-link" : ""}>
          <Link to="/book2" onClick={(e) => handleLinkClick(e, "book2", "/book2")}>Book-2</Link>
        </li>
        <li className={isActive("/book3") ? "active-link" : ""}>
          <Link to="/book3" onClick={(e) => handleLinkClick(e, "book3", "/book3")}>Book-3</Link>
        </li>
        <li className={isActive("/book4") ? "active-link" : ""}>
          <Link to="/book4" onClick={(e) => handleLinkClick(e, "book4", "/book4")}>Book-4</Link>
        </li>
        <li className={isActive("/ielts") ? "active-link" : ""}>
          <Link to="/ielts" onClick={(e) => handleLinkClick(e, "ielts", "/ielts")}>IELTS</Link>
        </li>
      </ul>
    </div>
  );
}

export default Header;
