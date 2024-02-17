using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Constants;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public RolesController(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [ProducesResponseType(typeof(PaginatedAndSortedResult<RoleViewModel>), 200)]
        [Route("GetRoles")]
        [CheckPermission(ApplicationPermissions.UserRead)]
        public async Task<IActionResult> GetRoles([FromQuery] PaginatedAndSortedResult paginationAndSortParams)
        {
            var roles = dbContext.Roles
                                 .Select(r => new RoleViewModel
                                 {
                                     Id = r.Id,
                                     Name = r.Name,
                                     Permissions = r.Permissions,
                                     ReportPermissions = r.ReportPermissions,
                                     Users = r.Users.Select(u => u.Name)
                                 });

            Expression<Func<RoleViewModel, bool>> globalFilter = null;

            var searchString = paginationAndSortParams.SearchString?.ToLower();

            if (!string.IsNullOrEmpty(searchString))
            {
                searchString = searchString.Trim();
            }

            globalFilter = c => c.Name.ToLower().Contains(searchString);

            Expression<Func<RoleViewModel, object>> keySelector = null;

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

            var data = await paginationAndSortParams.Apply(roles, globalFilter, keySelector);

            return Ok(data);
        }

        [HttpGet]
        [Route(nameof(GetRole) + "/{id}")]
        [ProducesResponseType(typeof(RoleViewModel), 200)]
        [CheckPermission(ApplicationPermissions.RoleRead)]
        public async Task<IActionResult> GetRole(int id)
        {
            var role = await dbContext.Roles
                                      .Select(r => new RoleViewModel
                                      {
                                          Id = r.Id,
                                          Name = r.Name,
                                          Permissions = r.Permissions,
                                          ReportPermissions = r.ReportPermissions,
                                          Users = r.Users.Select(u => u.Name)
                                      })
                                      .SingleOrDefaultAsync(r => r.Id == id);

            if (role.Id == AppConstants.SUPER_USER_ROLE_ID)
            {
                role.Permissions = Enum.GetValues(typeof(ApplicationPermissions))
                                       .Cast<ApplicationPermissions>()
                                       .ToArray();

                role.ReportPermissions = await dbContext.Reports
                                                      .Where(r => r.IsActive)
                                                      .Select(r => r.Id)
                                                      .ToArrayAsync();

            }

            return Ok(role);
        }

        [HttpGet]
        [Route(nameof(GetApplicationPermissions))]
        [ProducesResponseType(typeof(PermissionsDisplayViewModel), 200)]
        public async Task<IActionResult> GetApplicationPermissions()
        {
            var appPermissions = PermissionViewModel.GetPermissionsForDisplay<ApplicationPermissions>();

            var reports = await dbContext.Reports
                                       .Where(r => r.IsActive)
                                       .Select(r => new ReportPermissionViewModel(r.Id, r.Name, r.Description))
                                       .ToArrayAsync();
            return Ok(new PermissionsDisplayViewModel
            {
                ApplicationPermissions = appPermissions,
                Reports = reports
            });
        }

        [HttpGet]
        [Route(nameof(DoesRoleExist))]
        [ProducesResponseType(typeof(bool), 200)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Globalization", "CA1304:Specify CultureInfo")]
        public IActionResult DoesRoleExist(int curRoleId, string roleName)
        {
            var exists = dbContext.Roles.Any(r => r.Id != curRoleId && r.Name.ToLower().Trim() == roleName.ToLower().Trim());

            return Ok(exists);
        }

        [HttpPost]
        [Route(nameof(AddRole))]
        [ProducesResponseType(typeof(int), 200)]
        [CheckPermission(ApplicationPermissions.RoleCreate)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Globalization", "CA1304:Specify CultureInfo")]
        public async Task<IActionResult> AddRole([FromBody][Bind(nameof(Role.Name), nameof(Role.Permissions))] RoleViewModel roleVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var isExists = dbContext.Roles.Any(u => u.Name.ToLower().Trim() == roleVM.Name.ToLower().Trim());

                if (isExists)
                    return BadRequest($"Role name {roleVM.Name} already exists!. Use a different name.");

                //First add the user to database
                var entry = dbContext.Roles.Add(new Role
                {
                    Name = roleVM.Name,
                    Permissions = roleVM.Permissions,
                    ReportPermissions = roleVM.ReportPermissions

                });

                await dbContext.SaveChangesAsync();

                return Ok(entry.Entity.Id);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Internal Server Error");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route(nameof(EditRole))]
        [CheckPermission(ApplicationPermissions.RoleUpdate)]
        [ProducesResponseType(200)]
        public async Task<IActionResult> EditRole([Bind(nameof(Role.Id), nameof(Role.Name), nameof(Role.Permissions))] RoleViewModel roleVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var role = await dbContext.Roles.SingleOrDefaultAsync(r => r.Id == roleVM.Id);

                if (role == null)
                    return BadRequest(roleVM.Id);

                role.Name = roleVM.Name;
                role.Permissions = roleVM.Permissions;
                role.ReportPermissions = roleVM.ReportPermissions;

                dbContext.Update(role);

                await dbContext.SaveChangesAsync();

                return Ok();
            }

            catch (Exception ex)
            {
                Console.WriteLine("Internal Server Error");
                return BadRequest(ex.Message);
            }

        }

        [AllowAnonymous]
        [HttpGet]
        [Route("HasPermission")]
        [ProducesResponseType(typeof(bool), 200)]

        public async Task<IActionResult> HasPermission([FromRoute] string faceIndexId, string permission)
        {
            var faceData = dbContext.FaceData.Where(f => f.FaceIndexId == faceIndexId).FirstOrDefault();
            if (faceData == null)
            {
                return Ok(false);
            }
            var enrolment = dbContext.Enrolments.Include(e => e.Role).Include(e => e.Role.Permissions).Where(e => e.PersonId == faceData.PersonId).FirstOrDefault();

            Console.WriteLine(enrolment);

            var permissions = new List<string>();

            if (enrolment.Role.Id == AppConstants.SUPER_USER_ROLE_ID)
            {
                foreach (ApplicationPermissions permissionData in Enum.GetValues(typeof(ApplicationPermissions)))
                    permissions.Add(permissionData.ToString());
            }
            else
            {
                if (enrolment.Role.Permissions != null)
                {
                    foreach (var permissionData in enrolment.Role.Permissions)
                        permissions.Add(permissionData.ToString());
                }

                Console.Write("Finding an role in the list...\n");
                if (permissions.Contains(permission.Trim()))
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetAllPemissions")]
        [ProducesResponseType(typeof(List<string>), 200)]
        public async Task<IActionResult> GetAllPemissions(string faceIndexId)
        {
            var faceData = dbContext.FaceData.Where(f => f.FaceIndexId == faceIndexId).FirstOrDefault();
            if (faceData == null)
            {
                return BadRequest($"No face data found for the faceIndex {faceIndexId}");
            }
            var enrolment = dbContext.Enrolments.Include(e => e.Role).Include(e => e.Role.Permissions).Where(e => e.PersonId == faceData.PersonId).FirstOrDefault();

            Console.WriteLine(enrolment);

            var permissions = new List<string>();

            if (enrolment.Role.Id == AppConstants.SUPER_USER_ROLE_ID)
            {
                foreach (ApplicationPermissions permissionData in Enum.GetValues(typeof(ApplicationPermissions)))
                    permissions.Add(permissionData.ToString());
            }
            else
            {
                if (enrolment.Role.Permissions != null)
                {
                    foreach (var permissionData in enrolment.Role.Permissions)
                        permissions.Add(permissionData.ToString());
                }
            }

            return Ok(permissions);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetPersonPermissionViewModel")]
        [ProducesResponseType(typeof(PersonPermissionViewModel), 200)]
        [ProducesResponseType(404)]
        public IActionResult GetPersonPermissionViewModel(string faceIndexId, string permission)
        {
            var faceData = dbContext.FaceData.Where(f => f.FaceIndexId == faceIndexId).FirstOrDefault();
            if (faceData == null)
            {
                return NotFound();
            }
            var enrolment = dbContext.Enrolments.Include(e => e.Role).Where(e => e.PersonId == faceData.PersonId).FirstOrDefault();

            Console.WriteLine(enrolment);

            var permissions = new List<string>();

            if (enrolment.Role.Id == AppConstants.SUPER_USER_ROLE_ID)
            {
                foreach (ApplicationPermissions permissionData in Enum.GetValues(typeof(ApplicationPermissions)))
                    permissions.Add(permissionData.ToString());
            }
            else
            {
                if (enrolment.Role.Permissions != null)
                {
                    foreach (var permissionData in enrolment.Role.Permissions)
                        permissions.Add(permissionData.ToString());
                }

                Console.Write("Finding an role in the list...\n");
                var vm = new PersonPermissionViewModel
                {
                    Name = enrolment.Name,
                    PermitTimeMinute = enrolment.PermitTimeMinute,
                    EmployeeId = enrolment.EmployeeId,
                    Permission = new SpecificPermissionViewModel
                    {
                        PermissionName = permission,
                        HasPermission = permissions.Contains(permission.Trim())
                    }
                };

                return Ok(vm);
            }

            return Ok();
        }
    }
}
