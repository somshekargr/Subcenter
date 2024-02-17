using Microsoft.AspNet.SignalR.WebSockets;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;
using static BOTAIML.VisionBot.Monitoring.Web.WebSocketManager.WebSocketConnectionInfo;

namespace BOTAIML.VisionBot.Monitoring.Web.WebSocketManager
{
    public class ConnectionManager
    {
        private ConcurrentDictionary<string, WebSocketConnectionInfo> _sockets = new ConcurrentDictionary<string, WebSocketConnectionInfo>();

        public WebSocketConnectionInfo GetSocketInfoById(string connectionId, SocketConnectionType connectionType)
        {
            var id = GetConnectionKey(connectionId, connectionType);

            return _sockets.FirstOrDefault(p => p.Key == id).Value;
        }
        public ConcurrentDictionary<string, WebSocketConnectionInfo> GetAll()
        {
            return _sockets;
        }
        public WebSocketConnectionInfo GetSocketConnectionInfo(WebSocket socket)
        {
            return _sockets.FirstOrDefault(p => p.Value.WebSocket == socket).Value;
        }
        public void AddSocket(string connectionId, SocketConnectionType connectionType, WebSocket socket, WebSocketHandler handler)
        {
            _sockets.TryAdd(GetConnectionKey(connectionId, connectionType), new WebSocketConnectionInfo
            {
                ConnectionId = connectionId,
                ConnectionType = connectionType,
                WebSocket = socket,
                Handler = handler
            });
        }
        public async Task RemoveSocket(string connectionId, SocketConnectionType connectionType)
        {

            _sockets.TryRemove(GetConnectionKey(connectionId, connectionType), out var socket);

            if (_sockets == null)
            {
                await socket.CloseSocketAsync();
            }
        }
        private string GetConnectionKey(string connectionId, SocketConnectionType connectionType)
        {
            return $"{connectionId}-{connectionType}";
        }
    }
}
