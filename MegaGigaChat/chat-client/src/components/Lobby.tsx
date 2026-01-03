import React from 'react';
import { useChat } from '../hooks/useChat';

interface LobbyProps {
    chat: ReturnType<typeof useChat>;
}

const Lobby: React.FC<LobbyProps> = ({ chat }) => {
    const {
        username, setUsername,
        roomId, setRoomId,
        joinRoom,
        roomNameForCreation, setRoomNameForCreation,
        createRoom,
        loadUserRooms,
        myRooms,
        showRooms,
        executeJoin
    } = chat;

    return (
        <div className="card p-4 mx-auto" style={{maxWidth: '500px'}}>
            <h2 className="text-center mb-4">🚪 Лобби SignalR Чата</h2>
            
            {/* 1. Ввод имени пользователя */}
            <div className="mb-3">
                <label className="form-label">Имя Пользователя</label>
                <input 
                    className="form-control" 
                    placeholder="Введите ваше имя"
                    value={username}
                    onChange={e => setUsername(e.target.value)} 
                />
            </div>

            <hr />

            {/* 2. Вход в существующую комнату */}
            <h5>🔗 Войти в комнату по ID</h5>
            <div className="input-group mb-3">
                <input 
                    className="form-control" 
                    placeholder="ID Комнаты (напр., A1B2C3D4)"
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                />
                <button className="btn btn-primary" onClick={joinRoom}>Войти</button>
            </div>

            {/* 3. Кнопка показа комнат пользователя */}
            <button 
                className="btn btn-outline-info w-100 mb-3" 
                onClick={loadUserRooms}
                disabled={!username}
            >
                {showRooms ? "Скрыть список комнат" : "Показать мои доступные комнаты"}
            </button>

            {/* Список комнат */}
            {showRooms && myRooms.length > 0 && (
                <div className="list-group mb-3">
                    {myRooms.map((room) => (
                        <button 
                            key={room.roomId}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            onClick={() => executeJoin(room.roomId)}
                        >
                            <div>
                                <strong>{room.roomName}</strong>
                                <div className="small text-muted">ID: {room.roomId} | Создатель: {room.creator}</div>
                            </div>
                            <span className="badge bg-primary rounded-pill">
                                {room.userCount} пользователей
                            </span>
                        </button>
                    ))}
                </div>
            )}
            
            <hr />

            {/* 4. Создание новой комнаты */}
            <h5>➕ Создать новую комнату</h5>
            <div className="mb-2">
                <input 
                    className="form-control" 
                    placeholder="Название комнаты (Необязательно)"
                    value={roomNameForCreation}
                    onChange={e => setRoomNameForCreation(e.target.value)}
                />
            </div>
            <button className="btn btn-success w-100" onClick={createRoom}>Создать и Войти</button>
        </div>
    );
};

export default Lobby;