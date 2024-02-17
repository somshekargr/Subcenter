using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels.Authorization
{
    public class AuthenticatedUser
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Username { get; set; }

        public string RoleName { get; set; }

        public string[] Policies { get; set; }

        public string Token { get; set; }
    }
}
