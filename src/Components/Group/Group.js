import React, { useEffect, useState } from "react";
import "./Group.css";
import data from "../Edu.json";
import socket from "../../socket";

function Group() {
    const [selectedGroup, setSelectedGroup] = useState("1");
    const [groupData, setGroupData] = useState([]);

    // Boshlanishda: data ni avatarlar bilan yuklaymiz
    useEffect(() => {
        const enriched = data.map((user) => ({
            ...user,
            avatar: localStorage.getItem(`user_${user.id}_image`) || null
        }));
        setGroupData(enriched);
    }, []);

    // Avatar o‘zgarsa - socket orqali yangilaymiz
    useEffect(() => {
        const handleAvatarUpdate = ({ userId, avatarUrl }) => {
            setGroupData(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, avatar: avatarUrl }
                        : user
                )
            );
            localStorage.setItem(`user_${userId}_image`, avatarUrl); // localStorage ni ham yangilaymiz
        };

        socket.on("avatar_updated", handleAvatarUpdate);

        return () => {
            socket.off("avatar_updated", handleAvatarUpdate);
        };
    }, []);

    const filteredData = groupData.filter(t => t.group === selectedGroup);

    return (
        <div className="group">
            <div className="group-container">
                <div className="group-name">
                    <div className="group-name-h1" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h1>Group</h1>
                    </div>
                    <div className="group-name-btn">
                        {[1, 2, 3, 4, 5].map(num => (
                            <button
                                key={num}
                                onClick={() => setSelectedGroup(num.toString())}
                            >
                                G<span>roup</span>-{num}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="group-content">
                    <div className="group-text">
                        <h1>Group-{selectedGroup}</h1>
                    </div>
                    {filteredData.length > 0 ? (
                        filteredData.map(t => (
                            <div key={t.id} className="group-user">
                                {t.avatar ? (
                                    <img
                                        src={t.avatar}
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
                                <p><strong>Class:</strong> {t.class}</p>|
                                <p><strong>Time:</strong> {t.time}</p>|
                                <p><strong>Teacher:</strong> {t.teacher}</p>
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
