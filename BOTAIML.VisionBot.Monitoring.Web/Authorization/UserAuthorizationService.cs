using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.Constants;
using BOTAIML.VisionBot.Monitoring.Web.Utils;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels.Authorization;


namespace BOTAIML.VisionBot.Monitoring.Web.Authorization
{
    public interface IUserAuthorizationService
    {
        Task<string> AuthenticateAsync(string username, string password);

        Task<User> GetByIdAsync(int userId);
    }

    public class UserAuthorizationService : IUserAuthorizationService, IDisposable
    {
        private readonly AuthorizationSettings authSettings;
        private AppDbContext dbContext;

        public UserAuthorizationService(IConfiguration configuration, IOptions<AuthorizationSettings> _authSettings)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            dbContext = new AppDbContext(new DbContextOptionsBuilder<AppDbContext>().UseNpgsql(connectionString).Options);

            authSettings = _authSettings.Value;
        }

        public async Task<string> AuthenticateAsync(string username, string password)
        {
            var user = await dbContext.Users.Include(u => u.Role).SingleOrDefaultAsync(x => x.Username == username);

            // return null if user not found
            if (user == null)
                return null;

            var isPasswordValid = HashingUtils.IsStringEqualToHash(user.Password, user.Id, password);

            if (!isPasswordValid)
                return null;


            var permissions = new List<string>();

            if (user.Role.Id == AppConstants.SUPER_USER_ROLE_ID)
            {
                foreach (ApplicationPermissions permission in Enum.GetValues(typeof(ApplicationPermissions)))
                    permissions.Add(permission.ToString());
            }
            else
            {
                if (user.Role.Permissions != null)
                {
                    foreach (var permission in user.Role.Permissions)
                        permissions.Add(permission.ToString());
                }
            }

            var token = CreateToken(user.Id, user.Name, permissions.ToArray());

            return token;
        }

        private string CreateToken(int id, string name, params string[] permissions)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Name, name)
            };

            foreach (var permission in permissions)
            {
                claims.Add(new Claim(ClaimTypes.Role, permission));
            }

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(authSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(authSettings.TokenTimeoutMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var secureToken = tokenHandler.CreateToken(tokenDescriptor);

            var strToken = tokenHandler.WriteToken(secureToken);

            return strToken;
        }


        public async Task<User> GetByIdAsync(int userId)
        {
            var retVal = await dbContext.Users.Include(u => u.Role).SingleOrDefaultAsync(u => u.Id == userId);

            if (retVal.Role.Id == AppConstants.SUPER_USER_ROLE_ID)
            {
                retVal.Role.Permissions = (ApplicationPermissions[])Enum.GetValues(typeof(ApplicationPermissions));
            }

            return retVal;
        }

        #region IDisposable implementation

        public void Dispose()
        {
            Dispose(true);

            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing && dbContext != null)
            {
                dbContext.Dispose();
            }
        }

        #endregion
    }
}
