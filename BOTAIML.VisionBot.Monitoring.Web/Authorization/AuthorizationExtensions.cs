using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

using Microsoft.Extensions.DependencyInjection;

namespace BOTAIML.VisionBot.Monitoring.Web.Authorization
{
    public static class AuthorizationExtensions
    {
        public static IServiceCollection AddPermissionsBasedAuthorization(this IServiceCollection services)
        {
            return services.AddAuthorization(options =>
            {
                foreach (ApplicationPermissions permission in Enum.GetValues(typeof(ApplicationPermissions)))
                {
                    options.AddPolicy(permission.ToString(), policyBuilder =>
                    {
                        policyBuilder.Requirements.Add(new PermissionRequirement(permission));
                    });
                }
            });
        }
    }

    public static class ClaimsPrincipalExtensions
    {
        public static int GetLoggedInUserId(this ClaimsPrincipal principal)
        {
            if (principal == null)
                throw new ArgumentNullException(nameof(principal));

            var loggedInUserId = principal.FindFirstValue(ClaimTypes.NameIdentifier);

            if (int.TryParse(loggedInUserId, out var userId))
                return userId;

            return -1;
        }

        public static string GetLoggedInUserName(this ClaimsPrincipal principal)
        {
            if (principal == null)
                throw new ArgumentNullException(nameof(principal));

            return principal.FindFirstValue(ClaimTypes.Name);
        }
    }
}
