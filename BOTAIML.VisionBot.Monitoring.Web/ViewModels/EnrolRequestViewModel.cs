using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class EnrolRequestViewModel
    {
        public int PersonId { get; set; }
        public List<EnrolRequest> EnrolRequests { get; set; }
    }

    public class EnrolRequest
    {
        public int Id { get; set; }
        public string Image { get; set; }
    }
}
