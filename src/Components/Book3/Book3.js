import React, { useState, useEffect } from 'react';
import './Book3.css';
import bookData from './Book3.json';
import testData from './Book3-test.json';

const Book3 = ({ user }) => {
    const [activeLetter, setActiveLetter] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [sortOrder, setSortOrder] = useState("A-W");
    const [statusFilter, setStatusFilter] = useState("All");

    const getStorageKey = (title) => `${title}_book3_result_${user.id}`;

    useEffect(() => {
        if (activeLetter) {
            const saved = localStorage.getItem(getStorageKey(activeLetter));
            if (saved) {
                const parsed = JSON.parse(saved);
                setScore(parsed.score || 0);
            }
        }
    }, [activeLetter]);

    const handleClick = (title) => {
        const result = localStorage.getItem(getStorageKey(title));
        if (result) {
            alert("Bu test allaqachon tugatilgan.");
            return;
        }
        setActiveLetter(title);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowAnswer(false);
        setScore(0);
    };

    const questions = testData[activeLetter] || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (option) => {
        if (selectedOption === null) {
            setSelectedOption(option);
            if (option === currentQuestion.correctAnswer) {
                setScore((prev) => prev + 1);
            }
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setShowAnswer(false);
        } else {
            const result = { score, total: questions.length };
            localStorage.setItem(getStorageKey(activeLetter), JSON.stringify(result));
            setActiveLetter("done");
        }
    };

    const filteredData = [...bookData]
        .filter(item => {
            const result = localStorage.getItem(getStorageKey(item.title));
            if (statusFilter === "Past") return result !== null;
            if (statusFilter === "To-do") return result === null;
            return true; // All
        })
        .sort((a, b) => {
            return sortOrder === "A-W"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });

    return (
        <div className="book1">
            <div className="filter-menu">
                <div className='filter-menu-h1'><h1>Book-3</h1></div>
                <div className="filter-buttons">
                    <button
                        onClick={() => setSortOrder("A-W")}
                        className={sortOrder === "A-W" ? "active" : ""}
                    >
                        A–W
                    </button>
                    <button
                        onClick={() => setSortOrder("W-A")}
                        className={sortOrder === "W-A" ? "active" : ""}
                    >
                        W–A
                    </button>
                    <button
                        onClick={() => setStatusFilter("To-do")}
                        className={statusFilter === "To-do" ? "active" : ""}
                    >
                        To-do
                    </button>
                    <button
                        onClick={() => setStatusFilter("Past")}
                        className={statusFilter === "Past" ? "active" : ""}
                    >
                        Past
                    </button>
                </div>
            </div>

            <div className="book1-lsn">
                {filteredData.map((item, idx) => {
                    const result = localStorage.getItem(getStorageKey(item.title));
                    const isCompleted = result !== null;
                    const scoreData = isCompleted ? JSON.parse(result) : null;

                    return (
                        <div
                            key={idx}
                            className="lsn1"
                            style={{
                                backgroundColor: isCompleted ? "#0084f0" : "",
                                color: isCompleted ? "#fff" : "",
                                borderRadius: "8px",
                                padding: "10px",
                                position: "relative",
                                cursor: isCompleted ? "default" : "pointer",
                                border: "1px solid #0084f0"
                            }}
                            onClick={() => handleClick(item.title)}
                        >
                            <h3>
                                <i className={item.icoin}></i> <i className="fa-solid fa-book"></i>
                            </h3>
                            {isCompleted && (
                                <span style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    backgroundColor: "#fff",
                                    borderRadius: "20px",
                                    padding: "4px 10px",
                                    fontSize: "12px",
                                    color: "#333",
                                }}>
                                    <i className='fa-solid fa-cloud' style={{ color: "#0084f0" }}></i> {scoreData.score} / {scoreData.total}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className='book1-tests'>
                {activeLetter !== "done" && currentQuestion && (
                    <div className="lesson-content">
                        <button className="close-button" onClick={() => setActiveLetter(null)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <h4>{currentQuestion.question}</h4>
                        {currentQuestion.russian && (
                            <p style={{ fontStyle: 'italic' }}>{currentQuestion.russian}</p>
                        )}
                        <ul>
                            {currentQuestion.options.map((opt, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => handleOptionClick(opt)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedOption === opt
                                                ? opt === currentQuestion.correctAnswer
                                                    ? "#c8f7c5"
                                                    : "#f7c5c5"
                                                : ""
                                    }}
                                >
                                    {String.fromCharCode(65 + idx)}) {opt}
                                </li>
                            ))}
                        </ul>
                        {selectedOption && (
                            <>
                                {showAnswer && (
                                    <p className="correct-answer">
                                        Answer: {currentQuestion.correctAnswer} <i className='fa-solid fa-check'></i>
                                    </p>
                                )}
                                <div>
                                    <button onClick={() => setShowAnswer(true)}>Answer</button>
                                    <button onClick={nextQuestion} style={{ marginLeft: '10px' }}>
                                        <i className='fa-solid fa-angle-right'></i>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeLetter === "done" && (
                    <div className="lesson-content">
                        <button className="close-button" onClick={() => setActiveLetter(null)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <h3>
                            <i className='fa-solid fa-check' style={{ color: "green" }}></i>
                            {score} / {questions.length}
                            <i className='fa-solid fa-xmark' style={{ color: "red", marginLeft: '10px' }}></i>
                        </h3>
                        <button onClick={() => setActiveLetter(null)}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Book3;
