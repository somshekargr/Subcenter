using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Constants;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.Utils;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using System.Linq.Expressions;
using BOTAIML.VisionBot.Monitoring.Web.Services;

namespace BOTAIML.VisionBot.Monitoring.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly UserResolverService userResolverService;

        public UsersController(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
            this.userResolverService = userResolverService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(PaginatedAndSortedResult<UserViewModel>), 200)]
        [Route("GetUser")]
        [CheckPermission(ApplicationPermissions.UserRead)]
        public async Task<IActionResult> GetUser([FromQuery] PaginatedAndSortedResult paginationAndSortParams)
        {
            var users = dbContext.Users
                                 .Select(u => new UserViewModel
                                 {
                                     Id = u.Id,
                                     Name = u.Name,
                                     RoleName = u.Role.Name,
                                     Permissions = u.Permissions,
                                     Username = u.Username
                                 });

            Expression<Func<UserViewModel, bool>> globalFilter = null;

            var searchString = paginationAndSortParams.SearchString?.ToLower();

            if (!string.IsNullOrEmpty(searchString))
            {
                searchString = searchString.Trim();
            }

            var isNumber = double.TryParse(searchString, out var number);

            if (isNumber)
                globalFilter = c => c.Username.Contains(searchString);
            else
                globalFilter = c => c.Name.ToLower().Contains(searchString);

            Expression<Func<UserViewModel, object>> keySelector = null;

            switch (paginationAndSortParams.SortField?.ToLowerInvariant())
            {
                case "name":
                    keySelector = cw => cw.Name;
                    break;
                case "id":
                    keySelector = cw => cw.Id;
                    break;
                default:
                    keySelector = cw => cw.Id;
                    break;
            }

            var data = await paginationAndSortParams.Apply(users, globalFilter, keySelector);

            return Ok(data);

        }

        [AllowAnonymous]
        [HttpPost("authenticate"), ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> Authenticate(
            [FromBody] LoginViewModel loginVM,
            [FromServices] UserAuthorizationService userAuthService
        )
        {
            var token = await userAuthService.AuthenticateAsync(loginVM.Username, loginVM.Password);

            if (string.IsNullOrWhiteSpace(token))
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(token);
        }

        [HttpGet, ProducesResponseType(typeof(bool), 200)]
        [Route("UserNameExist")]

        public IActionResult CheckIfUserNameExist(string userName)
        {
            if (String.IsNullOrEmpty(userName))
            {
                return BadRequest("User Name is null or empty");
            }

            var doesUserNameExist = dbContext.Users.Any(e => e.Username.ToLower().Trim() == userName.ToLower().Trim());

            if (!doesUserNameExist)
                return Ok(false);
            else
                return Ok(true);

        }

        [HttpPost, ProducesResponseType(typeof(SaveUserResultViewModel), 200)]
        //[CheckPermission(ApplicationPermissions.UserCreate)]
        [Route("NewUser")]
        public async Task<IActionResult> NewUser(NewUserViewModel userVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newUser = userVM.ToModel();
            newUser.Password = string.Empty;

            await dbContext.Users.AddAsync(newUser);

            await dbContext.SaveChangesAsync();

            // Now set the password hash with user id as the salt
            newUser.Password = HashingUtils.Hash(userVM.PasswordInfo.Password, newUser.Id);

            // Finally save again with the final hashed password to user entity
            await dbContext.SaveChangesAsync();

            return Ok(new SaveUserResultViewModel
            {
                UserId = newUser.Id,
            });
        }

        [HttpPut, ProducesResponseType(typeof(SaveUserResultViewModel), 200)]
        [CheckPermission(ApplicationPermissions.UserUpdate)]
        [Route("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserViewModel userVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Id == userVM.Id);

            userVM.UpdateModel(user);

            await dbContext.SaveChangesAsync();

            return Ok(new SaveUserResultViewModel
            {
                UserId = user.Id,

            });
        }

        [HttpPost]
        [Route("ChangePassword")]
        [CheckPermission(ApplicationPermissions.UserUpdate)]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel changePasswordVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await dbContext.Users.SingleOrDefaultAsync(x => x.Id == changePasswordVM.UserId);

            // return null if user not found
            if (user == null)
                return NotFound();

            var isOldPasswordValid = HashingUtils.IsStringEqualToHash(user.Password, user.Id, changePasswordVM.OldPassword);

            if (!isOldPasswordValid)
                return Unauthorized("Old password provided is not valid!");

            user.Password = HashingUtils.Hash(changePasswordVM.Password, user.Id);

            await dbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost]
        [Route("ResetPassword")]
        [CheckPermission(ApplicationPermissions.UserUpdate)]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel resetPasswordViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await dbContext.Users.SingleOrDefaultAsync(x => x.Id == resetPasswordViewModel.UserId);

            // return null if user not found
            if (user == null)
                return NotFound();

            user.Password = HashingUtils.Hash(resetPasswordViewModel.Password, user.Id);

            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        [Route("GetRoles")]
        [CheckPermission(ApplicationPermissions.UserRead)]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await dbContext.Roles.Where(r => r.Id != AppConstants.SUPER_USER_ROLE_ID)
                                 .Select(r => new SelectListItem
                                 {
                                     Label = r.Name,
                                     Value = r.Id.ToString()
                                 }).ToArrayAsync();

            return Ok(roles);
        }


        [HttpGet]
        [Route("{id}"), ProducesResponseType(typeof(AddEditUserViewModel), 200)]
        [CheckPermission(ApplicationPermissions.UserRead)]
        public async Task<IActionResult> GetUserDetails([FromRoute] int? id)
        {
            User user = null;

            if (id.HasValue && id.Value > 0)
            {
                user = await dbContext.Users
                                      .Include(u => u.Role)
                                      .SingleOrDefaultAsync(u => u.Id == id.Value);

                if (user == null)
                    return NotFound(id);
            }

            var retVal = new AddEditUserViewModel
            {
                Roles = DropDownListItem.ForModel(dbContext.Roles, t => new DropDownListItem { Value = t.Id.ToString(), Label = t.Name }),
                User = UserViewModel.FromModel(user)
            };

            return Ok(retVal);
        }

        [HttpGet]
        [Route(nameof(GetUserDetailsByUsername))]
        [ProducesResponseType(typeof(UserViewModel), 200)]
        [CheckPermission(ApplicationPermissions.UserRead)]
        public async Task<IActionResult> GetUserDetailsByUsername([FromQuery] string username)
        {
            var user = await dbContext.Users
                                   .Include(u => u.Role)
                                   .SingleOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return NotFound(username);

            var retVal = UserViewModel.FromModel(user);

            return Ok(retVal);
        }

        [HttpGet]
        [Route("GetUsersByRoleId")]
        [CheckPermission(ApplicationPermissions.UserRead)]
        public async Task<IActionResult> GetUsersByRoleId(int roleId)
        {
            var retVal = await dbContext.Users.Where(user => user.RoleId == roleId).Select(user => new SelectListItem()
            {
                Label = user.Name,
                Value = user.Id.ToString()
            }).ToListAsync();

            if (retVal != null)
                return Ok(retVal);

            return NotFound();
        }

        [HttpGet]
        [Route("GetUsers")]
        [CheckPermission(ApplicationPermissions.UserRead)]
        public IActionResult GetUsers()
        {
            var retVal = dbContext.Users.Include(user => user.Role)
                        .Select(user => new UserViewModel()
                        {
                            Id = user.Id,
                            Name = user.Name,
                            RoleId = user.RoleId,
                            Permissions = user.Role.Permissions,
                            RoleName = user.Role.Name,
                            Username = user.Username
                        }).ToList();

            if (retVal != null)
                return Ok(retVal);

            return NotFound();
        }

        [HttpGet]
        [Route("IsSuperUserOrNot")]
        [ProducesResponseType(typeof(bool), 200)]

        public  IActionResult IsSuperUserOrNot(int loggedInUserId)
        {
            if (loggedInUserId == 0)
            {
                return Ok(false);
            }

            var loggedInUser = dbContext.Users.Include(u => u.Role).FirstOrDefault(u => u.Id == loggedInUserId);

            if (loggedInUser.Role.Id == AppConstants.SUPER_USER_ROLE_ID)
            {
                return Ok(true);
            }
            return Ok(false);
        }

    }
}
