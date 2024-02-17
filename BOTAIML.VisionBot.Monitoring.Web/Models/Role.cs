using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Constants;

namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    [Table(nameof(Role))]
    public class Role
    {
        public Role()
        {
            Users = new HashSet<User>();
        }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Name { get; set; }

        public ApplicationPermissions[] Permissions { get; set; }

        public int[] ReportPermissions { get; set; }


        public virtual ICollection<User> Users { get; set; }
    }
}
