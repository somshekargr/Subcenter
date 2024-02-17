using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.WebSocketManager
{
    public class WebSocketManagerMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly ConnectionManager _connectionManager;
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<WebSocketManagerMiddleware> _logger;

        private WebSocketHandler _webSocketHandler;

        public WebSocketManagerMiddleware(RequestDelegate next,
                                          WebSocketHandler webSocketHandler,
                                          ConnectionManager connectionManager,
                                          IServiceProvider serviceProvider,
                                          ILogger<WebSocketManagerMiddleware> logger)
        {
            _next = next;
            _webSocketHandler = webSocketHandler;
            _connectionManager = connectionManager;
            this.serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest)
                return;

            var connectionId = context.Request.Query["connectionId"].ToString();

            if (string.IsNullOrWhiteSpace(connectionId))
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await context.Response.WriteAsync("Bad Request: connectionId parameter is unspecified.");
                return;
            }

            var connectionType = Enum.Parse<SocketConnectionType>(context.Request.Query["connectionType"].ToString(), true);

            var socket = await context.WebSockets.AcceptWebSocketAsync();

            var clientInfo = GetClientDetails(context);

            _webSocketHandler.OnConnected(connectionId, connectionType, clientInfo.hostName, clientInfo.ipAddress, socket);

            var msg = string.Empty;

            try
            {
                await Receive(socket, clientInfo, async (result, buffer) =>
                {
                    switch (result.MessageType)
                    {
                        case WebSocketMessageType.Text:
                            //msg = Encoding.UTF8.GetString(buffer);
                            //await _webSocketHandler.ReceiveStringAsync(socket, msg);
                            var msgBuffer = Encoding.UTF8.GetBytes("Text messages are not supported!");
                            await socket.SendAsync(new Memory<byte>(msgBuffer), WebSocketMessageType.Text, true, CancellationToken.None);
                            break;

                        case WebSocketMessageType.Binary:
                            await _webSocketHandler.ReceiveAsync(socket, buffer);
                            break;

                        case WebSocketMessageType.Close:
                            await _webSocketHandler.OnDisconnected(socket);
                            break;
                    }
                });
            }
            catch (WebSocketException)
            {
                _logger.LogWarning($"WebSocket connection with ID '{connectionId}' was disconnected.");

                await _connectionManager.RemoveSocket(connectionId, connectionType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error while processing WebSocket message:\n{msg}");
            }

            //TODO - investigate the Kestrel exception thrown when this is the last middleware
            try
            {
                await _next.Invoke(context);
            }
            catch (InvalidOperationException)
            {
                //Ignore for now. Kestrel exception thrown when this is the last middleware
            }
        }

        private async Task Receive(WebSocket socket, (string ipAddress, string hostName) clientInfo, Action<WebSocketReceiveResult, byte[]> handleMessage)
        {
            while (socket.State == WebSocketState.Open)
            {
                try
                {
                    var buffer = new ArraySegment<byte>(new byte[8192]);

                    using (var ms = new MemoryStream())
                    {
                        WebSocketReceiveResult result;

                        do
                        {
                            result = await socket.ReceiveAsync(buffer, CancellationToken.None);

                            ms.Write(buffer.Array, buffer.Offset, result.Count);
                        }
                        while (!result.EndOfMessage);

                        handleMessage(result, ms.ToArray());
                    }
                }
                catch (Exception ex)
                {
                    //var baseException = ex.GetBaseException();

                    //var error = new Dictionary<string, string>
                    //{
                    //    {"Type", baseException.GetType().ToString()},
                    //    {"Message", baseException.Message},
                    //    {"StackTrace", baseException.StackTrace}
                    //};

                    //foreach (DictionaryEntry data in baseException.Data)
                    //    error.Add(data.Key.ToString(), data.Value.ToString());

                    //using (var dbContextProvider = new ScopedAppDbContextProvider(serviceProvider))
                    //{
                    //    dbContextProvider.DbContext.SystemLogs.Add(new SystemLog
                    //    {
                    //        Source = SystemLogSource.WebServer,
                    //        Categoty = SystemLogCategory.Application,
                    //        LogLevel = SystemLogLevel.Error,
                    //        Message = $"Error processing WebSocket request.",
                    //        AdditionalData = error,
                    //        IsAlertRequired = true,
                    //        HostName = clientInfo.hostName,
                    //        IPAddress = clientInfo.ipAddress
                    //    });

                    //    await dbContextProvider.DbContext.SaveChangesAsync();
                    //}
                }
            }
        }

        private (string ipAddress, string hostName) GetClientDetails(HttpContext context)
        {
            var remoteIpAddress = context.Connection.RemoteIpAddress;

            IPHostEntry hostEntry = null;

            try
            {
                hostEntry = Dns.GetHostEntry(remoteIpAddress);
            }
            catch
            {
                //Do nothing. Dns.GetHostEntry is failing on linux.
                //TODO: Fix this for linux
            }

            var ipAddress = remoteIpAddress.ToString();

            // If we got an IPV6 address, then we need to ask the network for the IPV4 address 
            // This usually only happens when the browser is on the same machine as the server.
            if (remoteIpAddress != null && hostEntry != null && remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
            {
                remoteIpAddress = hostEntry.AddressList
                                           .First(x => x.AddressFamily == AddressFamily.InterNetwork);

                ipAddress = remoteIpAddress.ToString();
            }

            var hostName = !string.IsNullOrWhiteSpace(hostEntry?.HostName) ? hostEntry.HostName : ipAddress;

            return (hostName, ipAddress);
        }
    }
}
