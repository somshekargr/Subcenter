using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels.Authorization
{
    public class SelectListItem
    {
        /// <summary>
        /// Class for the 
        /// </summary>
        public SelectListItem()
        {
            Selected = false;
        }

        public bool Selected { get; set; }
        public string Label { get; set; }
        public string Value { get; set; }
    }
}
