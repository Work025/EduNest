import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./Header.css";

function Header({ onLogout, currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFixed, setIsFixed] = useState(false);

  const passwords = {
    book1: "edu/0215",
    book2: "edu/0420",
    book3: "edu/054",
    book4: "edu/0620",
    admin: "330711770"
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = (e, bookKey, path) => {
    const access = localStorage.getItem(`${bookKey}_access`);
    if (access === "true") return;

    e.preventDefault();
    const input = prompt(`${bookKey} Please enter password:`);
    if (input === passwords[bookKey]) {
      localStorage.setItem(`${bookKey}_access`, "true");
      navigate(path);
    } else {
      alert("Password incorrect!");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`header ${isFixed ? "fixed" : ""}`}>
      <div className="header-text">
        <h1>Edu <span>/</span> Nest</h1>
        <div className="header-user-info">
          {currentUser?.email && (
            <div className="user-email">
              {currentUser?.picture && (
                <img src={currentUser.picture} alt="user" className="user-avatar" />
              )}
              <span>{currentUser.email}</span>
            </div>
          )}
          <button className="logout-btn" onClick={onLogout}>Log-out</button>
        </div>
      </div>

      <ul className="header-ul">
        <li className={isActive("/") ? "active-link" : ""}>
          <Link to="/"><i className="fa-solid fa-house"></i> Home</Link>
        </li>
        <li className={isActive("/game") ? "active-link" : ""}>
          <Link to="/game"><i className="fa-solid fa-users"></i> Group</Link>
        </li>
        <li className={isActive("/book1") ? "active-link" : ""}>
          <Link to="/book1" onClick={(e) => handleLinkClick(e, "book1", "/book1")}>
            <i className="fa-solid fa-book"></i> Book-1
          </Link>
        </li>
        <li className={isActive("/book2") ? "active-link" : ""}>
          <Link to="/book2" onClick={(e) => handleLinkClick(e, "book2", "/book2")}>
            <i className="fa-solid fa-book"></i> Book-2
          </Link>
        </li>
        <li className={isActive("/book3") ? "active-link" : ""}>
          <Link to="/book3" onClick={(e) => handleLinkClick(e, "book3", "/book3")}>
            <i className="fa-solid fa-book"></i> Book-3
          </Link>
        </li>
        <li className={isActive("/book4") ? "active-link" : ""}>
          <Link to="/book4" onClick={(e) => handleLinkClick(e, "book4", "/book4")}>
            <i className="fa-solid fa-book"></i> Book-4
          </Link>
        </li>
        {String(currentUser?.id) === "0" && (
          <li className={isActive("/admin") ? "active-link" : ""}>
            <Link to="/admin"><i className="fa-solid fa-user-shield"></i> Admin</Link>
          </li>
        )}
      </ul>

      {/* Google orqali kirgan foydalanuvchining emaili va rasmi */}

    </div>
  );
}

export default Header;
