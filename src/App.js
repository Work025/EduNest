import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Book1 from './Components/Book1/Book1';
import Book2 from './Components/Book2/Book2';
import Book3 from './Components/Book3/Book3';
import Ielts from "./Components/Ielts/Test";
import About from "./Components/Coment/About";
import Footer from "./Components/Footer/Footer";
import Game from "./Components/Game/Game";
import users from './Components/Edu.json';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [passwordShown, setPasswordShown] = useState(false); // ⬅️ Yangi state
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("loggedIn") === "true");
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (loggedIn && currentUser) {
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [loggedIn, currentUser]);

  const handleLogin = () => {
    const foundUser = users.find(user => user.password === code);
    if (foundUser) {
      setLoggedIn(true);
      setCurrentUser(foundUser);
    } else {
      alert("Please try again!");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentUser(null);
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("user");
  };

  return (
    <Router>
      {!loggedIn ? (
        <div className="login">
          <div className='login-box'>
            <h1>Welcome to Edu <span>/</span> Nest</h1>
            <div className='login-box-input'>
              <input
                type={passwordShown ? 'text' : 'password'} // 👈 Toggle type
                maxLength={10}
                placeholder="Please enter password..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <i
                className={`fa-solid ${passwordShown ? 'fa-eye' : 'fa-eye-slash'}`}
                onClick={() => setPasswordShown(!passwordShown)} // 👈 Toggle action
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              ></i>
            </div>
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      ) : (
        <>
          <Header onLogout={handleLogout} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home user={currentUser} />} />
              <Route path="/game" element={<Game />} />
              <Route path="/book1" element={<Book1 />} />
              <Route path="/book2" element={<Book2 />} />
              <Route path="/book3" element={<Book3 />} />
              <Route path="/ielts" element={<Ielts />} />
            </Routes>
          </div>
          <About />
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
