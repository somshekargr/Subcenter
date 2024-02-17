using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BOTAIML.VisionBot.Monitoring.Web.Utils;
using BOTAIML.VisionBot.Monitoring.Web.Authorization;

namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public class User : ChangeTrackableEntity
    {
        public User()
        {
        }

        public User(int id, string username, string plainTextPassword)
        {
            Id = id;
            Username = username;
            Password = HashingUtils.Hash(plainTextPassword, id);
        }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Username { get; set; }

        public ApplicationPermissions[] Permissions { get; set; }

        [Required]
        public string Password { get; set; }

        [ForeignKey(nameof(Role))]
        public int RoleId { get; set; }

        public virtual Role Role { get; set; }

        

       
    }
}
