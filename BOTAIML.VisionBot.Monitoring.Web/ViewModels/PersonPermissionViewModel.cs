using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class PersonPermissionViewModel
    {
        public string Name { get; set; }
        public string EmployeeId { get; set; }
        public int PermitTimeMinute { get; set; }
        public SpecificPermissionViewModel Permission { get; set; }
    }

    public class SpecificPermissionViewModel
    {
        public string PermissionName { get; set; }
        public bool HasPermission { get; set; }
    }

}
