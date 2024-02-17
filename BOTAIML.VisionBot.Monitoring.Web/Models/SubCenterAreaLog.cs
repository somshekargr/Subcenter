using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public class SubCenterAreaLog
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public AreaName Name { get; set; }
        public DoorStatus? DoorStatus { get; set; }

        [ForeignKey(nameof(Person))]
        public int? PersonId { get; set; }

        [Required]
        public DateTime Time { get; set; }
        public TrackingStatus? Status { get; set; }
        public float? Probability { get; set; }
        public PowerStatus? PowerStatus { get; set; }
        public int CameraId { get; set; }
        public bool IsAlertRequired { get; set; }

        public bool IsAlertSent { get; set; }

        public virtual Person Person { get; set; }

    }
}