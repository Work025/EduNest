import React, { useState, useRef, useEffect } from "react";
import './Home.css';
import defaultImg from "./pro-img.webp";
import eduData from "../Edu.json";
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImg';
import axios from "axios";
import socket from '../../socket'; // to‘g‘ri yo‘lga qarab yozing



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

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleCropConfirm = async () => {
    const croppedImage = await getCroppedImg(preview, croppedAreaPixels);

    // ✅ Blob ni yaratamiz
    const response = await fetch(croppedImage);
    const blob = await response.blob();

    // 📦 formData ga joylaymiz
    const formData = new FormData();
    formData.append("avatar", blob, "avatar.jpg");

    try {
      // 🌐 Backendga yuboramiz
      const res = await axios.put(`https://edunest-k770.onrender.com/api/users/avatar/${user._id}`, {
        avatar: uploadedUrl,
      });

      const uploadedUrl = res.data.imageUrl;

      setImage(uploadedUrl); // Rasmni ko‘rsatamiz
      if (user?.id) {
        localStorage.setItem(`user_${user.id}_image`, uploadedUrl);
      }
      setShowModal(false);
    } catch (error) {
      console.error("❌ Yuklashda xatolik:", error);
    }
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

  useEffect(() => {
  const handleAvatarUpdate = ({ userId, avatarUrl }) => {
    if (user?.id === userId) {
      setImage(avatarUrl);
      setUserData((prev) => ({
        ...prev,
        avatar: avatarUrl
      }));
    }
  };

  socket.on("avatar_updated", handleAvatarUpdate);

  return () => {
    socket.off("avatar_updated", handleAvatarUpdate);
  };
}, [user]);


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
            <img src={userData?.avatar || defaultImg} alt="Profile" />
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
                {userData?.email && (
                  <>
                    <hr />
                    <h2>Email <span>/</span> {userData.email}</h2>
                  </>
                )}
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
          background: "rgba(0,0,0,0.7)", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{ position: "relative", width: 300, height: 300, background: "#ddd" }}>
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
          <div className="home-add-img" style={{ marginTop: 20, textAlign: "center" }}>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
            />
            <br />
            <button onClick={handleCropConfirm}>Confirmation <i class='fa-solid fa-check'></i></button>
            <button onClick={() => setShowModal(false)}>Cancellation <i class='fa-solid fa-xmark'></i></button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
