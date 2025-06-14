import React, { useState } from 'react';
import lessons from './Book2.json';
import testLessons from './Book2-test.json';
import './Book2.css';

const Book2 = () => {
  const [selectedTitle, setSelectedTitle] = useState('None');
  const [openLesson, setOpenLesson] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('book2-completed');
    return saved ? JSON.parse(saved) : {};
  });

  const currentQuestion = questions[currentIndex];

  const resetTestState = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
    setActiveLesson(null);
    setSelectedTitle("None");
    setOpenLesson(null);
  };

  const handleSelectChange = (e) => {
    setSelectedTitle(e.target.value);
    setOpenLesson(null);
  };

  const handleToggle = (title) => {
    setOpenLesson(openLesson === title ? null : title);
  };

  const handleStartTest = (title) => {
    if (completedLessons[title]) return;
    const test = testLessons[title] || [];
    setQuestions(test);
    setActiveLesson(title);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
  };

  const handleOptionClick = (opt) => {
    if (selectedOption) return;
    setSelectedOption(opt);
    if (opt === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      const finalScore = score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0);
      const updated = {
        ...completedLessons,
        [activeLesson]: {
          score: finalScore,
          total: questions.length,
        },
      };
      setCompletedLessons(updated);
      localStorage.setItem('book2-completed', JSON.stringify(updated));
      setActiveLesson("done");
    }
  };

  const filteredLessons = selectedTitle === 'None'
    ? []
    : lessons.filter((lesson) => lesson.title === selectedTitle);

  return (
    <div className="book2">
      <div className='book2-text'>
        <div className='book2-h1'>
          <h1>Book-2</h1>
        </div>
        <div className='book2-title'>
          <h2>Lessons</h2>
          <select className='book2-select' onChange={handleSelectChange} value={selectedTitle}>
            <option value="None">None</option>
            {lessons.map((lesson, index) => {
              const completed = completedLessons[lesson.title];
              const scoreInfo = completed ? ` (${completed.score}/${completed.total})` : '';
              return (
                <option key={index} value={lesson.title}>
                  {lesson.title}{scoreInfo}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className='book2-lsn'>
        {!activeLesson && filteredLessons.map((lesson, index) => {
          const completed = completedLessons[lesson.title];
          return (
            <div key={index} className="lesson-card">
              <h3>{lesson.title} <i className={lesson.i}></i></h3>
              <button onClick={() => handleToggle(lesson.title)}>{lesson.btn}</button>
              {openLesson === lesson.title && (
                <div className="lesson-details">
                  <p>{lesson.text}</p>
                  <button
                    className="test-btn"
                    onClick={() => handleStartTest(lesson.title)}
                    disabled={!!completed}
                  >
                    {completed ? `${lesson.test} ✔️` : lesson.test}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className='book1-tests'>
        {activeLesson !== "done" && currentQuestion && (
          <div className="lesson-content">
            <button className="close-button" onClick={resetTestState}>
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

        {activeLesson === "done" && (
          <div className="lesson-content">
            <button className="close-button" onClick={resetTestState}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h3>
              <i style={{ color: "green" }} className='fa-solid fa-check'></i>
              {completedLessons[selectedTitle]?.score} / {completedLessons[selectedTitle]?.total}
              <i style={{ color: "red", marginLeft: 10 }} className='fa-solid fa-xmark'></i>
            </h3>
            <button onClick={resetTestState}>Next Lesson</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Book2;
