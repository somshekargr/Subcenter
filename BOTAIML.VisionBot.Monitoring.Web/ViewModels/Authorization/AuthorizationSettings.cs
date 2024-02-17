using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels.Authorization
{
    public class AuthorizationSettings
    {
        public string Secret { get; set; }

        public int TokenTimeoutMinutes { get; set; }
    }
}
