// src/Components/GoogleLoginButton.jsx
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleLoginButton = ({ setLoggedIn, setCurrentUser }) => {
  const handleLogin = (response) => {
    try {
      const { credential } = response;
      const decoded = jwtDecode(credential); // foydalanuvchini yechib olish

      // ADMIN EMAIL 👇
      const adminEmail = "admin@example.com"; // ← bu yerga o‘z Gmail'ingizni yozing

      const user = {
        id: decoded.email === adminEmail ? "0" : "google", // Admin bo‘lsa id: 0
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };

      // Holatlarni yangilash
      setCurrentUser(user);
      setLoggedIn(true);

      // Mahalliy xotiraga saqlash
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('loggedIn', 'true');

      console.log("✅ Google login successful:", user);
    } catch (err) {
      console.error("❌ Google login decoding error:", err);
    }
  };

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <GoogleOAuthProvider clientId="918649179913-qepeat01m68tkth5b138jqvff7d7jnop.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => console.log('❌ Google login failed')}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginButton;
