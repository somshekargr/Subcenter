using System;

namespace BOTAIML.VisionBot.Monitoring.Web.Models
{

    public abstract class ChangeTrackableEntity
    {
        public bool IsActive { get; set; }

        public DateTime CreatedOn { get; set; }

        public int CreatedBy { get; set; }

        public DateTime UpdatedOn { get; set; }

        public int UpdatedBy { get; set; }
    }
}
