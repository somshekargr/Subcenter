using BOTAIML.VisionBot.Monitoring.Web.Constants;
using BOTAIML.VisionBot.Monitoring.Web.Utils;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BackupUtilController : ControllerBase
    {
        public IConfiguration Configuration { get; }
        public BackupUtilController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        [HttpPost]
        [Route("DailyBackupDatabase"), ProducesResponseType(typeof(BackupResult), 200)]
        public IActionResult DailyBackupDatabase()
        {
            var databaseBackupSettings = Configuration.GetSection("AutoBackupDatabaseSettings");

            var isDailyBackupEnabled = databaseBackupSettings.GetValue<bool>("DailyBackupEnabled");
            if (isDailyBackupEnabled)
            {
                try
                {
                    var result = EnableDatabaseAutoBackup();
                    return Ok(result);
                }
#pragma warning disable CA1031 // Do not catch general exception types
                catch (Exception ex)
#pragma warning restore CA1031 // Do not catch general exception types
                {
                    return BadRequest(ex);
                }
            }
            else
            {
                var result = new BackupResult
                {
                    IsSuccess = true,
                    ErrorMessage = string.Empty,
                    SuccessMessage = BackupDatabaseErrors.DAILY_BACKUP_NOT_ENABLED
                };
                return Ok(result);
            }
        }


        [HttpPost]
        [Route("DeleteBackupsOlderthanDays"), ProducesResponseType(typeof(FileDeleteResult), 200)]
        public IActionResult DeleteBackupsOlderthanDays()
        {
            var databaseBackupSettings = Configuration.GetSection("AutoBackupDatabaseSettings");

            var deleteOlderBackupsEnabled = databaseBackupSettings.GetValue<bool>("DeleteOlderBackups");

            var olderThan = databaseBackupSettings.GetValue<int>("DeleteBackupsOlderthanDays");

            var dbBackupConfig = databaseBackupSettings.GetSection("BackupConfig");

            var dumpBasePath = dbBackupConfig.GetValue<string>("DumpOutputPath");

            var localdumpLocation = Path.Combine(dumpBasePath, "DailyBackups");

            if (deleteOlderBackupsEnabled)
            {
                try
                {
                    var result = BackupUtil.DeleteBackupFileOlderThanDays(olderThan, localdumpLocation);
                    return Ok(result);
                }
#pragma warning disable CA1031 // Do not catch general exception types
                catch (Exception ex)
#pragma warning restore CA1031 // Do not catch general exception types
                {
                    return BadRequest(ex);
                }
            }
            else
            {
                var result = new FileDeleteResult
                {
                    IsSuccess = true,
                    ErrorMessage = string.Empty,
                    SuccessMessage = BackupDatabaseErrors.OLDER_BACKUP_CLEANUP_NOT_ENABLED
                };
                return Ok(result);
            }
        }

        private BackupResult EnableDatabaseAutoBackup()
        {
            var databaseBackupSettings = Configuration.GetSection("AutoBackupDatabaseSettings");

            var isDailyBackupEnabled = databaseBackupSettings.GetValue<bool>("DailyBackupEnabled");

            var dbBackupConfig = databaseBackupSettings.GetSection("BackupConfig");
            var backupSettings = new AutoBackupDatabaseSettings
            {
                DailyBackupEnabled = isDailyBackupEnabled,
                DailyBackupCronExpression = databaseBackupSettings.GetValue<string>("DailyBackupCronExpression"),
                Configuration = new BackupConfig
                {
                    UserName = dbBackupConfig.GetValue<string>("UserName"),
                    Password = dbBackupConfig.GetValue<string>("Password"),
                    DatabaseName = dbBackupConfig.GetValue<string>("DatabaseName"),
                    Format = dbBackupConfig.GetValue<string>("Format"),
                    DumpOutputPath = dbBackupConfig.GetValue<string>("DumpOutputPath"),
                    Host = dbBackupConfig.GetValue<string>("Host"),
                    PgDumpPath = dbBackupConfig.GetValue<string>("PgDumpPath"),
                    Port = dbBackupConfig.GetValue<string>("Port"),
                }
            };

            backupSettings.Configuration.BackupType = BackupType.Daily;

            var result = BackupUtil.AutoBackupDatabaseDaily(backupSettings);

            return result;
        }
    }
}
