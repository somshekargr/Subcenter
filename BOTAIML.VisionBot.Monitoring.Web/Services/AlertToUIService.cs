using BOTAIML.VisionBot.Monitoring.Web.Hubs;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace BOTAIML.VisionBot.Monitoring.Web.Services
{
    public class AlertToUIService
    {
        private readonly IHubContext<AlertHub> _hubContext;


        public AlertToUIService(IHubContext<AlertHub> _hubContext)
        {
            this._hubContext = _hubContext;
        }

        public async Task<AlertServiceResultViewModel> SendRequest(AlertUIViewModel avm)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveOne", avm.area, avm.message, avm.level);
            var result = new AlertServiceResultViewModel
            {
                Success = true,
                Error = string.Empty
            };
            return (result);
        }
    }
}
