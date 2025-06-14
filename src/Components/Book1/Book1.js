import React, { useState, useEffect } from 'react';
import './Book1.css';
import bookData from './Book1.json';
import lessonData from './Book1-test.json';

const Book1 = () => {
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filter, setFilter] = useState("All");


  useEffect(() => {
    const result = localStorage.getItem(`${activeLesson}Result`);
    if (result) {
      const saved = JSON.parse(result);
      setScore(saved.score || 0);
    }
  }, [activeLesson]);

  const handleClick = (title) => {
    const result = localStorage.getItem(`${title}Result`);
    if (result) {
      alert("Bu darsni allaqachon o'tgansiz!");
      return;
    }
    setActiveLesson(title);
    setCurrentQuestionIndex(0);
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

  const filteredLessons = bookData.filter((item) => {
    const result = localStorage.getItem(`${item.title}Result`);
    if (filter === "All") return true;
    if (filter === "Past") return result !== null;
    if (filter === "To do") return result === null;
    if (filter === "None") return false;
    return true;
  });

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      const result = { score, total: questions.length };
      localStorage.setItem(`${activeLesson}Result`, JSON.stringify(result));
      setActiveLesson("done");
    }
  };

  return (
    <div className='book1'>
      <div className="filter-menu">
        <div className='filter-menu-h1'><h1>Book-1</h1></div>
        <div className="filter-buttons">
          {["All", "Past", "To do", "None"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={filter === type ? "active" : ""}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className='book1-lsn'>
        {filteredLessons.map((item, index) => {
          const result = localStorage.getItem(`${item.title}Result`);
          const isCompleted = result !== null;
          const scoreData = isCompleted ? JSON.parse(result) : null;
          const btnText = isCompleted ? "Answer" : item.btn;

          return (
            <div key={index} className="lsn1">
              {item.title && (
                <h3>
                  {item.title} {item.icoin && <i className={item.icoin}></i>}
                </h3>
              )}
              {isCompleted && scoreData && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  <i className='fa-solid fa-check'></i> {scoreData.score} / {scoreData.total}
                </p>
              )}
              {item.btn && (
                <button onClick={() => handleClick(item.title)} disabled={isCompleted}>
                  {btnText}
                </button>
              )}
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
            <button onClick={() => setActiveLesson(null)}>Next Lesson</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Book1;
