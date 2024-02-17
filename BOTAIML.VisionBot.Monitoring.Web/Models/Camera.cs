using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public class Camera
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string CameraCode { get; set; }

        public bool IsEnabled { get; set; }

        public CameraComponentStatus CameraStatus { get; internal set; }

        public DateTime CameraStatusUpdatedOn { get; internal set; }

    }

    public enum CameraComponentStatus
    {
        Running,
        Stopped
    }
}
