using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

using Newtonsoft.Json;

namespace BOTAIML.VisionBot.Monitoring.Web.Authorization
{
    public class PermissionViewModel
    {
        public PermissionViewModel(string groupName, string name, string description, ApplicationPermissions permission)
        {
            Permission = permission;
            GroupName = groupName;
            ShortName = name ?? throw new ArgumentNullException(nameof(name));
            Description = description ?? throw new ArgumentNullException(nameof(description));
        }

        /// <summary>
        /// GroupName, which groups permissions working in the same area
        /// </summary>
        [JsonIgnore]
        public string GroupName { get; private set; }

        /// <summary>
        /// ShortName of the permission - often says what it does, e.g. Read
        /// </summary>
        public string ShortName { get; private set; }

        /// <summary>
        /// Long description of what action this permission allows 
        /// </summary>
        public string Description { get; private set; }

        /// <summary>
        /// Gives the actual permission
        /// </summary>
        public ApplicationPermissions Permission { get; private set; }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static Dictionary<string, List<PermissionViewModel>> GetPermissionsForDisplay<TEnum>()
        {
            var enumType = typeof(TEnum);

            var result = new Dictionary<string, List<PermissionViewModel>>();

            foreach (var permissionName in Enum.GetNames(enumType))
            {
                var member = enumType.GetMember(permissionName).Single();

                //This allows you to obsolete a permission and it won't be shown as a possible option, but is still there so you won't reuse the number
                var obsoleteAttribute = member.GetCustomAttribute<ObsoleteAttribute>();
                if (obsoleteAttribute != null)
                    continue;

                //If there is no DisplayAttribute then the Enum is not used
                var displayAttribute = member.GetCustomAttribute<DisplayAttribute>();
                if (displayAttribute == null)
                    continue;

                var permission = Enum.Parse<ApplicationPermissions>(permissionName);

                var vm = new PermissionViewModel(displayAttribute.GroupName, displayAttribute.Name, displayAttribute.Description, permission);

                if (!result.ContainsKey(displayAttribute.GroupName))
                {
                    result.Add(
                        displayAttribute.GroupName,
                        new List<PermissionViewModel> { vm }
                    );
                }
                else
                {
                    result[displayAttribute.GroupName].Add(vm);
                }
            }

            return result;
        }
    }

    public class PermissionsDisplayViewModel
    {
        public Dictionary<string, List<PermissionViewModel>> ApplicationPermissions { get; set; }

        public ReportPermissionViewModel[] Reports { get; set; }
    }
}
