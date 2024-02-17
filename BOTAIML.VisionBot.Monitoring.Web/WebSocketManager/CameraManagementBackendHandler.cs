using BOTAIML.VisionBot.Monitoring.Web.Constants;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.Services;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using BOTAIML.VisionBot.Monitoring.Web.WebSocketManager.ViewModels;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.WebSocketManager
{
    public class CameraManagementBackendHandler : WebSocketHandler
    {
        private static readonly CameraManagementMessageType[] _messagesToBeForwardedToUI = new[]
       {
            CameraManagementMessageType.CameraStartedEvent,
            CameraManagementMessageType.CameraStoppedEvent,
            CameraManagementMessageType.GetCameraLiveStatusResponse,
            CameraManagementMessageType.LiveStreamData,
        };


        public CameraManagementBackendHandler(

            ConnectionManager webSocketConnectionManager,
            IServiceProvider services,
            ILogger<CameraManagementBackendHandler> logger
        ) : base(webSocketConnectionManager, services, logger)
        { }

        protected async override Task HandleIncomingMessage(WebSocket socket, CameraManagementMessage message)
        {
            await HandleBackendMessageAsync(socket, message);

            if (_messagesToBeForwardedToUI.Contains(message.MessageType))
            {
                await SendBinaryMessageToUI(socket, message);
            }
        }

        private async Task HandleBackendMessageAsync(WebSocket socket, CameraManagementMessage message)
        {
            if (message == null)
                return;

            var _messageTypeToHandlerMap = new Dictionary<CameraManagementMessageType, Func<WebSocket, CameraManagementMessage, AppDbContext, Task>>
            {
                { CameraManagementMessageType.CameraStartedEvent, OnCameraStartedAsync },
                { CameraManagementMessageType.CameraStoppedEvent, OnCameraStoppedAsync },
                { CameraManagementMessageType.Error, HandleErrorAsync },
            };

            if (_messageTypeToHandlerMap.ContainsKey(message.MessageType))
            {
                using (var dbContextProvider = new ScopedAppDbContextProvider(services))
                    await _messageTypeToHandlerMap[message.MessageType](socket, message, dbContextProvider.DbContext);
            }
        }

        private async Task AuthorisedUserEntryAsync(WebSocket socket, CameraManagementMessage message, AppDbContext dbContext)
        {
            var model = message.GetPayload<AuthorisedUserEntryViewModel>();

            if (!TryValidateModel(model, out var validationResults))
            {
                await SendValidationErrorAsync(socket, message, validationResults);
                return;
            }

            var camera = GetCameraByCode(message.CameraId, dbContext);

            if (camera == null || camera.Id < 1)
            {
                await SendErrorAsync(socket, message, $"Invalid Camera Code: {message.CameraId}");
                return;
            }

            var buffer = Convert.FromBase64String(model.Snapshot);

            var entry = new AuthorisedUserEntry
            {
                Category = model.Category,
                Probability = model.Probability,
                StartDateTime = model.StartDateTime,
                EndDateTime = model.EndDateTime,
                CameraId = camera.Id
            };

            dbContext.AuthorisedUserEntries.Add(entry);

            await dbContext.SaveChangesAsync();
        }

        private async Task OnCameraStartedAsync(WebSocket socket, CameraManagementMessage message, AppDbContext dbContext)
        {
            await SetCameraLiveStatusAsync(socket, message, dbContext, CameraComponentStatus.Running, SystemLogLevel.Info, "Camera Started");

            await dbContext.SaveChangesAsync();

        }

        private async Task OnCameraStoppedAsync(WebSocket socket, CameraManagementMessage message, AppDbContext dbContext)
        {
            await SetCameraLiveStatusAsync(socket, message, dbContext, CameraComponentStatus.Stopped, SystemLogLevel.Error, "Camera Stopped");
            await dbContext.SaveChangesAsync();
        }

        private async Task HandleErrorAsync(WebSocket socket, CameraManagementMessage message, AppDbContext dbContext)
        {
            var socketInfo = WebSocketConnectionManager.GetSocketConnectionInfo(socket);
            var source = SystemLogSource.Camera;

            switch (socketInfo.ConnectionType)
            {
                case SocketConnectionType.CAMERA:
                    source = SystemLogSource.Camera;
                    break;
            }

            AddSystemLog(new SystemLog
            {
                Source = source,
                DateTimeStamp = DateTime.Now,
                Category = SystemLogCategory.Application,
                LogLevel = SystemLogLevel.Error,
                Message = message.GetValueFromPayload<string>("errorMessage"),
                AdditionalData = message.CameraId,
                IsAlertRequired = true,
                HostName = clientHostName,
                IPAddress = clientIPAddress
            }, dbContext);

            await dbContext.SaveChangesAsync();

        }

        private void AddSystemLog(SystemLog log, AppDbContext dbContext)
        {
            dbContext.SystemLogs.Add(log);

            //Updating the Restoration Time for the System Log
            string cameraName = log.AdditionalData as string;

            if (log.Message == SystemLogMessages.CAMERA_STARTED)
            {
                var cameraExceptionLog = dbContext.SystemLogs
                                              .Where(l => l.Message == SystemLogMessages.CAMERA_STOPPED)
                                              .AsEnumerable<SystemLog>().Where(l => l.AdditionalData.ToString() == cameraName)
                                              .ToList()
                                              .LastOrDefault();

                if (cameraExceptionLog != null)
                {
                    cameraExceptionLog.RestoredOn = DateTime.Now;
                    dbContext.SystemLogs.Update(cameraExceptionLog);
                }
            }

        }
        private async Task SendValidationErrorAsync(WebSocket socket, CameraManagementMessage message, ICollection<ValidationResult> validationResults)
        {
            var errorMessage = string.Join(Environment.NewLine, validationResults.Select(vr => $"{string.Join(", ", vr.MemberNames)}: {vr.ErrorMessage}"));

            await SendErrorAsync(socket, message, errorMessage);
        }

        private async Task SendErrorAsync(WebSocket socket, CameraManagementMessage message, string error)
        {
            var errorMessage = $@"An error has occurred while processing {message.MessageType} message for Camera ID: {message.CameraId}
            {error}";

            await SendMessageAsync(socket, new CameraManagementMessageWithPayload
            {
                CameraId = message.CameraId,
                MessageType = CameraManagementMessageType.Error,
                Payload = JObject.FromObject(new
                {
                    ErrorMessage = errorMessage
                })
            });
        }

        private Camera GetCameraByCode(string code, AppDbContext dbContext)
        {
            var camera = dbContext.Cameras
                                 .Where(l => l.CameraCode == code)
                                 .FirstOrDefault();
            return camera;
        }

        private async Task SendBinaryMessageToUI(WebSocket socket, CameraManagementMessage message)
        {
            var uiConnections = WebSocketConnectionManager.GetAll().Where(c => c.Value.IsUIConnection);

            if (uiConnections.Any())
            {
                foreach (var pair in uiConnections)
                {
                    await SendMessageAsync(pair.Value.WebSocket, message.GetRawMessage());
                }
            }
            else
            {
                // If we just received LiveStreamData, but there are no UI connections to display
                // Send an EndLiveStream message; no pointing in streaming frames, when there are no clients to view it.
                if (message.MessageType == CameraManagementMessageType.LiveStreamData)
                {
                    await SendMessageAsync(socket, new CameraManagementMessageWithPayload
                    {
                        CameraId = message.CameraId,
                        MessageType = CameraManagementMessageType.EndLiveStream
                    });
                }
            }
        }

        private async Task SetCameraLiveStatusAsync(WebSocket socket, CameraManagementMessage message, AppDbContext dbContext, CameraComponentStatus cameraStatus,
           SystemLogLevel systemLogLevel, string systemLogMessage)
        {

            var model = message.GetPayload<WebSocketEventViewModel>();

            var camera = GetCameraByCode(message.CameraId, dbContext);

            if (camera == null || camera.Id < 1)
            {
                await SendErrorAsync(socket, message, $"Invalid Camera Code: {message.CameraId}");
                return;
            }

            var eventOccuredAt = (model.DateTimeStamp == null) ? DateTime.Now : model.DateTimeStamp;


            camera.CameraStatus = cameraStatus;
            camera.CameraStatusUpdatedOn = eventOccuredAt;

            AddSystemLog(new SystemLog
            {
                Source = SystemLogSource.Camera,
                Category = SystemLogCategory.Application,
                LogLevel = systemLogLevel,
                Message = systemLogMessage,
                AdditionalData = message.CameraId,
                IsAlertRequired = systemLogLevel != SystemLogLevel.Info,
                DateTimeStamp = eventOccuredAt,
                HostName = clientHostName,
                IPAddress = clientIPAddress
            }, dbContext);

            await dbContext.SaveChangesAsync();
        }

    }
}
