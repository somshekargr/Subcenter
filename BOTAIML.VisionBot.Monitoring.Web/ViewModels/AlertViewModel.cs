using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class AlertViewModel
    {
        public long Id { get; set; }

        [Required]
        public long LogId { get; set; }
        [Required]
        public AlertContentType ContentType { get; set; }

        [Required]
        public AlertLevel Level { get; set; }

        [Required]
        public AlertType Type { get; set; }

        [Required]
        public AreaName LogType { get; set; }

        [Required]
        public string Message { get; set; }
        public TrackingStatus? Event { get; set; }

        [Required]
        public DateTime DateTimeStamp { get; set; }
        public string MediaFilePath { get; set; }
        public string Image { get => GetBase64Data(MediaFilePath); }
        private string GetBase64Data(string snapShotPath)
        {
            if (ContentType == AlertContentType.Image)
            {
                string base64Data = null;
                string path = snapShotPath;
                if (!string.IsNullOrEmpty(path))
                {
                    string filepath = path;
                    if (System.IO.File.Exists(filepath))
                    {
                        byte[] file = System.IO.File.ReadAllBytes(filepath);
                        base64Data = Convert.ToBase64String(file);
                    }
                }
                return base64Data;
            }

            return null;

        }
    }
}
