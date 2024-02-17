using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;



namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class AddEditReportViewModel
    {
        public ReportViewModel Report { get; set; }

    }

    public class ReportViewModel
    {

        public int Id { get; set; }

        [Required(ErrorMessage = "Please enter the  Name")]
        [StringLength(150, ErrorMessage = "Please enter a valid name with a maximum of 150 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; }

        [Required(ErrorMessage = "ReportUrl is required")]
        public string ReportUrl { get; set; }



        internal static ReportViewModel FromModel(Report report)
        {
            if (report == null)
                return new ReportViewModel();

            return new ReportViewModel
            {
                Id = report.Id,
                Name = report.Name,
                Description = report.Description,
                ReportUrl = report.ReportUrl,
            };
        }

        internal Report ToModel()
        {
            return new Report
            {
                Id = this.Id,
                Name = this.Name,
                Description = this.Description,
                ReportUrl = this.ReportUrl,
            };
        }




    }

}



