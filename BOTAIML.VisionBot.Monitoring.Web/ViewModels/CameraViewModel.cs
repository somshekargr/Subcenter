using BOTAIML.VisionBot.Monitoring.Web.Models;
using MiNET.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class CameraViewModel
    {
        public int Id { get; set; }

        public string CameraCode { get; set; }

        public bool IsEnabled { get; set; }

        public CameraComponentStatus CameraStatus { get; internal set; }

        public DateTime CameraStatusUpdatedOn { get; internal set; }
      
      
    }

   
}

