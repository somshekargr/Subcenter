using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.Services;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using System.Collections;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using Microsoft.AspNetCore.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Constants;

namespace BOTAIML.VisionBot.Monitoring.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]

    public class EnrolmentController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly AppSettings appSettings;

        public EnrolmentController(AppDbContext dbContext, AppSettings appSettings)
        {
            this.dbContext = dbContext;
            this.appSettings = appSettings;
        }

        [HttpGet]
        [CheckPermission(ApplicationPermissions.EnrolmentRead)]
        [ProducesResponseType(typeof(PaginatedAndSortedResult<EnrolmentViewModel>), 200)]
        public async Task<IActionResult> GetEnrolment([FromQuery] PaginatedAndSortedResult paginationAndSortParams)
        {
            var enrolments = dbContext.Enrolments
                .Select(u => new EnrolmentViewModel
                {
                    Id = u.Id,
                    Name = u.Name,
                    EmployeeId = u.EmployeeId,
                    DateOfBirth = u.DateOfBirth,
                    MobileNumber = u.MobileNumber,
                    PermitTimeMinute = u.PermitTimeMinute,
                    RoleName = u.Role.Name,
                });

            Expression<Func<EnrolmentViewModel, bool>> globalFilter = null;

            var searchString = paginationAndSortParams.SearchString; //?.ToLower();

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                var isNumber = double.TryParse(searchString, out var number);

                searchString = $"%{searchString}%";

                if (isNumber)
                {
                    globalFilter = c => EF.Functions.ILike(c.MobileNumber, searchString) || EF.Functions.ILike(c.EmployeeId, searchString);
                }
                else
                {
                    globalFilter = c => EF.Functions.ILike(c.Name, searchString) || EF.Functions.ILike(c.EmployeeId, searchString) || EF.Functions.ILike(c.RoleName, searchString);
                }
            }

            Expression<Func<EnrolmentViewModel, object>> keySelector = null;

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

            var data = await paginationAndSortParams.Apply(enrolments, globalFilter, keySelector);
            return Ok(data);
        }


        [HttpGet]
        [Route("GetEnrolmentDetails/{id}"), ProducesResponseType(typeof(AddEditEnrolmentViewModel), 200)]
        [CheckPermission(ApplicationPermissions.EnrolmentRead)]
        public async Task<IActionResult> GetEnrolmentDetails([FromRoute] int? id)
        {
            Enrolment enrolment = null;

            if (id.HasValue && id.Value > 0)
            {
                enrolment = await dbContext.Enrolments
                                      .Include(e => e.Role)
                                      .Include(e => e.Person.FaceData)
                                      .SingleOrDefaultAsync(e => e.Id == id.Value);

                if (enrolment == null)
                    return NotFound(id);
            }

            var retVal = new AddEditEnrolmentViewModel
            {
                Roles = DropDownListItem.ForModel(dbContext.Roles, t => new DropDownListItem { Value = t.Id.ToString(), Label = t.Name }),
                Enrolment = EnrolmentViewModel.FromModel(enrolment)
            };

            return Ok(retVal);
        }



        [HttpPost, ProducesResponseType(typeof(SaveEnrolmentResultViewModel), 200)]
        [CheckPermission(ApplicationPermissions.EnrolmentCreate)]
        [Route("NewEnrolment")]
        public async Task<IActionResult> NewEnrolment(EnrolmentViewModel enrolmentViewModelVM,
            [FromServices] FaceDataService enrolFaceDataService)

        {
            try
            {
                var model = enrolmentViewModelVM.ToModel();

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                model.Person = new Person();

                await dbContext.Enrolments.AddAsync(model);
                await dbContext.SaveChangesAsync();

                var faceEnrolmentResult = new FaceDataServiceResultViewModel(); ;

                if (enrolmentViewModelVM.IsFaceCaptured)
                {
                    var faceImages = enrolmentViewModelVM.Person.FaceImages.Select(vm => vm.Image).ToArray();
                    var requestViewModel = new List<EnrolRequest>();

                    int id = 0;
                    foreach (var image in faceImages)
                    {
                        requestViewModel.Add(new EnrolRequest
                        {
                            Id = id++,
                            Image = image
                        });
                    }

                    EnrolRequestViewModel evm = new EnrolRequestViewModel
                    {
                        PersonId = model.PersonId,
                        EnrolRequests = requestViewModel

                    };

                    faceEnrolmentResult = await enrolFaceDataService.Enrol(evm);
                    if (faceEnrolmentResult.Success == true)
                    {
                        var faceDataList = GetFaceDataModelFromVM(model.PersonId, faceEnrolmentResult.Data, requestViewModel);

                        dbContext.FaceData.AddRange(faceDataList);
                        dbContext.SaveChanges();

                    }
                    else
                    {
                        return BadRequest(new SaveEnrolmentResultViewModel
                        {
                            Id = model.Id,
                            FaceEnrolmentResult = null,
                            Error = faceEnrolmentResult.Error,
                        });
                    }
                }

                return Ok(new SaveEnrolmentResultViewModel
                {
                    Id = model.Id,
                    FaceEnrolmentResult = faceEnrolmentResult,
                    Error = string.Empty
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        protected string SavePersonImageToDisc(byte[] base64, int personId, string basePath)
        {
            var today = DateTime.Now;
            var guid = Guid.NewGuid();

            var path = Path.Combine(basePath, today.Year.ToString(), today.Month.ToString("D2"),
                            today.Day.ToString("D2"), personId.ToString("D2"));

            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            var FileName = $@"{Guid.NewGuid()}.jpg";
            path = Path.Combine(path, FileName);

            System.IO.File.WriteAllBytesAsync(path, base64);

            return path;
        }

        [HttpPost, ProducesResponseType(typeof(SaveEnrolmentResultViewModel), 200)]
        [Route("UpdateEnrolment")]
        [CheckPermission(ApplicationPermissions.EnrolmentUpdate)]
        public async Task<IActionResult> UpdateEnrolment(EnrolmentViewModel enrolmentViewModelVM,
            [FromServices] FaceDataService enrolFaceDataService)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var model = dbContext.Enrolments.FirstOrDefault(e => e.PersonId == enrolmentViewModelVM.Person.PersonId);
                if (model == null)
                    return BadRequest(model);
                model.MobileNumber = enrolmentViewModelVM.MobileNumber;
                model.Name = enrolmentViewModelVM.Name;
                model.EmployeeId = enrolmentViewModelVM.EmployeeId;
                model.PermitTimeMinute = enrolmentViewModelVM.PermitTimeMinute;
                model.DateOfBirth = enrolmentViewModelVM.DateOfBirth;
                model.RoleId = enrolmentViewModelVM.RoleId;
                dbContext.Enrolments.Update(model);
                dbContext.SaveChanges();

                var faceEnrolmentResult = new FaceDataServiceResultViewModel();
                var faceDeleteResult = new FaceEnrolmentImageDeleteResultViewModel();

                if (enrolmentViewModelVM.IsFaceCaptured)
                {
                    var faceImages = enrolmentViewModelVM.Person.FaceImages.Select(vm => vm.Image).ToArray();

                    var requestViewModel = new List<EnrolRequest>();


                    int id = 1;
                    foreach (var image in faceImages)
                    {
                        requestViewModel.Add(new EnrolRequest
                        {
                            Id = id++,
                            Image = image
                        });

                    }

                    var faceDatas = dbContext.FaceData.Where(a => a.PersonId == model.PersonId).ToList();
                    var faceIndexIds = faceDatas.Select(f => f.FaceIndexId).ToList();
                    var imagePathToDelete = faceDatas.Select(f => f.ImagePath).ToList();
                    if (faceIndexIds.Count > 0)
                    {
                        faceDeleteResult = await enrolFaceDataService.Delete(faceIndexIds);
                    }

                    // Delete PersonImages from Disc
                    imagePathToDelete.ForEach(path => DeletePersonImageFromDisc(path));

                    //Delete facedata from Database
                    dbContext.FaceData.RemoveRange(faceDatas);
                    dbContext.SaveChanges();

                    EnrolRequestViewModel evm = new EnrolRequestViewModel
                    {
                        PersonId = model.PersonId,
                        EnrolRequests = requestViewModel
                    };

                    faceEnrolmentResult = await enrolFaceDataService.Enrol(evm);
                    if (faceEnrolmentResult.Success == true)
                    {
                        var faceDataList = GetFaceDataModelFromVM(model.PersonId, faceEnrolmentResult.Data, requestViewModel);
                        dbContext.FaceData.AddRange(faceDataList);
                        dbContext.SaveChanges();
                    }
                    else
                    {
                        return BadRequest(new SaveEnrolmentResultViewModel
                        {
                            Id = model.Id,
                            FaceEnrolmentResult = null,
                            Error = faceEnrolmentResult.Error,
                        });
                    }
                }

                return Ok(new SaveEnrolmentResultViewModel
                {
                    Id = model.Id,
                    FaceEnrolmentResult = faceEnrolmentResult
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        private List<FaceData> GetFaceDataModelFromVM(int personId, List<EnrolmentServiceResultViewModel> data, List<EnrolRequest> requestsVM)
        {
            var faceDataList = new List<FaceData>();
            foreach (var face in data)
            {
                var faceData = new FaceData
                {
                    Id = 0,
                    PersonId = personId
                };
                faceData.Encoding = face.embeddings;
                var b64 = requestsVM.Find(r => r.Id == face.image_id).Image;
                var base64data = Convert.FromBase64String(b64);
                var imageBasePath = appSettings.DefaultFaceImagePath;
                faceData.ImagePath = SavePersonImageToDisc(base64data, personId, imageBasePath);
                faceData.FaceIndexId = face.indexid;
                faceDataList.Add(faceData);
            }

            return faceDataList;
        }

        private void DeletePersonImageFromDisc(string path)
        {
            if ((System.IO.File.Exists(path)))
            {
                System.IO.File.Delete(path);
            }
        }

        [CheckPermission(ApplicationPermissions.EnrolmentRead)]
        [HttpPost]
        [Route("GetPersonDetails")]
        [ProducesResponseType(200, Type = typeof(PersonDetailsViewModel))]
        public IActionResult GetPersonDetails(PersonDetailsViewModel personDetailsRequestVM)
        {
            var faceData = dbContext.FaceData.Where(f => f.FaceIndexId == personDetailsRequestVM.FaceIndexId).FirstOrDefault();
            if (faceData == null)
            {
                return null;
            }
            var enrolment = dbContext.Enrolments.Where(e => e.PersonId == faceData.PersonId).FirstOrDefault();

            return Ok(new PersonDetailsViewModel
            {
                Name = enrolment.Name,
                PermitTimeMinute = enrolment.PermitTimeMinute
            });
        }

        [AllowAnonymous]
        [HttpDelete, ProducesResponseType(200)]
        [Route("DeleteFaceData")]
        public async Task<IActionResult> DeleteFaceData(int faceId,
            [FromServices] FaceDataService enrolFaceDataService)
        {
            var faceData = await dbContext.FaceData.FirstOrDefaultAsync(f => f.Id == faceId);
            if (faceData == null)
            {
                return BadRequest($"No record found for the face Id {faceId}.");
            }
            else
            {
                var faceDeleteResult = new FaceEnrolmentImageDeleteResultViewModel();
                var faceIndexId = new List<string> { faceData.FaceIndexId };
                faceDeleteResult = await enrolFaceDataService.Delete(faceIndexId);

                if (faceDeleteResult.Success)
                {
                    if (!string.IsNullOrEmpty(faceData.ImagePath))
                    {
                        DeletePersonImageFromDisc(faceData.ImagePath);
                    }

                    dbContext.FaceData.Remove(faceData);
                    await dbContext.SaveChangesAsync();
                }

            }

            return Ok();
        }

        [HttpGet]
        [Route("GetEnrolments")]
        [CheckPermission(ApplicationPermissions.EnrolmentRead)]
        public IActionResult GetEnrolments()
        {
            var retVal = dbContext.Enrolments.Include(enrolment => enrolment.Role)
                        .Select(enrolment => new EnrolmentViewModel()
                        {
                            Id = enrolment.Id,
                            Name = enrolment.Name,
                            EmployeeId = enrolment.EmployeeId,
                            RoleId = enrolment.RoleId,
                            Permissions = enrolment.Role.Permissions,
                            RoleName = enrolment.Role.Name,
                        }).ToList();

            if (retVal != null)
                return Ok(retVal);

            return NotFound();
        }


        [HttpGet, ProducesResponseType(typeof(bool), 200)]
        [Route("EmployeeIdExist")]

        public IActionResult CheckIfEmployeeIdExist(string employeeId)
        {
            if (String.IsNullOrEmpty(employeeId))
            {
                return BadRequest("Employee Id is null or empty");
            }

            var doesEmpExist = dbContext.Enrolments.Any(e => e.EmployeeId == employeeId);

            if (!doesEmpExist)
                return Ok(false);
            else
                return Ok(true);

        }

        [HttpDelete()]
        [Route("DeleteEnrolment")]
        [CheckPermission(ApplicationPermissions.EnrolmentDelete)]
        public async Task<IActionResult> DeleteEnrolment(int id, [FromServices] FaceDataService enrolFaceDataService)
        {
            Enrolment enrolment = dbContext.Enrolments.Find(id);
            Person people = dbContext.People.FirstOrDefault(p => p.Id == enrolment.PersonId);

            var faceDatas = dbContext.FaceData.Where(a => a.PersonId == enrolment.PersonId).ToList();
            if (faceDatas != null)
            {
                var faceDeleteResult = new FaceEnrolmentImageDeleteResultViewModel();
                var faceIndexIds = faceDatas.Select(f => f.FaceIndexId).ToList();
                var imagePathToDelete = faceDatas.Select(f => f.ImagePath).ToList();
                if (faceIndexIds.Count > 0)
                {
                    faceDeleteResult = await enrolFaceDataService.Delete(faceIndexIds);
                }

                // Delete PersonImages from Disc
                imagePathToDelete.ForEach(path => DeletePersonImageFromDisc(path));

                //Delete facedata from Database
                dbContext.FaceData.RemoveRange(faceDatas);
                dbContext.SaveChanges();

            }

            if (enrolment != null && people != null)
            {
                dbContext.Enrolments.Remove(enrolment);
                dbContext.People.Remove(people);
                await dbContext.SaveChangesAsync();
            }
            else
            {
                return BadRequest("Enroler id is not found");
            }

            return Ok();
        }
    }

}
