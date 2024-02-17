using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.WebSocketManager
{
    public class WebSocketConnectionInfo
    {
        public string ConnectionId { get; set; }

        public SocketConnectionType ConnectionType { get; set; }

        public WebSocket WebSocket { get; set; }

        public WebSocketHandler Handler { get; set; }

        public bool IsBackendConnection
        {
            get
            {
                return Handler is CameraManagementBackendHandler;
            }
        }

        public bool IsUIConnection
        {
            get
            {
                return Handler is CameraManagementUIHandler;
            }
        }

        public async Task CloseSocketAsync()
        {
            if (WebSocket.State != WebSocketState.Closed && WebSocket.State != WebSocketState.Aborted)
            {
                await WebSocket.CloseAsync(closeStatus: WebSocketCloseStatus.NormalClosure,
                                        statusDescription: "Closed by the ConnectionManager",
                                        cancellationToken: CancellationToken.None);
            }
        }
    }
    public enum SocketConnectionType
    {
        CAMERA,
        UI
    }

}

