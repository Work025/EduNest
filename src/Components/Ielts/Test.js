import React, { useState, useEffect } from "react";
import "./Test.css";
import Verbdata from "./Test.json";
import IeltsTestData from "./Ielts-test.json";

function Test() {
    const [selectedVerb, setSelectedVerb] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState({ true: 0, false: 0 });
    const [selectedOption, setSelectedOption] = useState("");
    const [userScores, setUserScores] = useState({});
    const [restartAttempts, setRestartAttempts] = useState({});

    useEffect(() => {
        const saved = localStorage.getItem("ieltsScores");
        if (saved) {
            setUserScores(JSON.parse(saved));
        }
    }, []);

    const currentQuestion =
        selectedVerb !== null ? IeltsTestData[selectedVerb]?.questions?.[questionIndex] : null;

    const handleOptionClick = (opt) => {
        setSelectedOption(opt);
    };

    const checkAnswer = () => {
        const isCorrect = selectedOption === currentQuestion.answer;

        setScore((prev) => ({
            true: isCorrect ? prev.true + 1 : prev.true,
            false: !isCorrect ? prev.false + 1 : prev.false,
        }));

        if (questionIndex < IeltsTestData[selectedVerb].questions.length - 1) {
            setQuestionIndex((prev) => prev + 1);
            setSelectedOption("");
        } else {
            const total = IeltsTestData[selectedVerb].questions.length;
            const finalScore = { score: score.true + (isCorrect ? 1 : 0), total };

            const updated = { ...userScores, [selectedVerb]: finalScore };
            setUserScores(updated);
            localStorage.setItem("ieltsScores", JSON.stringify(updated));
            setShowResult(true);
        }
    };

    const handleRestart = (index) => {
        const attempts = restartAttempts[index] || 0;
        const password = prompt(`Parolni kiriting (${attempts === 0 ? "1-urinish" : "2-urinish"}):`);
        const correctPassword = attempts === 0 ? "0420" : "2040";

        if (password === correctPassword) {
            const updated = { ...userScores };
            delete updated[index];
            localStorage.setItem("ieltsScores", JSON.stringify(updated));
            setUserScores(updated);
            setRestartAttempts((prev) => ({ ...prev, [index]: 0 }));

            if (selectedVerb === index) {
                setSelectedVerb(null);
                setQuestionIndex(0);
                setShowResult(false);
                setScore({ true: 0, false: 0 });
                setSelectedOption("");
            }
        } else if (password !== null) {
            alert("Parol noto‘g‘ri.");
            setRestartAttempts((prev) => ({ ...prev, [index]: attempts + 1 }));
        }
    };

    const closeTest = () => {
        handleRestart(selectedVerb);
    };

    return (
        <div className="ielts">
            <div className="any">
                <div className="any-name">
                    <h1>LTS <span>/</span> Test</h1>
                </div>
                <div className="any-verb">
                    {Verbdata.map((verb, index) => {
                        const saved = userScores[index];
                        const completed = saved && saved.total;

                        return (
                            <div
                                className="verb-name"
                                key={index}
                                style={{ opacity: completed ? 0.3 : 1 }}
                            >
                                <h3>{verb.title}</h3>
                                <div className="verb-score">
                                    <p>{saved ? saved.score : 0}</p>
                                    <span>/</span>
                                    <q>{saved ? saved.total : ""}</q>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!completed) {
                                            setSelectedVerb(index);
                                            setQuestionIndex(0);
                                            setShowResult(false);
                                            setScore({ true: 0, false: 0 });
                                            setSelectedOption("");
                                        } else {
                                            alert("Finshed test. Plase tap get \"Restart\" ");
                                        }
                                    }}
                                >
                                    Test Get
                                </button>

                                {completed && (
                                    <button
                                        className="restart-btn-inline"
                                        onClick={() => handleRestart(index)}
                                        style={{ opacity: 1 }}
                                    >
                                        Restart
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedVerb !== null && (
                <div className="any-test">
                    <div className="any-test-name">
                        <h1>Test <span>/</span> Get</h1>
                    </div>
                    {!showResult ? (
                        <div>
                            <h2>{Verbdata[selectedVerb].title}</h2>
                            {currentQuestion && (
                                <div>
                                    <h3>{currentQuestion.question}</h3>
                                    <div className="options">
                                        {Object.entries(currentQuestion.options).map(([key, val]) => (
                                            <button
                                                key={key}
                                                className={selectedOption === key ? "selected" : ""}
                                                onClick={() => handleOptionClick(key)}
                                            >
                                                {key}. {val}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={checkAnswer}>Tekshirish</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="result">
                            <div>
                                <p>true :</p>
                                <i>{score.true}</i>
                            </div>
                            <span>/</span>
                            <div>
                                <p>wrong</p>
                                <i>{score.false}</i>
                            </div>
                            <button className="restart-btn" onClick={closeTest}>
                                Restart Test
                            </button>
                        </div>
                    )}
                    <i className="fa-solid fa-xmark close-test" onClick={closeTest}></i>
                </div>
            )}
        </div>
    );
}

export default Test;
