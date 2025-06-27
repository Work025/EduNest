import React, { useState, useEffect } from 'react';
import lessons from './Book2.json';
import testLessons from './Book2-test.json';
import './Book2.css';

const Book2 = ({ user }) => {
  const [filter, setFilter] = useState('All');
  const [openLesson, setOpenLesson] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const storageKey = `book2-completed-${user.id}`;

  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (activeLesson && currentIndex !== null) {
      localStorage.setItem(`${activeLesson}_index-${user.id}`, currentIndex.toString());
    }
  }, [activeLesson, currentIndex, user.id]);

  const currentQuestion = questions[currentIndex];

  const resetTestState = () => setActiveLesson(null);

  const handleStartTest = (title) => {
    if (completedLessons[title]) return;
    const test = testLessons[title] || [];
    const savedIndex = localStorage.getItem(`${title}_index-${user.id}`);
    setQuestions(test);
    setActiveLesson(title);
    setCurrentIndex(savedIndex ? Number(savedIndex) : 0);
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
      localStorage.setItem(storageKey, JSON.stringify(updated));
      localStorage.removeItem(`${activeLesson}_index-${user.id}`);
      setActiveLesson("done");
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    const completed = completedLessons[lesson.title];
    if (filter === 'All') return true;
    if (filter === 'Past') return !!completed;
    if (filter === 'To-do') return !completed;
    return false;
  });

  return (
    <div className="book2">
      <div className='book2-text'>
        <h1>Book-2</h1>
        <div className="filter-buttons">
          {['All', 'Past', 'To-do', 'None'].map((f) => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className='book2-lsn'>
        {!activeLesson && filteredLessons.map((lesson, idx) => {
          const completed = completedLessons[lesson.title];
          const isOpen = openLesson === lesson.title;

          return (
            <div key={idx} className="lesson-card">
              <h3>{lesson.title} <i className={lesson.i}></i></h3>
              <button onClick={() => setOpenLesson(isOpen ? null : lesson.title)}>{lesson.btn}</button>

              <div className="lesson-details" style={{ visibility: isOpen ? 'visible' : 'hidden', height: isOpen ? 'auto' : 0, overflow: 'hidden' }}>
                <p>{lesson.text}</p>
                <button
                  className="test-btn"
                  onClick={() => handleStartTest(lesson.title)}
                  disabled={!!completed}
                >
                  {completed ? `${lesson.test} ✔️` : lesson.test}
                </button>
              </div>
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
            {currentQuestion.russian && <p style={{ fontStyle: 'italic' }}>{currentQuestion.russian}</p>}
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
              {completedLessons[activeLesson]?.score} / {completedLessons[activeLesson]?.total}
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
