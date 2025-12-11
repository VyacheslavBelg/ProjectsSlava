import { useState, useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ChatMessageDto, CreateRoomRequest, JoinRoomRequest, RoomInfoDto } from '../types';

const CHAT_HUB_URL = "http://localhost:5157/chatHub";

export const useChat = () => {
  
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [inputText, setInputText] = useState('');
    
   
    const [roomNameForCreation, setRoomNameForCreation] = useState('');
    const [myRooms, setMyRooms] = useState<RoomInfoDto[]>([]); 
    const [showRooms, setShowRooms] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(CHAT_HUB_URL, {
                accessTokenFactory: () => localStorage.getItem('accessToken') || ''
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(newConnection);
    }, []);


    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR Hub');
                    
                    connection.on("ReceiveMessage", (message: ChatMessageDto) => {
                        setMessages(prev => [...prev, message]);
                    });

                    connection.on("ReceiveRoomHistory", (history: ChatMessageDto[]) => {
                        setMessages(history);
                    });

                    connection.on("ReceiveError", (error: ChatMessageDto) => {
                        alert(`Ошибка: ${error.text}`);
                        setIsInRoom(false); 
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

 
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

   

    const createRoom = async () => {
        if (!username) return alert("Введите имя пользователя!");
        try {
            const request: CreateRoomRequest = { username, roomName: roomNameForCreation };
            const newRoomId = await connection?.invoke<string>("CreateRoom", request);
            
            if (newRoomId) {
                setRoomId(newRoomId);
                setIsInRoom(true);
                setShowRooms(false);
                setMessages([]); 
            }
        } catch (e) {
            console.error("Error creating room:", e);
        }
    };
    
    const joinRoom = async () => {
        if (!username || !roomId) return alert("Введите имя пользователя и ID комнаты!");
        await executeJoin(roomId);
    };
    
    const executeJoin = async (id: string) => {
        setRoomId(id);
        try {
            const request: JoinRoomRequest = { username, roomId: id };
            const success = await connection?.invoke<boolean>("JoinRoom", request);
            if (success) {
                setIsInRoom(true);
                setShowRooms(false);
            }
        } catch (e) {
            console.error("Error joining room:", e);
            alert(`Не удалось войти в комнату ${id}. Возможно, ее не существует.`);
        }
    };


    const sendMessage = async () => {
        if (!inputText) return;
        try {
            const message: ChatMessageDto = {
                user: username,
                text: inputText,
                type: 'text',
                timestamp: '' 
            };
            await connection?.invoke("SendMessageToRoom", message);
            setInputText('');
        } catch (e) {
            console.error("Error sending message:", e);
        }
    };

    const leaveRoom = async () => {
        try {
            await connection?.invoke("LeaveRoom");
            setIsInRoom(false);
            setMessages([]);
            setRoomId('');
            setRoomNameForCreation('');
        } catch (e) {
            console.error("Error leaving room:", e);
        }
    };

    const deleteRoom = async () => {
        if(!window.confirm("Вы уверены? Только создатель может удалить комнату.")) return;
        try {
            await connection?.invoke("DeleteRoom", roomId, username);
            setIsInRoom(false);
            setMessages([]);
            setRoomId('');
            setRoomNameForCreation('');
        } catch (e) {
            console.error("Error deleting room:", e);
            alert("Не удалось удалить комнату. Вы ее создатель?");
        }
    };

    const loadUserRooms = async () => {
        if (!username) return alert("Введите имя пользователя!");
        
        if(showRooms) {
            setShowRooms(false);
            return;
        }

        try {
            const roomIds = await connection?.invoke<string[]>("GetUserRoomIds", username);

            if (roomIds && roomIds.length > 0) {
                const roomsData = await Promise.all(
                    roomIds.map(id => connection?.invoke<RoomInfoDto | null>("GetRoomInfo", id))
                );

                setMyRooms(roomsData.filter((r): r is RoomInfoDto => r !== null));
                setShowRooms(true);
            } else {
                alert("Активные комнаты для этого пользователя не найдены.");
                setMyRooms([]);
                setShowRooms(false);
            }
        } catch (e) {
            console.error("Error loading rooms:", e);
            alert("Не удалось загрузить комнаты. Проверьте консоль.");
        }
    };

    return {

        username, setUsername,
        roomId, setRoomId,
        isInRoom, setIsInRoom,
        messages,
        inputText, setInputText,
        messagesEndRef,
        connection,


        roomNameForCreation, setRoomNameForCreation,
        myRooms,
        showRooms,

   
        createRoom,
        joinRoom,
        executeJoin,
        sendMessage,
        leaveRoom,
        deleteRoom,
        loadUserRooms,
    };
};