using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class AutoBackupDatabaseSettings
    {
        public bool DailyBackupEnabled { get; set; }
        public string DailyBackupCronExpression { get; set; }
        public BackupConfig Configuration { get; set; }

        //Configuration for backup cleanup util
        public bool DeleteOlderBackups { get; set; }
        public int DeleteBackupsOlderthanDays { get; set; }
    }

    public class BackupConfig
    {
        public string UserName { get; set; }
        public string Format { get; set; }
        public string DatabaseName { get; set; }
        public string DumpOutputPath { get; set; }
        public BackupType BackupType { get; set; }
        public string PgDumpPath { get; set; }
        public string Host { get; set; }
        public string Port { get; set; }
        public string Password { get; set; }

    }

    public enum BackupType
    {
        Daily,
        Weekly,
        Monthy
    }

    public class BackupResult
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public string SuccessMessage { get; set; }
        public string StandardOutput { get; set; }
        public string StandardError { get; set; }
    }

    public class FileDeleteResult
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public string SuccessMessage { get; set; }
    }

}
