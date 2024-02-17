using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BOTAIML.VisionBot.Monitoring.Web.Models;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class LogFilterParams
    {
        public AreaName? Areas { get; set; }
        public DateTime? Date { get; set; }
    }
}
