import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Book1 from './Components/Book1/Book1';
import Book2 from './Components/Book2/Book2';
import Book3 from './Components/Book3/Book3';
import Book4 from './Components/Book4/Book4';
import Admin from './Components/Admin/Admin';
import About from "./Components/Coment/About";
import Footer from "./Components/Footer/Footer";
import Game from "./Components/Group/Group";
import users from './Components/Edu.json';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("loggedIn") === "true");
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [lengthWarning, setLengthWarning] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  useEffect(() => {
    if (loggedIn && currentUser) {
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [loggedIn, currentUser]);

  const handleLogin = () => {
    if (code.length < 6 || code.length > 10) {
      setLengthWarning("The password must be no less than 6 or more than 10 characters long.");
      setLoginStatus('');
      return;
    } else {
      setLengthWarning('');
    }

    const foundUser = users.find(user => user.password === code);
    if (foundUser) {
      setLoggedIn(true);
      setCurrentUser(foundUser);
      setLoginStatus("Login successful");
    } else {
      setLoginStatus("Password no found");
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
                type={passwordShown ? 'text' : 'password'}
                maxLength={10}
                placeholder="Please enter password..."
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setLoginStatus('');
                }}
              />
              <i
                className={`fa-solid ${passwordShown ? 'fa-eye' : 'fa-eye-slash'}`}
                onClick={() => setPasswordShown(!passwordShown)}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              ></i>
            </div>

            {/* Uzunlik tekshiruv xabari */}
            <p style={{ color: 'orange', fontSize: '14px' }}>
              {lengthWarning && (
                <>
                  <i className="fa-solid fa-circle-info" style={{ marginRight: '5px' }}></i>
                  {lengthWarning}
                </>
              )}
            </p>

            {/* Parol to‘g‘ri/noto‘g‘riligini ko‘rsatish */}
            <span style={{ color: loginStatus.includes("noto") ? 'red' : 'green', fontSize: '14px' }}>
              {loginStatus && (
                <>
                  <i
                    className={`fa-solid ${loginStatus.includes("noto") ? 'fa-xmark' : 'fa-check'
                      }`}
                    style={{ marginRight: '5px' }}
                  ></i>
                  {loginStatus}
                </>
              )}
            </span>

            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      ) : (
        <>
          <Header onLogout={handleLogout} currentUser={currentUser} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home user={currentUser} />} />
              <Route path="/game" element={<Game />} />
              <Route path="/book1" element={<Book1 user={currentUser} />} />
              <Route path="/book2" element={<Book2 user={currentUser} />} />
              <Route path="/book3" element={<Book3 user={currentUser} />} />
              <Route path="/book4" element={<Book4 user={currentUser} />} />
              <Route
                path="/admin"
                element={
                  loggedIn && currentUser?.id === "0" ? <Admin /> : <h1>Access Denied 🚫</h1>
                }
              />
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
