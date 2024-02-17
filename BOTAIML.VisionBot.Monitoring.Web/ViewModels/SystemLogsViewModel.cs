using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class SystemLogsViewModel
    {
        [Required]
        public SystemLogSource Source { get; set; }

        [Required]
        public SystemLogCategory Categoty { get; set; }

        [Required]
        public SystemLogLevel LogLevel { get; set; }

        [Required]
        public string Message { get; set; }

        public object AdditionalData { get; set; }

        [Required]
        public bool IsAlertRequired { get; set; }

        [Required]
        public string HostName { get; set; }

        [Required]
        public string IPAddress { get; set; }

    }
}
