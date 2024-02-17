using NHibernate.Util;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public class SystemLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public SystemLogSource Source { get; set; }

        [Required]
        public SystemLogCategory Category { get; set; }

        [Required]
        public SystemLogLevel LogLevel { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        public DateTime DateTimeStamp { get; set; }

        public bool IsArchived { get; set; }

        public int? ArchivedBy { get; set; }

        public DateTime? ArchivedOn { get; set; }

        [Column(TypeName = "jsonb")]
        public object AdditionalData { get; set; }

        [Required]
        public bool IsAlertRequired { get; set; }

        public bool IsAlertSent { get; set; }


        [Required]
        public string HostName { get; set; }

        [Required]
        public string IPAddress { get; set; }

        public DateTime RestoredOn { get; set; }
    }
}
