namespace ChatServer.Models;


public class ChatMessageDto
{
    public string User { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public string Type { get; set; } = "text"; 
}

public class CreateRoomRequest
{
    public string Username { get; set; } = string.Empty;
    public string? RoomName { get; set; }
}

public class JoinRoomRequest
{
    public string Username { get; set; } = string.Empty;
    public string RoomId { get; set; } = string.Empty;
}

public class RoomInfoDto
{
    public string RoomId { get; set; } = string.Empty;
    public string RoomName { get; set; } = string.Empty;
    public string Creator { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int UserCount { get; set; }
    public int MessageCount { get; set; }
}


public class User
{
    public string ConnectionId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string CurrentRoom { get; set; } = string.Empty;
}

public class ChatRoom
{
    public string RoomId { get; set; } = string.Empty;
    public string RoomName { get; set; } = string.Empty;
    public string Creator { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public List<User> Users { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public List<ChatMessage> Messages { get; set; } = new();
}

public class ChatMessage
{
    public string User { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.Now;
}