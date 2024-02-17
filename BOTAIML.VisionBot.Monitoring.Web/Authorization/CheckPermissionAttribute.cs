using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace BOTAIML.VisionBot.Monitoring.Web.Authorization
{
    public class CheckPermissionAttribute : AuthorizeAttribute
    {
        public CheckPermissionAttribute(ApplicationPermissions permission)
            : base(permission.ToString())
        {
        }
    }
}
