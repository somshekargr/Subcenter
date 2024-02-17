using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.Services;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CameraController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public CameraController(AppDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpGet]
        [Route("GetCameraWiseStatus")]
        [ProducesResponseType(typeof(List<LiveStreamViewModel>), 200)]
        public IActionResult GetCameraWiseStatus()
        {
            var liveStreamViewModels = new List<LiveStreamViewModel>();
            var activeCameras = dbContext.Cameras.Where(l => l.IsEnabled).ToArray();

            if (activeCameras.Length > 0)
            {
                liveStreamViewModels = dbContext.Cameras
                                                .Select(l => new LiveStreamViewModel
                                                {
                                                    Id = l.Id,
                                                    CameraCode = l.CameraCode,
                                                    IsEnabled = l.IsEnabled,
                                                    CameraLiveStatus = new CameraLiveStatus { Status = CameraComponentStatus.Stopped },
                                                    CameraStatus = CameraComponentStatus.Stopped
                                                }).OrderBy(c => c.CameraCode)
                                                .ToList();
            }

            return Ok(liveStreamViewModels);
        }

    }
}
