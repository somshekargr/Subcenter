using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public class Enrolment : ChangeTrackableEntity
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "Please enter the  Name")]
        [StringLength(150, ErrorMessage = "Please enter a valid name with a maximum of 150 characters.")]
        public string Name { get; set; }

        [Index("EmployeeId_Index", IsUnique = true)]
        [Required(ErrorMessage = "EmployeeId is already exist")]
        public string EmployeeId { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Please Enter a valid Mobile Number")]
        [StringLength(10, ErrorMessage = "Mobile Number must be a 10-digit valid mobile number.")]
        public string MobileNumber { get; set; }

        [Required(ErrorMessage = "Permit Time Minute is required")]
        public int PermitTimeMinute { get; set; }

        [ForeignKey(nameof(Role))]
        public int RoleId { get; set; }

        [ForeignKey(nameof(Person))]
        public int PersonId { get; set; }

        public virtual Role Role { get; set; }

        public virtual Person Person { get; set; }

    }
}
