using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Hubs
{
    public class AlertHub : Hub
    {
        public Task SendMessage1(string area, string message, string level)               
        {
            return Clients.All.SendAsync("ReceiveOne", area, message , level);   
        }
    }
}
