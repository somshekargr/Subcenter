using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace BOTAIML.VisionBot.Monitoring.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class AlertController : Controller
    {
        private readonly AppDbContext dbContext;


        public AlertController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;

        }

        //[Route("GetSerializedData")]
        //[HttpGet]
        //public IActionResult GetSerializedData([FromBody] VideoDataMessageViewModel vm)
        //{
        //    var data = JsonConvert.SerializeObject(vm);
        //    return Ok(data);
        //}

        [HttpPost]
        [Route("GetAlerts")]
        [ProducesResponseType(typeof(PaginatedAndSortedResult<AlertViewModel>), 200)]
        [CheckPermission(ApplicationPermissions.AlertsRead)]
        public async Task<IActionResult> GetAlerts([FromBody] LogsPaginationAndSortParams @params)
        {
            var alerts = dbContext.Alerts
                .Select(u => new AlertViewModel
                {
                    Id = u.Id,
                    LogId = u.LogId,
                    ContentType = u.ContentType,
                    Level = u.Level,
                    Type = u.Type,
                    LogType = u.LogType,
                    Message = u.Message,
                    Event = u.Event,
                    DateTimeStamp = u.DateTimeStamp,
                    MediaFilePath = u.MediaFilePath,


                }).AsQueryable();

            var paginationAndSortParams = @params.PaginationAndSort;

            var today = DateTime.Now;

            var logsCount = alerts.Count();

            if (logsCount == 0)
            {
                var emptyLogList = new List<AlertViewModel>().ToArray();
                var retVal = new PaginatedAndSortedResult<AlertViewModel>(emptyLogList, 0); ;
                return Ok(retVal);
            }

            if (@params.Filter.Date == null && @params.Filter.Areas == null)
            {
                alerts = alerts.Where(a => a.DateTimeStamp.Date == today.Date).AsQueryable();

                var todaysRecordsCount = alerts.Count();

                if (todaysRecordsCount == 0)
                {
                    var lastLog = dbContext.Alerts.OrderByDescending(x => x.DateTimeStamp).FirstOrDefault();

                    //You might have applied the where clause, lets clear them
                    alerts = dbContext.Alerts.Where(a => a.DateTimeStamp.Date == lastLog.DateTimeStamp.Date).Select(u => new AlertViewModel
                    {
                        Id = u.Id,
                        LogId = u.LogId,
                        ContentType = u.ContentType,
                        Level = u.Level,
                        Type = u.Type,
                        LogType = u.LogType,
                        Message = u.Message,
                        Event = u.Event,
                        DateTimeStamp = u.DateTimeStamp,
                        MediaFilePath = u.MediaFilePath,
                    }).AsQueryable();
                }
            }

            if (@params.Filter.Date != null && @params.Filter.Areas == null)
            {
                alerts = alerts.Where(a => a.DateTimeStamp.Date == @params.Filter.Date.Value.Date).AsQueryable();

            }

            if (@params.Filter.Date != null && @params.Filter.Areas != null)
            {
                alerts = alerts.Where(a => a.DateTimeStamp.Date == @params.Filter.Date.Value.Date).AsQueryable();

                //If Area not null, then only filter further
                if (@params.Filter.Areas != null)
                {
                    alerts = alerts.Where(a => a.LogType == @params.Filter.Areas).AsQueryable();
                }
            }

            Expression<Func<AlertViewModel, bool>> globalFilter = null;

            var searchString = paginationAndSortParams.SearchString; //?.ToLower();

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                searchString = searchString.ToLower();

                var searchstring = $"%{searchString}%";

                var matchResult = GetMatchingTrackingStatus(searchString);


                if (matchResult.Item1)
                {
                    alerts = alerts.Where(l => l.Event == matchResult.Item2);
                }
                else
                {

                    var result = GetMatchingContentType(searchString);

                    if (result.Item1)
                    {
                        alerts = alerts.Where(l => l.ContentType == result.Item2);
                    }
                    else
                    {
                        globalFilter = c => EF.Functions.ILike(c.ContentType.ToString(), searchString);
                    }
                }

            }
            Expression<Func<AlertViewModel, object>> keySelector = null;

            switch (paginationAndSortParams.SortField?.ToLowerInvariant())
            {
                case "logtype":
                    keySelector = cw => cw.LogType;
                    break;
                case "contenttype":
                    keySelector = cw => cw.ContentType;
                    break;
                case "datetimestamp":
                    keySelector = cw => cw.DateTimeStamp;
                    break;
                default:
                    keySelector = cw => cw.DateTimeStamp;
                    break;
            }
            var data = await paginationAndSortParams.Apply(alerts, globalFilter, keySelector);

            return Ok(data);
        }

        private Tuple<bool, TrackingStatus> GetMatchingTrackingStatus(string trackingStatus)
        {
            var searchStrings = trackingStatus.Split(" ");
            if (searchStrings.Length > 1)
            {
                trackingStatus = string.Join("_", searchStrings).Trim();
            }

            foreach (TrackingStatus status in Enum.GetValues(typeof(TrackingStatus)))
                if (status.ToString().ToLower().Contains(trackingStatus))
                    return new Tuple<bool, TrackingStatus>(true, status);

            return new Tuple<bool, TrackingStatus>(false, TrackingStatus.None);
        }

        private Tuple<bool, AlertContentType> GetMatchingContentType(string alertContentType)
        {
            var searchStrings = alertContentType.Split(" ");
            if (searchStrings.Length > 1)
            {
                alertContentType = string.Join("_", searchStrings).Trim();
            }

            foreach (AlertContentType contentType in Enum.GetValues(typeof(AlertContentType)))
                if (contentType.ToString().ToLower().Contains(alertContentType))
                    return new Tuple<bool, AlertContentType>(true, contentType);

            return new Tuple<bool, AlertContentType>(false, AlertContentType.Image);
        }

    }
}
