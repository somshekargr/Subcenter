using BOTAIML.VisionBot.Monitoring.Web.WebSocketManager.ViewModels;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.WebSocketManager
{
    public class CameraManagementUIHandler : WebSocketHandler
    {
        public CameraManagementUIHandler(ConnectionManager webSocketConnectionManager, IServiceProvider serviceProvider, ILogger<CameraManagementUIHandler> logger)
          : base(webSocketConnectionManager, serviceProvider, logger)
        {
        }

        protected async override Task HandleIncomingMessage(WebSocket socket, CameraManagementMessage message)
        {
            try
            {
                await SendMessageToBackend(message);
            }
            catch (BackendUnavailableException buEx)
            {
                await SendMessageAsync(socket, new CameraManagementMessageWithPayload
                {
                    CameraId = message.CameraId,
                    MessageType = CameraManagementMessageType.Error,
                    Payload = JObject.FromObject(new
                    {
                        ErrorMessage = buEx.Message
                    })
                });
            }
        }
        private async Task SendMessageToBackend(CameraManagementMessage message)
        {
            SocketConnectionType targetType;

            switch (message.MessageType)
            {
                case CameraManagementMessageType.GetCameraLiveStatusRequest:
                case CameraManagementMessageType.GetCameraLiveStatusResponse:
                case CameraManagementMessageType.BeginLiveStream:
                case CameraManagementMessageType.EndLiveStream:
                    targetType = SocketConnectionType.CAMERA;
                    break;
                default:
                    logger.LogWarning($"Message of type '{message.MessageType}' cannot be forwarded to Camera Management Backend.");
                    return;
            }
            var connectionInfo = WebSocketConnectionManager.GetSocketInfoById(message.CameraId, targetType);

            if (connectionInfo == null)
                throw new BackendUnavailableException(message.CameraId, targetType);

            await connectionInfo.Handler.SendMessageAsync(connectionInfo.WebSocket, message.GetRawMessage());
        }
    }

    public class BackendUnavailableException : ApplicationException
    {
        public BackendUnavailableException(string cameraId, SocketConnectionType targetConnectionType)
            : base($"Unable to connect to '{targetConnectionType}' of camera '{cameraId}'")
        {
        }
    }

}

