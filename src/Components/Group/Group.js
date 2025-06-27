import React, { useState } from "react";
import "./Group.css";
import data from "../Edu.json";

function Group() {
    const [selectedGroup, setSelectedGroup] = useState("1");

    const filteredData = data.filter(t => t.group === selectedGroup);

    const getUserImage = (userId) => {
        return localStorage.getItem(`user_${userId}_image`);
    };

    return (
        <div className="group">
            <div className="group-container">
                <div className="group-name">
                    <div className="group-name-h1" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h1>Group</h1>
                    </div>
                    <div className="group-name-btn">
                        {[1, 2, 3, 4, 5].map(num => (
                            <button key={num} onClick={() => setSelectedGroup(num.toString())}>
                                G<span>roup</span>-{num}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="group-content">
                    <div className="group-text"><h1>Group-{selectedGroup}</h1></div>
                    {filteredData.length > 0 ? (
                        filteredData.map(t => (
                            <div key={t.id} className="group-user">
                                {getUserImage(t.id) ? (
                                    <img
                                        src={getUserImage(t.id)}
                                        alt="User"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "2px solid #3498db"
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        backgroundColor: "#ccc",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "24px",
                                        color: "#fff",
                                        border: "2px solid #bbb"
                                    }}>
                                        ?
                                    </div>
                                )}
                                <h3>{t.id}) {t.sorename}</h3>|
                                <p><strong>Class: </strong> {t.class}</p>|
                                <p><strong>Time: </strong> {t.time}</p>|
                                <p><strong>Teacher: </strong> {t.teacher}</p>
                            </div>
                        ))
                    ) : (
                        <p>No students found in this group.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Group;
