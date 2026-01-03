// src/types.ts

export interface ChatMessageDto {
    user: string;
    text: string;
    timestamp: string;
    type: "text" | "join" | "leave" | "system" | "error";
}

export interface RoomInfoDto {
    roomId: string;
    roomName: string;
    creator: string;
    createdAt: string;
    userCount: number;
    messageCount: number;
}

export interface CreateRoomRequest {
    username: string;
    roomName?: string;
}

export interface JoinRoomRequest {
    username: string;
    roomId: string;
}