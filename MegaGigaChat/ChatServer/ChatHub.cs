using Microsoft.AspNetCore.SignalR;
using ChatServer.Models;
using System.Collections.Concurrent;
using Microsoft.AspNetCore.Authorization;


[Authorize]
public class ChatHub : Hub
{
    
    private static readonly ConcurrentDictionary<string, ChatRoom> Rooms = new();
    private static readonly ConcurrentDictionary<string, User> Users = new();
    private static readonly ConcurrentDictionary<string, List<string>> UserRoomHistory = new();

    
    public async Task<string> CreateRoom(CreateRoomRequest request)
    {
        var roomId = Guid.NewGuid().ToString()[..8].ToUpper();
        var room = new ChatRoom
        {
            RoomId = roomId,
            RoomName = string.IsNullOrEmpty(request.RoomName) ? $"Room {roomId}" : request.RoomName,
            Creator = request.Username,
            CreatedAt = DateTime.Now
        };

        var user = new User
        {
            ConnectionId = Context.ConnectionId,
            Username = request.Username,
            CurrentRoom = roomId
        };

       
        Users[Context.ConnectionId] = user;
        Rooms[roomId] = room;
        AddRoomToUserHistory(request.Username, roomId);

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

        Console.WriteLine($"Room created: {roomId} by {request.Username}");

        return roomId;
    }

    
    public async Task<bool> JoinRoom(JoinRoomRequest request)
    {
        if (!Rooms.ContainsKey(request.RoomId) || !Rooms[request.RoomId].IsActive)
        {
            await Clients.Caller.SendAsync("ReceiveError", new ChatMessageDto
            {
                Type = "error",
                Text = $"Room {request.RoomId} not found or deleted",
                Timestamp = DateTime.Now.ToString("HH:mm:ss")
            });
            return false;
        }

        var user = new User
        {
            ConnectionId = Context.ConnectionId,
            Username = request.Username,
            CurrentRoom = request.RoomId
        };

        
        Users[Context.ConnectionId] = user;
        Rooms[request.RoomId].Users.Add(user);
        AddRoomToUserHistory(request.Username, request.RoomId);

        await Groups.AddToGroupAsync(Context.ConnectionId, request.RoomId);

        
        var roomMessages = Rooms[request.RoomId].Messages;
        var messageDtos = roomMessages.Select(m => new ChatMessageDto
        {
            User = m.User,
            Text = m.Text,
            Timestamp = m.Timestamp.ToString("HH:mm:ss"),
            Type = "text"
        }).ToList();

        await Clients.Caller.SendAsync("ReceiveRoomHistory", messageDtos);

       
        await Clients.Group(request.RoomId).SendAsync("ReceiveMessage", new ChatMessageDto
        {
            Type = "join",
            Text = $"{request.Username} joined the room",
            Timestamp = DateTime.Now.ToString("HH:mm:ss"),
            User = "System"
        });

        Console.WriteLine($"User {request.Username} joined room {request.RoomId}");
        return true;
    }

   
    public async Task SendMessageToRoom(ChatMessageDto messageDto)
    {
        if (Users.TryGetValue(Context.ConnectionId, out var user) &&
            !string.IsNullOrEmpty(user.CurrentRoom))
        {
            var roomId = user.CurrentRoom;

            
            messageDto.User = user.Username;
            messageDto.Timestamp = DateTime.Now.ToString("HH:mm:ss");
            messageDto.Type = "text";

            
            if (Rooms.TryGetValue(roomId, out var room))
            {
                room.Messages.Add(new ChatMessage
                {
                    User = messageDto.User,
                    Text = messageDto.Text,
                    Timestamp = DateTime.Now
                });
            }

            
            await Clients.Group(roomId).SendAsync("ReceiveMessage", messageDto);
        }
    }

    
    public List<string> GetUserRoomIds(string username)
    {
        if (UserRoomHistory.TryGetValue(username, out var roomIds))
        {
            return roomIds.Where(roomId =>
                Rooms.ContainsKey(roomId) && Rooms[roomId].IsActive).ToList();
        }
        return new List<string>();
    }


    public RoomInfoDto? GetRoomInfo(string roomId) 
    {
        if (Rooms.TryGetValue(roomId, out var room) && room.IsActive)
        {
            return new RoomInfoDto
            {
                RoomId = room.RoomId,
                RoomName = room.RoomName,
                Creator = room.Creator,
                CreatedAt = room.CreatedAt,
                UserCount = room.Users.Count,
                MessageCount = room.Messages.Count
            };
        }
        return null;
    }


    public async Task<bool> DeleteRoom(string roomId, string username)
    {
        if (Rooms.TryGetValue(roomId, out var room) && room.Creator == username)
        {
            room.IsActive = false;

            
            await Clients.Group(roomId).SendAsync("ReceiveMessage", new ChatMessageDto
            {
                Type = "system",
                Text = $"Room was deleted by creator",
                Timestamp = DateTime.Now.ToString("HH:mm:ss"),
                User = "System"
            });

            
            foreach (var user in room.Users)
            {
                await Groups.RemoveFromGroupAsync(user.ConnectionId, roomId);
                if (Users.TryGetValue(user.ConnectionId, out var currentUser))
                {
                    currentUser.CurrentRoom = "";
                }
            }

            Rooms.TryRemove(roomId, out _);
            Console.WriteLine($"Room {roomId} deleted by {username}");
            return true;
        }
        return false;
    }

    
    public async Task LeaveRoom()
    {
        if (Users.TryGetValue(Context.ConnectionId, out var user) &&
            !string.IsNullOrEmpty(user.CurrentRoom))
        {
            var roomId = user.CurrentRoom;
            var username = user.Username;

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

            if (Rooms.TryGetValue(roomId, out var room))
            {
                room.Users.RemoveAll(u => u.ConnectionId == Context.ConnectionId);
            }

            user.CurrentRoom = "";

            
            await Clients.Group(roomId).SendAsync("ReceiveMessage", new ChatMessageDto
            {
                Type = "leave",
                Text = $"{username} left the room",
                Timestamp = DateTime.Now.ToString("HH:mm:ss"),
                User = "System"
            });

            Console.WriteLine($"User {username} left room {roomId}");
        }
    }

    
    private void AddRoomToUserHistory(string username, string roomId)
    {
        UserRoomHistory.AddOrUpdate(
            username,
            new List<string> { roomId },
            (key, existingList) =>
            {
                if (!existingList.Contains(roomId))
                {
                    existingList.Add(roomId);
                }
                return existingList;
            });
    }

    
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await LeaveRoom();
        await base.OnDisconnectedAsync(exception);
    }
}