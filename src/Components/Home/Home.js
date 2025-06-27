import React, { useState, useRef, useEffect } from "react";
import './Home.css';
import defaultImg from "./pro-img.webp";
import eduData from "../Edu.json";
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImg';

const Home = ({ user }) => {
  const [image, setImage] = useState(defaultImg);
  const [userData, setUserData] = useState(null);
  const [edu, setEduData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [language, setLanguage] = useState("uz");

  const infoTexts = {
    uz: {
      p: `Edu/Nest — bu o‘quvchilar uchun mo‘ljallangan onlayn ta’lim platformasi. Bu yerda siz ingliz tilini testlar orqali o‘rganishingiz, bilimlaringizni sinab ko‘rishingiz va yutuqlaringizni kuzatib borishingiz mumkin.`,
      mark: `Test / Dars / O‘quvchilar / Natijalar / Til ko‘nikmalari`,
      h1: `Edu/Nest haqida`
    },
    ru: {
      p: `Edu/Nest — это онлайн-платформа, предназначенная для учеников. Здесь вы можете изучать английский язык с помощью тестов, проверять свои знания и отслеживать свои достижения.`,
      mark: `Тест / Урок / Ученики / Результаты / Языковые навыки`,
      h1: `О платформе Edu/Nest`
    },
    en: {
      p: `Edu/Nest is an online educational platform designed for students. Here you can learn English through tests, assess your knowledge, and track your achievements.`,
      mark: `Test / Lesson / Students / Results / Language Skills`,
      h1: `About Edu/Nest`
    }
  };



  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
    setImage(croppedImage);
    if (user?.id) {
      localStorage.setItem(`user_${user.id}_image`, croppedImage);
    }
    setShowModal(false);
  };

  useEffect(() => {
    setEduData(eduData);
    setUserData(user);  // 🔁 login bo'lgan user
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      const storedImage = localStorage.getItem(`user_${user.id}_image`);
      if (storedImage) setImage(storedImage);
    }
  }, [user]);

  useEffect(() => {
    const storedImage = localStorage.getItem("userImage");
    if (storedImage) setImage(storedImage);
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (e) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / 15);
    const rotateY = x / 15;
    element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div className="home">
      <div className="profil">
        <div className="pro-name">
          <h3><i className="fa-solid fa-house"></i> Home</h3>
        </div>
        <div className="pro-about">
          <div
            className="pro-about-img tilt"
            onClick={handleImageClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img src={image} alt="Profile" />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
          <div className="pro-about-text">
            {!loading && userData ? (
              <>
                <h2>Fullname <span>/</span> {userData.sorename} {userData.name}</h2><hr />
                <h2>Teacher name <span>/</span> {userData.teacher}</h2><hr />
                <h2>Class number <span>/</span> {userData.class}</h2><hr />
                <h2>Time <span>/</span> {userData.time}</h2><hr />
                <h2>Group <span>/</span> {userData.group}</h2>
              </>
            ) : (
              <h2>Loading...</h2>
            )}
          </div>
        </div>
      </div>
      {!loading && edu.length > 0 && (
        <div className="edu-section">
          {edu.map((item, idx) => (
            <div key={idx}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{ position: "relative", width: 300, height: 300 }}>
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
            />
            <br />
            <button onClick={handleCropConfirm} style={{ marginRight: 10 }}>Tasdiqlash</button>
            <button onClick={() => setShowModal(false)}>Bekor qilish</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
