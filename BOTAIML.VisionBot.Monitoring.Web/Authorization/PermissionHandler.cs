using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using BOTAIML.VisionBot.Monitoring.Web.Constants;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels.Authorization;

namespace BOTAIML.VisionBot.Monitoring.Web.Authorization
{
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IUserAuthorizationService _userService;

        public PermissionHandler(IConfiguration configuration, IOptions<AuthorizationSettings> authSettings)
        {
            _userService = new UserAuthorizationService(configuration, authSettings);
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            if (int.TryParse(context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId))
            {
                var user = await _userService.GetByIdAsync(userId);

                if (user.RoleId == AppConstants.SUPER_USER_ROLE_ID)
                {
                    context.Succeed(requirement);
                    return;
                }

                if (user.Role != null && user.Role.Permissions != null && user.Role.Permissions.Contains(requirement.Permission))
                {
                    context.Succeed(requirement);
                    return;
                }
            }

            context.Fail();
        }
    }
}
