using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class AuthorisedUserEntryViewModel
    {
        [Required]
        public PersonIdentification Category { get; set; }

        [Required]
        public double Probability { get; set; }

        [Required]
        public DateTime StartDateTime { get; set; }

        [Required]
        public DateTime EndDateTime { get; set; }

        [Required]
        public string Snapshot { get; set; }
    }
}
