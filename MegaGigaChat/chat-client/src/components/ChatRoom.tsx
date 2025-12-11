import React from 'react';
import { useChat } from '../hooks/useChat';

interface ChatRoomProps {
    chat: ReturnType<typeof useChat>;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chat }) => {
    const {
        roomId, username, messages,
        leaveRoom, deleteRoom,
        inputText, setInputText, sendMessage,
        messagesEndRef, connection
    } = chat;

    const isConnected = connection && connection.state === 'Connected';

    return (
        <div className="card mx-auto" style={{maxWidth: '800px', height: '80vh'}}>
            {/* Заголовок комнаты */}
            <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                <h5 className="mb-0">Комната: {roomId} (Вы: {username})</h5>
                <div>
                    <button className="btn btn-sm btn-danger me-2" onClick={deleteRoom}>Удалить Комнату</button>
                    <button className="btn btn-sm btn-warning" onClick={leaveRoom}>Покинуть</button>
                </div>
            </div>
            
            {/* Область сообщений */}
            <div className="card-body overflow-auto d-flex flex-column" style={{flex: 1, backgroundColor: '#f8f9fa'}}>
                {messages.map((message, idx) => {
                    const isMyMessage = message.user === username;
                    const isSystemMessage = message.type !== 'text';

                    if (isSystemMessage) {
                        return (
                            <div key={idx} className="text-center text-muted small my-2">
                                <em>[{message.timestamp}] {message.text}</em>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className={`d-flex mb-3 ${isMyMessage ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div 
                                className={`card px-3 py-2 ${isMyMessage ? 'bg-primary text-white' : 'bg-white border'}`}
                                style={{maxWidth: '70%', borderRadius: '15px', border: isMyMessage ? 'none' : '1px solid #ddd'}}
                            >
                                <div className="small fw-bold mb-1" style={{opacity: 0.8}}>{message.user}</div>
                                <div>{message.text}</div>
                                <div className="small text-end mt-1" style={{opacity: 0.7, fontSize: '0.7em'}}>{message.timestamp}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода сообщения */}
            <div className="card-footer">
                <div className="input-group">
                    <input 
                        type="text" 
                        className="form-control"
                        placeholder="Введите сообщение..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    />
                    <button 
                        className="btn btn-primary" 
                        onClick={sendMessage} 
                        disabled={!isConnected}
                    >
                        Отправить
                    </button>
                </div>
                {!isConnected && (
                    <small className="text-danger mt-1">Соединение потеряно, ожидание переподключения...</small>
                )}
            </div>
        </div>
    );
};

export default ChatRoom;