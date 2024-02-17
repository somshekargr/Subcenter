using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Models;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels.Authorization
{
    public class AddEditUserViewModel
    {
        public IEnumerable<DropDownListItem> Roles { get; set; }

        public UserViewModel User { get; set; }
    }

    public class UserViewModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Please enter the  Name")]
        [StringLength(150, ErrorMessage = "Please enter a valid name with a maximum of 150 characters.")]
        public string Name { get; set; }
        
        [Required]
        public string Username { get; set; }
        
        [Required]
        public int RoleId { get; set; }
        
        public string RoleName { get; set; }
        public ApplicationPermissions[] Permissions { get; set; }
        internal static UserViewModel FromModel(User user)
        {
            if (user == null)
                return new UserViewModel();

            return new UserViewModel
            {
                Id = user.Id,
                Name = user.Name,
                Username = user.Username,
                RoleId = user.RoleId,
            };
        }

        internal User ToModel()
        {
            var retVal = new User();
            this.UpdateModel(retVal);

            return retVal;
        }

        internal void UpdateModel(User user)
        {
            user.Id = Id;
            user.Name = Name;
            user.Username = Username;
            user.RoleId = RoleId;
        }
    }

    public class NewUserViewModel : UserViewModel
    {
        public PasswordViewModel PasswordInfo { get; set; }
    }

    public class PasswordViewModel
    {
        [Required, StringLength(50, MinimumLength = 8), Compare(nameof(ConfirmPassword))]
        public string Password { get; set; }

        [Required, StringLength(50, MinimumLength = 8)]
        public string ConfirmPassword { get; set; }
    }

    public class ChangePasswordViewModel : PasswordViewModel
    {
        [Required]
        public int UserId { get; set; }

        [Required, StringLength(50, MinimumLength = 8)]
        public string OldPassword { get; set; }
    }

    public class ResetPasswordViewModel : PasswordViewModel
    {
        [Required]
        public int UserId { get; set; }
    }

    public class SaveUserResultViewModel
    {
        public int UserId { get; set; }

    }
}

