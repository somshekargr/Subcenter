using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class PersonDetailsViewModel
    {
        [Required]
        public string FaceIndexId { get; set; }

        public string Name { get; set; }

        public int PermitTimeMinute { get; set; }
    }
}
