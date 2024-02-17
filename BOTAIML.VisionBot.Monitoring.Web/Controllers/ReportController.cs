using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.Services;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly ILogger<ReportController> logger;

        private readonly AppDbContext dbContext;
        private readonly UserResolverService userResolverService;

        public ReportController(AppDbContext dbContext, UserResolverService userResolverService, ILogger<ReportController> logger)
        {
            this.dbContext = dbContext;
            this.userResolverService = userResolverService;
            this.logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(PaginatedAndSortedResult<ReportViewModel>), 200)]
        [CheckPermission(ApplicationPermissions.ReportRead)]
        [Route("GetReport")]
        public async Task<IActionResult> GetReport([FromQuery] PaginatedAndSortedResult paginationAndSortParams)
        {
            var reports = dbContext.Reports
                .Select(r => new ReportViewModel
                {
                    Id = r.Id,
                    Name = r.Name,
                    Description = r.Description,
                    ReportUrl = r.ReportUrl
                });

            Expression<Func<ReportViewModel, bool>> globalFilter = null;

            var searchString = paginationAndSortParams.SearchString; //?.ToLower();

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                searchString = $"%{searchString}%";

                if (!string.IsNullOrWhiteSpace(searchString))
                {
                    globalFilter = c => EF.Functions.ILike(c.Description, searchString);
                }
                else
                {
                    globalFilter = c => EF.Functions.ILike(c.Name, searchString);
                }
            }

            Expression<Func<ReportViewModel, object>> keySelector = null;

            switch (paginationAndSortParams.SortField?.ToLowerInvariant())
            {
                case "name":
                    keySelector = cw => cw.Name;
                    break;
                case "description":
                    keySelector = cw => cw.Description;
                    break;
                default:
                    keySelector = cw => cw.Name;
                    break;
            }
            var data = await paginationAndSortParams.Apply(reports, globalFilter, keySelector);
            return Ok(data);
        }


        [HttpGet]
        [Route("GetReportDetails/{id}"), ProducesResponseType(typeof(AddEditReportViewModel), 200)]
        [CheckPermission(ApplicationPermissions.ReportRead)]
        public async Task<IActionResult> GetReportDetails([FromRoute] int id)
        {
            Report report = null;
            if (id > 0)
            {
                report = await dbContext.Reports.Where(r => r.Id == id).FirstOrDefaultAsync();
                if (report == null)
                    return NotFound($" Report with the {id} not found.!");
            }
            var retVal = new AddEditReportViewModel
            {
                Report = ReportViewModel.FromModel(report)
            };
            return Ok(retVal);
        }


        [HttpPost, ProducesResponseType(typeof(Report), 200)]
        [Route("AddNewReport")]
        [CheckPermission(ApplicationPermissions.ReportCreate)]
        public async Task<IActionResult> AddNewReport(ReportViewModel reportViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var newReport = reportViewModel.ToModel();
                await dbContext.Reports.AddAsync(newReport);
                await dbContext.SaveChangesAsync();

                return Ok(newReport);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Internal Server Error");
                return BadRequest(ex.Message);
            }
        }


        [HttpPut, ProducesResponseType(typeof(Report), 200)]
        [CheckPermission(ApplicationPermissions.ReportUpdate)]
        [Route("UpdateReport")]
        public IActionResult UpdateReport(ReportViewModel reportViewModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var reportData = dbContext.Reports.FirstOrDefault(r => r.Id == reportViewModel.Id);
                if (reportData == null)
                    return BadRequest(reportData);

                reportData.Description = reportViewModel.Description;
                reportData.Name = reportViewModel.Name;
                reportData.ReportUrl = reportViewModel.ReportUrl;

                dbContext.Reports.Update(reportData);
                dbContext.SaveChanges();

                return Ok(reportData);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Internal Server Error");
                return BadRequest(ex.Message);
            }
        }
    }
}
