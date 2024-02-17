using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Constants
{
    public static class AppConstants
    {
        internal const string DB_CONNECTION_STRING_KEY = "DefaultConnection";

        public const int SUPER_USER_ROLE_ID = 1;
    }

    public static class BackupDatabaseErrors
    {
        public const string DAILY_BACKUP_NOT_ENABLED = "Daily Backup is not enabled.";
        public const string OLDER_BACKUP_CLEANUP_NOT_ENABLED = "Older Backup Cleanup is not enabled.";
    }

    public static class SystemLogMessages
    {

        public const string CAMERA_STARTED = "Camera Started";
        public const string CAMERA_STOPPED = "Camera Stopped";
    }
}
