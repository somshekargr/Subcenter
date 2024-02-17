using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.WebSocketManager.ViewModels
{
    public enum CameraManagementMessageType
    {
        Error = 0,

        CameraStartedEvent = 1,
        CameraStoppedEvent = 2,
        
        GetCameraLiveStatusRequest = 3,
        GetCameraLiveStatusResponse = 4,

        BeginLiveStream = 5,
        EndLiveStream = 6,

        LiveStreamData = 7,
    }
}
