using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace BOTAIML.VisionBot.Monitoring.Web.Authorization
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public PermissionRequirement(ApplicationPermissions permission)
        {
            Permission = permission;
        }

        public ApplicationPermissions Permission { get; }
    }
}
