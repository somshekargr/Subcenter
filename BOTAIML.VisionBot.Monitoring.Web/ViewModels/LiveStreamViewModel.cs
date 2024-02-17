using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class LiveStreamViewModel
    {
        public int Id { get; set; }

        public string CameraCode { get; set; }

        public bool IsEnabled { get; set; }

        public CameraLiveStatus CameraLiveStatus { get; set; }

        public CameraComponentStatus CameraStatus { get; set; }

    }
}
