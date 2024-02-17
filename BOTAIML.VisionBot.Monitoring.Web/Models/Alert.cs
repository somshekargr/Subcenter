using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public class Alert
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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
        public string Base64Data { get; set; }

    }
}
