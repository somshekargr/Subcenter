using BOTAIML.VisionBot.Monitoring.Web.Utils;
using BOTAIML.VisionBot.Monitoring.Web.WebSocketManager.ViewModels;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Bson;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.WebSocketManager
{
    public abstract class WebSocketHandler
    {
        protected readonly ILogger logger;
        protected readonly IServiceProvider services;
        protected ConnectionManager WebSocketConnectionManager { get; private set; }
        protected string clientHostName = null;
        protected string clientIPAddress = null;

        public WebSocketHandler(ConnectionManager webSocketConnectionManager,
            IServiceProvider services,
            ILogger logger)
        {
            WebSocketConnectionManager = webSocketConnectionManager;

            this.services = services;

            this.logger = logger;
        }

        public virtual async Task OnConnected(string connectionId, SocketConnectionType connectionType,
            string clientHostName, string clientIPAddress, WebSocket socket)
        {
            this.clientHostName = clientHostName;
            this.clientIPAddress = clientIPAddress;

            await WebSocketConnectionManager.RemoveSocket(connectionId, connectionType);

            WebSocketConnectionManager.AddSocket(connectionId, connectionType, socket, this);
        }
        public virtual async Task OnDisconnected(WebSocket socket)
        {
            var connectionInfo = WebSocketConnectionManager.GetSocketConnectionInfo(socket);

            await WebSocketConnectionManager.RemoveSocket(connectionInfo.ConnectionId, connectionInfo.ConnectionType);
        }
        public async Task SendMessageAsync<TMessage>(WebSocket socket, TMessage message)
        {
            if (socket.State != WebSocketState.Open)
                return;

            var ms = new MemoryStream();

            using (var writer = new BsonWriter(ms))
            {
                var serializer = new JsonSerializer();

                serializer.Serialize(writer, message);

                await SendMessageAsync(socket, ms.ToArray());
            }
        }
        public async Task SendMessageAsync(WebSocket socket, byte[] buffer)
        {
            if (socket.State != WebSocketState.Open)
                return;

            try
            {
                await socket.SendAsync(buffer: new ArraySegment<byte>(array: buffer,
                                                                      offset: 0,
                                                                      count: buffer.Length),
                                       messageType: WebSocketMessageType.Binary,
                                       endOfMessage: true,
                                       cancellationToken: CancellationToken.None);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error while sending WebSocket message");
            }
        }

        public async Task ReceiveAsync(WebSocket socket, byte[] buffer)
        {
            var message = BsonConvert.Deserialize<CameraManagementMessage>(buffer);
            message.SetRawMessage(buffer);

            await HandleIncomingMessage(socket, message);
        }

        protected abstract Task HandleIncomingMessage(WebSocket socket, CameraManagementMessage message);

        protected bool TryValidateModel(object model, out ICollection<ValidationResult> results)
        {
            results = new List<ValidationResult>();
            if (model == null)
                return false;

            var validationContext = new ValidationContext(model, serviceProvider: null, items: null);

            return Validator.TryValidateObject(model, validationContext, results);
        }
    }
}
