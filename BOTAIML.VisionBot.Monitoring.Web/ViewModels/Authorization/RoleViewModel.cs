using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BOTAIML.VisionBot.Monitoring.Web.Authorization;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels.Authorization
{
    public class RoleViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public ApplicationPermissions[] Permissions { get; set; }

        public int[] ReportPermissions { get; set; }

        public IEnumerable<string> Users { get; set; }
    }

    public class UserInfo
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}
