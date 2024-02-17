using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class TelegramViewModel
    {
        public AlertContentType ContentType { get; set; }
        public string AlertContentMeta { get; set; }
        public string Message { get; set; }
        public TrackingStatus? Event { get; set; }
    }
}
