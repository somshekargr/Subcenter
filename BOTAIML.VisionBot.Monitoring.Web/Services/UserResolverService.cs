using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Models;

namespace BOTAIML.VisionBot.Monitoring.Web.Services
{
    public class UserResolverService
    {
        private readonly HttpContext context;

        public UserResolverService(IHttpContextAccessor contextAccessor)
        {
            context = contextAccessor.HttpContext;
        }

        public bool IsLoggedIn
        {
            get
            {
                return context.User != null;
            }
        }

        public int LoggedInUserId
        {
            get
            {
                if (IsLoggedIn)
                    return context.User.GetLoggedInUserId();

                return -1;
            }
        }
    }
}
