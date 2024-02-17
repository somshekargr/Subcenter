using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class SubCenterAreaViewModel
    {
        [Required]
        public AreaName Name { get; set; }
        public DoorStatus? DoorStatus { get; set; }
        public int? PersonId { get; set; }
        public DateTime Time { get; set; }
        public float? Probability { get; set; }
        public PowerStatus? PowerStatus { get; set; }
        public TrackingStatus? TrackingStatus { get; set; }
        [Required]
        public int CameraId { get; set; }
        [Required]
        public bool IsAlertRequired { get; set; }
        public AlertContentType ContentType { get; set; }
        public AlertType Type { get; set; }
        public AlertLevel Level { get; set; }
        public string Message { get; set; }
        public string MediaFilePath { get; set; }
        public string Base64Data { get; set; }
    }
}
