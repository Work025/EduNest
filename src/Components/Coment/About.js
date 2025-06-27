import React, { useState, useEffect } from "react";
import "./About.css";
import aboutData from "./About.json"; // <-- JSON'dan o'qiladi

function About() {
    const user = JSON.parse(sessionStorage.getItem("user")) || {};
    const username = user?.name || "Mehmon";

    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("language") || "uz";
    });

    const [selectedInfo, setSelectedInfo] = useState("all");

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const t = aboutData[language];

    const renderContent = () => {
        switch (selectedInfo) {
            case "all":
                return (
                    <>
                        <h2>{t.about}</h2>
                        <p>{t.text}</p>
                    </>
                );
            case "book1":
                return <p><strong>{t.book1}:</strong> {t.kitob1}</p>;
            case "book2":
                return <p><strong>{t.book2}:</strong> {t.kitob2}</p>;
            case "book3":
                return <p><strong>{t.book3}:</strong> {t.kitob3}</p>;
            case "book4":
                return <p><strong>{t.book4}:</strong> {t.kitob4}</p>;
            default:
                return null;
        }
    };

    return (
        <div className="web-photo">
            <div className="web-tube">
                <div className="tube-name">
                    <div className="tube-name-h1">
                        <h1>{t.title}</h1>
                    </div>
                    <div className="tube-name-subiscrabe">
                        <span>{t.languages}</span>
                        <button className="lang-btn" onClick={() => setLanguage("uz")}>O‘z</button>
                        <button className="lang-btn" onClick={() => setLanguage("ru")}>Рус</button>
                        <button className="lang-btn" onClick={() => setLanguage("en")}>Eng</button>
                    </div>
                </div>

                <div className="about-buttons">
                    <button onClick={() => setSelectedInfo("all")}>{t.all}</button>
                    <button onClick={() => setSelectedInfo("book1")}>{t.book1}</button>
                    <button onClick={() => setSelectedInfo("book2")}>{t.book2}</button>
                    <button onClick={() => setSelectedInfo("book3")}>{t.book3}</button>
                    <button onClick={() => setSelectedInfo("book4")}>{t.book4}</button>
                </div>

                <div className="about-info">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default About;
