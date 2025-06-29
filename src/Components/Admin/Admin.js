import React, { useEffect, useState } from 'react';
import './Admin.css';
import users from '../Edu.json';

const books = ['Book1', 'Book2', 'Book3', 'Book4'];

const Admin = () => {
  const [data, setData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBook, setSelectedBook] = useState('Book1');

  // LocalStorage'dan boshlang'ich qiymatlarni o'qish
  useEffect(() => {
    const savedUserId = localStorage.getItem("admin_selectedUserId");
    const savedBook = localStorage.getItem("admin_selectedBook");

    if (savedUserId) setSelectedUserId(savedUserId);
    if (savedBook) setSelectedBook(savedBook);
  }, []);

  // Kitobga qarab darslar ro‘yxatini yaratish
  const getLessons = (book) => {
    if (book === 'Book1') return Array(33).fill(0).map((_, i) => `Lesson-${i + 1}`);
    if (book === 'Book2') return Array(46).fill(0).map((_, i) => `Lesson-${i + 1}`);
    if (book === 'Book3') return Array(30).fill(0).map((_, i) => `Lesson-${i + 1}`);
    if (book === 'Book4') return Array(20).fill(0).map((_, i) => `Lesson-${i + 1}`);
    return [];
  };

  // Foydalanuvchilarning test natijalarini yig‘ish
  useEffect(() => {
    const lessons = getLessons(selectedBook);
    const result = users.map((user) => {
      const progress = lessons.map((lesson) => {
        const key = `${selectedBook}_${lesson}Result-${user.id}`;
        const result = localStorage.getItem(key);
        return {
          lesson,
          completed: result !== null,
          data: result ? JSON.parse(result) : null
        };
      });
      return {
        username: user.username,
        password: user.password,
        id: user.id,
        sorename: user.sorename,
        isOnline: localStorage.getItem('currentUserId') === String(user.id),
        progress
      };
    });
    setData(result);
  }, [selectedBook]);

  // Foydalanuvchini tanlash
  const handleUserChange = (e) => {
    const value = e.target.value;
    setSelectedUserId(value);
    localStorage.setItem("admin_selectedUserId", value);
  };

  // Kitobni tanlash
  const handleBookChange = (e) => {
    const value = e.target.value;
    setSelectedBook(value);
    localStorage.setItem("admin_selectedBook", value);
  };

  // Filtrlangan foydalanuvchilar
  const filteredUsers = selectedUserId
    ? data.filter((user) => user.id === selectedUserId)
    : data;

  return (
    <div className="admin">
      <h1>Admin Panel</h1>

      <div className="admin-filters">
        <select value={selectedUserId} onChange={handleUserChange}>
          <option value="">-- O‘quvchini tanlang --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              ({user.id}) {user.sorename}
            </option>
          ))}
        </select>

        <select value={selectedBook} onChange={handleBookChange}>
          {books.map((book) => (
            <option key={book} value={book}>
              {book}
            </option>
          ))}
        </select>
      </div>

      {filteredUsers.map((user, i) => (
        <div key={i} className="admin-user">
          <h2>
            {user.sorename}{' '}
            {user.isOnline && <span className="online-dot"></span>}
            <span>({user.username})</span>
          </h2>
          <p style={{ marginTop: '-10px', fontSize: '14px', color: '#333' }}>
            Parol: <b>{user.password}</b>
          </p>

          <table>
            <thead>
              <tr>
                <th>Dars</th>       
                <th>Holat</th>
                <th>Natija</th>
              </tr>
            </thead>
            <tbody>
              {user.progress.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.lesson}</td>
                  <td>
                    {item.completed ? (
                      <span style={{ color: 'green' }}>✔ Check</span>
                    ) : (
                      <span style={{ color: 'gray' }}>⏳ None</span>
                    )}
                  </td>
                  <td>
                    {item.completed ? (
                      `${item.data.score} / ${item.data.total}`
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Admin;
