using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class AddEditEnrolmentViewModel
    {
        public IEnumerable<DropDownListItem> Roles { get; set; }
        public EnrolmentViewModel Enrolment { get; set; }
    }

    public class EnrolmentViewModel
    {

        public int Id { get; set; }

        [Required(ErrorMessage = "Please enter the  Name")]
        [StringLength(150, ErrorMessage = "Please enter a valid name with a maximum of 150 characters.")]
        public string Name { get; set; }

        [Index("EmployeeId_Index", IsUnique = true)]
        [Required(ErrorMessage = "Employee ID is required ,EmployeeId is already exist")]
        public string EmployeeId { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Please Enter a valid Mobile Number")]
        [StringLength(10, ErrorMessage = "Mobile Number must be a 10-digit valid mobile number.")]
        public string MobileNumber { get; set; }

        [Required(ErrorMessage = "Permit Time Minute is Required")]
        public int PermitTimeMinute { get; set; }

        public PersonViewModel Person { get; set; }

        [Required]
        public int RoleId { get; set; }

       
        public string RoleName { get; set; }

        public ApplicationPermissions[] Permissions { get; set; }

        public bool IsFaceCaptured { get; set; }

        internal static EnrolmentViewModel FromModel(Enrolment enrolment, int? noOfFaceImagesToLoad = null)
        {
            if (enrolment == null)
                return new EnrolmentViewModel();

            return new EnrolmentViewModel
            {
                Id = enrolment.Id,
                Name = enrolment.Name,
                EmployeeId = enrolment.EmployeeId,
                MobileNumber = enrolment.MobileNumber,
                PermitTimeMinute = enrolment.PermitTimeMinute,
                DateOfBirth = enrolment.DateOfBirth,
                Person = PersonViewModel.FromModel(enrolment.Person, noOfFaceImagesToLoad),
                RoleId = enrolment.RoleId,
            };
        }
        internal Enrolment ToModel()
        {
            return new Enrolment
            {
                Id = this.Id,
                Name = this.Name,
                EmployeeId = this.EmployeeId,
                RoleId = this.RoleId,
                DateOfBirth = this.DateOfBirth,
                MobileNumber = this.MobileNumber,
                PermitTimeMinute = this.PermitTimeMinute,
                Person = this.Person.ToModel(),
            };
        }
    }
}