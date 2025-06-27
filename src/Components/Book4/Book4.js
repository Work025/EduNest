import React, { useState, useEffect } from 'react';
import './Book4.css';
import bookData from './Book4.json';
import lessonData from './Book4-test.json';

const Book4 = ({ user }) => {
    const [activeLesson, setActiveLesson] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("A-W");

    useEffect(() => {
        if (activeLesson && currentQuestionIndex !== null) {
            localStorage.setItem(`${activeLesson}_index-${user.id}`, currentQuestionIndex.toString());
        }
    }, [currentQuestionIndex, activeLesson, user]);

    const handleClick = (title) => {
        const result = localStorage.getItem(`${title}Result-${user.id}`);
        if (result) {
            alert("Bu harfni allaqachon o'tgansiz!");
            return;
        }

        const savedIndex = localStorage.getItem(`${title}_index-${user.id}`);
        setActiveLesson(title);
        setCurrentQuestionIndex(savedIndex ? Number(savedIndex) : 0);
        setSelectedOption(null);
        setShowAnswer(false);
        setScore(0);
    };

    const questions = lessonData[activeLesson] || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (option) => {
        if (selectedOption === null) {
            setSelectedOption(option);
            if (option === currentQuestion.correctAnswer) {
                setScore((prev) => prev + 1);
            }
        }
    };

    const filteredLessons = [...bookData]
        .filter((item) => {
            const result = localStorage.getItem(`${item.title}Result-${user.id}`);
            if (statusFilter === "Past") return result !== null;
            if (statusFilter === "To do") return result === null;
            return true;
        })
        .sort((a, b) => {
            return sortOrder === "A-W"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setShowAnswer(false);
        } else {
            const result = { score, total: questions.length };
            localStorage.setItem(`${activeLesson}Result-${user.id}`, JSON.stringify(result));
            localStorage.removeItem(`${activeLesson}_index-${user.id}`);
            setActiveLesson("done");
        }
    };

    return (
        <div className='book1'>
            <div className="filter-menu">
                <div className='filter-menu-h1'><h1>Book-4</h1></div>
                <div className="filter-buttons">
                    <button onClick={() => setSortOrder("A-W")} className={sortOrder === "A-W" ? "active" : ""}>A–W</button>
                    <button onClick={() => setSortOrder("W-A")} className={sortOrder === "W-A" ? "active" : ""}>W–A</button>
                    <button onClick={() => setStatusFilter("To do")} className={statusFilter === "To do" ? "active" : ""}>To-do</button>
                    <button onClick={() => setStatusFilter("Past")} className={statusFilter === "Past" ? "active" : ""}>Past</button>
                </div>
            </div>

            <div className='book1-lsn'>
                {filteredLessons.map((item, index) => {
                    const result = localStorage.getItem(`${item.title}Result-${user.id}`);
                    const isCompleted = result !== null;
                    const scoreData = isCompleted ? JSON.parse(result) : null;
                    const btnText = isCompleted ? "Answer" : item.btn;

                    return (
                        <div key={index} className="lsn1" style={{ position: "relative" }}>
                            <h3>
                                {item.icoin && <i className={item.icoin}></i>} <i className='fa-solid fa-book'></i>
                            </h3>

                            {scoreData && (
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

                            <button onClick={() => handleClick(item.title)} disabled={isCompleted}>
                                {btnText}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className='book1-tests'>
                {activeLesson !== "done" && currentQuestion && (
                    <div className="lesson-content">
                        <button className="close-button" onClick={() => setActiveLesson(null)}>
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
                                    <button onClick={() => setShowAnswer(true)}>Answer </button>
                                    <button onClick={nextQuestion} style={{ marginLeft: '10px' }}>
                                        <i className='fa-solid fa-angle-right'></i>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeLesson === "done" && (
                    <div className="lesson-content">
                        <button className="close-button" onClick={() => setActiveLesson(null)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <h3>
                            <i style={{ color: "green" }} className='fa-solid fa-check'></i> {score} / {questions.length} <i style={{ color: "red" }} className='fa-solid fa-xmark'></i>
                        </h3>
                        <button onClick={() => setActiveLesson(null)}>Next Letter</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Book4;
