import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./Header.css";

function Header({ onLogout, currentUser }) {  // <-- currentUser ni propsdan olamiz

  const location = useLocation();
  const navigate = useNavigate();
  const [isFixed, setIsFixed] = useState(false);

  const passwords = {
    book1: "edu/1",
    book2: "edu/2",
    book3: "edu/3",
    book4: "edu/4",
    admin: "330711770"
  };

  console.log("Header currentUser:", currentUser);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsFixed(scrollTop > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`header ${isFixed ? "fixed" : ""}`}>
      <div className='header-text'>
        <h1>Edu <span>/</span> Nest</h1>
      </div>
      <ul className='header-ul'>
        <li className={isActive("/") ? "active-link" : ""}>
          <Link to="/"><i className="fa-solid fa-house"></i> Home</Link>
        </li>
        <li className={isActive("/game") ? "active-link" : ""}>
          <Link to="/game"><i className="fa-solid fa-users"></i> Group</Link>
        </li>
        <li className={isActive("/book1") ? "active-link" : ""}>
          <Link to="/book1" onClick={(e) => handleLinkClick(e, "book1", "/book1")}><i class='fa-solid fa-book'></i>  Book-1</Link>
        </li>
        <li className={isActive("/book2") ? "active-link" : ""}>
          <Link to="/book2" onClick={(e) => handleLinkClick(e, "book2", "/book2")}><i class='fa-solid fa-book'></i>  Book-2</Link>
        </li>
        <li className={isActive("/book3") ? "active-link" : ""}>
          <Link to="/book3" onClick={(e) => handleLinkClick(e, "book3", "/book3")}><i class='fa-solid fa-book'></i>  Book-3</Link>
        </li>
        <li className={isActive("/book4") ? "active-link" : ""}>
          <Link to="/book4" onClick={(e) => handleLinkClick(e, "book4", "/book4")}><i class='fa-solid fa-book'></i>  Book-4</Link>
        </li>
        {String(currentUser?.id) === "0" && (
          <li className={isActive("/admin") ? "active-link" : ""}>
            <Link to="/admin"><i className="fa-solid fa-user-shield"></i> Admin</Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Header;
