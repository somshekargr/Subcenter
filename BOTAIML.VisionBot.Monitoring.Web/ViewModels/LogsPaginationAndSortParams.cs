using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class LogsPaginationAndSortParams
    {
        public PaginatedAndSortedResult PaginationAndSort { get; set; }
        public LogFilterParams Filter { get; set; }
    }
}
