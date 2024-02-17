using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.Services;
using BOTAIML.VisionBot.Monitoring.Web.Utils;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Faces.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]

    public class SubCenterAreaLogsController : Controller
    {

        private readonly AppDbContext dbContext;
        private readonly TelegramService telegramService;
        private readonly AlertToUIService alertToUIService;
        private readonly AppSettings appSettings;

        public SubCenterAreaLogsController(AppDbContext dbContext, TelegramService telegramService, AlertToUIService alertToUIService, AppSettings appSettings)
        {
            this.dbContext = dbContext;
            this.telegramService = telegramService;
            this.alertToUIService = alertToUIService;
            this.appSettings = appSettings;
        }


        [HttpPost]
        [ProducesResponseType(typeof(PaginatedAndSortedResult<SubCenterAreaLog>), 200)]
        public async Task<IActionResult> GetSubCenterAreaLogs([FromBody] LogsPaginationAndSortParams @params)
        {

            var query = dbContext.SubCenterAreaLogs.AsQueryable();

            var paginationAndSortParams = @params.PaginationAndSort;

            var today = DateTime.Today;

            var logsCount = query.Count();

            if (logsCount == 0)
            {
                var emptyLogList = new List<SubCenterAreaLog>().ToArray();
                var retVal = new PaginatedAndSortedResult<SubCenterAreaLog>(emptyLogList, 0); ;
                return Ok(retVal);
            }

            if (@params.Filter.Date == null && @params.Filter.Areas == null)
            {
                query = query.Where(a => a.Time.Date == today.Date).AsQueryable();

                var todaysRecordsCount = query.Count();

                if (todaysRecordsCount == 0)
                {
                    var lastLog = dbContext.SubCenterAreaLogs.OrderByDescending(x => x.Time).FirstOrDefault();

                    //You might have applied the where clause, lets clear them
                    query = dbContext.SubCenterAreaLogs.Where(a => a.Time.Date == lastLog.Time.Date).AsQueryable();
                }
            }

            if (@params.Filter.Date != null && @params.Filter.Areas == null)
            {
                query = query.Where(a => a.Time.Date == @params.Filter.Date.Value.Date).AsQueryable();

            }

            if (@params.Filter.Date != null && @params.Filter.Areas != null)
            {
                query = query.Where(a => a.Time.Date == @params.Filter.Date.Value.Date).AsQueryable();

                //If Area not null, then only filter further
                if (@params.Filter.Areas != null)
                {
                    query = query.Where(a => a.Name == @params.Filter.Areas).AsQueryable();
                }
            }

            Expression<Func<SubCenterAreaLog, bool>> globalFilter = null;

            var searchString = paginationAndSortParams.SearchString; //?.ToLower();

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                searchString = searchString.ToLower();

                var searchstring = $"%{searchString}%";

                var matchResult = GetMatchingPowerStatus(searchString);

                if (matchResult.Item1)
                {
                    query = query.Where(l => l.PowerStatus == matchResult.Item2);
                }
                else
                {
                    var result = GetMatchingTrackingStatus(searchString);

                    if (result.Item1)
                    {
                        query = query.Where(l => l.Status == result.Item2);
                    }


                }


            }

            Expression<Func<SubCenterAreaLog, object>> keySelector = null;

            switch (paginationAndSortParams.SortField?.ToLowerInvariant())
            {
                case "time":
                    keySelector = cw => cw.Time;
                    break;
                case "name":
                    keySelector = cw => cw.Name;
                    break;
                default:
                    keySelector = cw => cw.Time;
                    break;
            }
            var subCenterAreaLog = query.Include(c => c.Person);
            var data = await paginationAndSortParams.Apply(subCenterAreaLog, globalFilter, keySelector);

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


        private Tuple<bool, PowerStatus> GetMatchingPowerStatus(string powerStatus)
        {
            var searchStrings = powerStatus.Split(" ");
            if (searchStrings.Length > 1)
            {
                powerStatus = string.Join("", searchStrings).Trim();
            }

            foreach (PowerStatus power in Enum.GetValues(typeof(PowerStatus)))
                if (power.ToString().ToLower().Contains(powerStatus))
                    return new Tuple<bool, PowerStatus>(true, power);

            return new Tuple<bool, PowerStatus>(false, PowerStatus.On);

        }


        [AllowAnonymous]
        [HttpPost]
        [Route("SubCenterAreaLogDetection")]
        [ProducesResponseType(typeof(long), 200)]
        public async Task<IActionResult> SubCenterAreaLogDetection(SubCenterAreaViewModel SubCenterAreaVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var log = new SubCenterAreaLog()
            {
                Id = 0,
                Name = SubCenterAreaVM.Name,
                PersonId = SubCenterAreaVM.PersonId,
                DoorStatus = SubCenterAreaVM.DoorStatus,
                Time = DateTime.Now,
                Probability = SubCenterAreaVM.Probability,
                Status = SubCenterAreaVM.TrackingStatus,
                CameraId = SubCenterAreaVM.CameraId,
                PowerStatus = SubCenterAreaVM.PowerStatus,
                IsAlertRequired = SubCenterAreaVM.IsAlertRequired
            };

            await dbContext.SubCenterAreaLogs.AddAsync(log);
            await dbContext.SaveChangesAsync();

            if (SubCenterAreaVM.IsAlertRequired == true)
            {
                byte[] base64data = null;
                string mediaBasePath = null;

                var alertLog = new Alert()
                {
                    Id = 0,
                    LogId = log.Id,
                    ContentType = SubCenterAreaVM.ContentType,
                    Level = SubCenterAreaVM.Level,
                    Type = SubCenterAreaVM.Type,
                    DateTimeStamp = DateTime.Now
                };

                TelegramViewModel tvm = new TelegramViewModel();

                if (SubCenterAreaVM.ContentType == AlertContentType.Image || SubCenterAreaVM.ContentType == AlertContentType.Video)
                {
                    tvm.ContentType = SubCenterAreaVM.ContentType;
                    tvm.AlertContentMeta = SubCenterAreaVM.Base64Data;
                    base64data = Convert.FromBase64String(SubCenterAreaVM.Base64Data);
                    mediaBasePath = appSettings.AlertMediaPath;
                    alertLog.MediaFilePath = await SaveAlertMediaToDiscAsync(base64data, SubCenterAreaVM.ContentType.ToString(), mediaBasePath);
                }
                else if (SubCenterAreaVM.ContentType == AlertContentType.Text)
                {
                    tvm.ContentType = SubCenterAreaVM.ContentType;
                    tvm.AlertContentMeta = "";
                }

                if (SubCenterAreaVM.Type == AlertType.Telegram)
                {
                    var result = dbContext.SubCenterAreaLogs.SingleOrDefault(b => b.Id == log.Id);

                    alertLog.LogType = SubCenterAreaVM.Name;
                    alertLog.Event = SubCenterAreaVM.TrackingStatus;
                    tvm.Event = alertLog.Event;

                    if (SubCenterAreaVM.ContentType == AlertContentType.Text)
                    {
                        tvm.Message = SubCenterAreaVM.Message + " at " + alertLog.LogType.ToString();
                        alertLog.Message = tvm.Message;
                    }
                    else if (SubCenterAreaVM.ContentType != AlertContentType.Text && SubCenterAreaVM.Message != null)
                    {
                        tvm.Message = SubCenterAreaVM.Message + "\n" + "--" + SubCenterAreaVM.Name.ToString();
                        alertLog.Message = tvm.Message;
                    }
                    else
                    {
                        tvm.Message = GetAlertMessage(SubCenterAreaVM.Level, SubCenterAreaVM.TrackingStatus.ToString(), alertLog.LogType);
                        alertLog.Message = tvm.Message;
                    }


                    AlertUIViewModel avm = new AlertUIViewModel
                    {
                        area = alertLog.LogType.ToString(),
                        message = alertLog.Event.ToString(),
                        level = alertLog.Level.ToString()
                    };

                    await alertToUIService.SendRequest(avm);
                    var res = telegramService.SendAlertToGroup(tvm);

                    log.IsAlertSent = true;
                    dbContext.SaveChanges();

                    await dbContext.Alerts.AddAsync(alertLog);
                    await dbContext.SaveChangesAsync();

                    return Ok();

                }
            }
            return Ok(log.Id);
        }

        protected string GetAlertMessage(AlertLevel level, string trackingStatus, AreaName name)
        {
            string message = null;
            if (level == AlertLevel.info)
            {
                message = "This is an information alert." + "\n" + trackingStatus + " detected in " + name.ToString();
            }
            else if (level == AlertLevel.warn)
            {
                message = "This is a warning alert." + "\n" + trackingStatus + " detected in " + name.ToString() +
                    "\n" + "Kindly Note: Action needs to be taken at the earliest";
            }
            else if (level == AlertLevel.error)
            {
                message = "This is a danger alert." + "\n" + trackingStatus + " detected in " + name.ToString() +
                    "\n" + "Kindly Note: Immediate Action needs to be taken";
            }
            return message;
        }

        protected async Task<string> SaveAlertMediaToDiscAsync(byte[] base64, string mediaContentType, string basePath)
        {
            var today = DateTime.Now;
            var FileName = "";
            var guid = Guid.NewGuid();

            var path = Path.Combine(basePath, mediaContentType, today.Year.ToString(), today.Month.ToString("D2"),
                            today.Day.ToString("D2"));

            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            if (mediaContentType == "Image")
            {
                FileName = $@"{Guid.NewGuid()}.jpg";
                path = Path.Combine(path, FileName);
            }
            else if (mediaContentType == "Video")
            {
                FileName = $@"{Guid.NewGuid()}.mp4";
                path = Path.Combine(path, FileName);
            }

            await System.IO.File.WriteAllBytesAsync(path, base64);

            return path;
        }
    }
}