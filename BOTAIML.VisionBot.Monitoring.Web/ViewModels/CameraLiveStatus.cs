using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public struct CameraLiveStatus
    {
        public CameraComponentStatus Status { get; set; }

        public string ErrorMessage { get; set; }
    }
}
