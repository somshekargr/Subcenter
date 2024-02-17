using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace BOTAIML.VisionBot.Monitoring.Web.Authorization
{
    public enum ApplicationPermissions
    {

        [Display(GroupName = "User Management", Name = "Read", Description = "Can list/view Users")]
        UserRead,

        [Display(GroupName = "User Management", Name = "Create", Description = "Can create new Users")]
        UserCreate,

        [Display(GroupName = "User Management", Name = "Update", Description = "Can modify Users")]
        UserUpdate,

        [Display(GroupName = "Role Management", Name = "Read", Description = "Can list/view Application Roles")]
        RoleRead,

        [Display(GroupName = "Role Management", Name = "Create", Description = "Can create new Application Roles")]
        RoleCreate,

        [Display(GroupName = "Role Management", Name = "Update", Description = "Can modify existing Application Roles")]
        RoleUpdate,

        [Display(GroupName = "Camera Access", Name = "Door", Description = "Can access Door")]
        DoorAccess,

        [Display(GroupName = "Camera Access", Name = "SubCenter Power", Description = "Can access SubCenterPower")]
        SubCenterPowerAccess,

        [Display(GroupName = "Camera Access", Name = "Area Inside", Description = "Can access AreaInside")]
        AreaInsideAccess,

        [Display(GroupName = "Camera Access", Name = "Area Outside", Description = "Can access AreaOutside")]
        AreaOutsideAccess,

        [Display(GroupName = "Camera Access", Name = "Genset Area", Description = "Can access GensetArea")]
        GensetAreaAccess,

        [Display(GroupName = "Video Stream", Name = "Manage", Description = "Can On/Off LiveStream")]
        ManageLiveStream,

        [Display(GroupName = "Video Stream", Name = "Read", Description = "Can read LiveStream")]
        ReadLiveStream,

        [Display(GroupName = "Video Stream", Name = "View", Description = "Can view LiveStream")]
        ViewLiveStream,

        [Display(GroupName = "Enrolment", Name = "Read", Description = "Can list/view Enrolments")]
        EnrolmentRead,

        [Display(GroupName = "Enrolment", Name = "Create", Description = "Can Create new Enrolment")]
        EnrolmentCreate,

        [Display(GroupName = "Enrolment", Name = "Delete", Description = "Can Delete Enrolment")]
        EnrolmentDelete,

        [Display(GroupName = "Enrolment", Name = "Update", Description = "Can modify and re-enroll a Enrolment")]
        EnrolmentUpdate,

        [Display(GroupName = "Alerts", Name = "Read", Description = "Can view SubCenterArea")]
        AlertsRead,

        [Display(GroupName = "Report", Name = "Read", Description = "Can list/view Report")]
        ReportRead,

        [Display(GroupName = "Report", Name = "Create", Description = "Can create Report")]
        ReportCreate,

        [Display(GroupName = "Report", Name = "Update", Description = "Can modify Report")]
        ReportUpdate,

        [Display(GroupName = "Report", Name = "View", Description = "Can view Report")]
        ReportView,

        [Display(GroupName = "Report", Name = "Run", Description = "Can run Report")]
        ReportRun,

    }
}
