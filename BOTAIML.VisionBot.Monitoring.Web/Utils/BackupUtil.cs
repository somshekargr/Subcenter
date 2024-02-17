using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Utils
{
    public static class BackupUtil
    {
        private static BackupResult PostgreSqlDump(BackupConfig config)
        {
            BackupResult backupResult = new BackupResult
            {
                ErrorMessage = string.Empty
            };

            try
            {
                string pgdumpCommand = $"{config.PgDumpPath} -Fc -h {config.Host} --format {config.Format} -p {config.Port} "
                                     + $"-d {config.DatabaseName} -U {config.UserName} > \"{config.DumpOutputPath}\""
                                       .Replace("\"", "\\\"", StringComparison.InvariantCultureIgnoreCase);

                ProcessStartInfo startInfo = new ProcessStartInfo("/bin/bash");
                startInfo.EnvironmentVariables.Add("PGPASSWORD", config.Password);

                startInfo.Arguments = $"-c \"{pgdumpCommand}\"";
                startInfo.UseShellExecute = false;
                startInfo.CreateNoWindow = true;

                using (Process proc = Process.Start(startInfo))
                {
                    proc.WaitForExit();
                    proc.Close();
                }

                backupResult.IsSuccess = true;
                backupResult.SuccessMessage = $"Database backup is successfully completed to the file path {config.DumpOutputPath} at {DateTime.Now}";
            }
#pragma warning disable CA1031 // Do not catch general exception types
            catch (Exception ex)
#pragma warning restore CA1031 // Do not catch general exception types
            {
                backupResult.IsSuccess = false;
                backupResult.ErrorMessage = ex.Message;
            }

            return backupResult;
        }

        /// <summary>
        /// Returns folder and filePath
        /// </summary>
        /// <param name="basePath"></param>
        /// <param name="backupType"></param>
        /// <returns></returns>
        private static Tuple<string, string> GetFilePathInfo(string basePath, BackupType backupType)
        {
            string path = string.Empty;
            string filePath = string.Empty;
            string folderPath = string.Empty;

            switch (backupType)
            {
                case BackupType.Daily:
                    var today = DateTime.Now;
                    var currentYear = today.Year.ToString();
                    var currentMonth = today.Month.ToString("D2");
                    var fileName = DateTime.Now.ToString("ddMMyyyy-HHmmss-ff");

                    //Sample Format will be {2020 – 05 – 26052020-235959-01.sql}
                    path = Path.Combine(basePath, "DailyBackups", currentYear, currentMonth);

                    if (!Directory.Exists(path))
                        Directory.CreateDirectory(path);

                    folderPath = Path.Combine("DailyBackups", currentYear, currentMonth); ;

                    filePath = Path.Combine(path, $"{fileName}.sql");
                    break;
                case BackupType.Weekly:
                    //TODO
                    break;
                case BackupType.Monthy:
                    //TODO
                    break;
                default:
                    break;
            }
            return Tuple.Create(folderPath, filePath);
        }

        public static BackupResult AutoBackupDatabaseDaily(AutoBackupDatabaseSettings settings)
        {
            var config = settings.Configuration;
            var pathInfo = GetFilePathInfo(config.DumpOutputPath, config.BackupType);

            config.DumpOutputPath = pathInfo.Item2;
            var result = PostgreSqlDump(config);

            return result;
        }

        public static void CleanupEmptyDirectories(string startLocation)
        {
            foreach (var directory in Directory.GetDirectories(startLocation))
            {
                CleanupEmptyDirectories(directory);
                if (Directory.GetFiles(directory).Length == 0 &&
                    Directory.GetDirectories(directory).Length == 0)
                {
                    Directory.Delete(directory, false);
                }
            }
        }

        public static FileDeleteResult DeleteBackupFileOlderThanDays(int olderThanDays, string startLocation)
        {
            var day = olderThanDays * -1;
            FileDeleteResult fileDeleteResult = new FileDeleteResult
            {
                ErrorMessage = string.Empty
            };

            var deletedFileCount = 0;

            try
            {
                string[] yearDirectories = Directory.GetDirectories(startLocation);

                foreach (var year in yearDirectories)
                {
                    var monthDirectory = Directory.GetDirectories(year);

                    foreach (var month in monthDirectory)
                    {
                        var backupFiles = Directory.GetFiles(month, "*.sql", SearchOption.AllDirectories);
                        foreach (var file in backupFiles)
                        {
                            FileInfo fi = new FileInfo(file);
                            if (fi.CreationTime < DateTime.Now.AddDays(day))
                            {
                                fi.Delete();
                                deletedFileCount += 1;
                            }
                        }
                    }
                }

                // Clear the empty folders
                CleanupEmptyDirectories(startLocation);

                fileDeleteResult.IsSuccess = true;
                fileDeleteResult.SuccessMessage = $"Found {deletedFileCount} Database backups older than {DateTime.Now.AddDays(day):dd-MM-yyyy} ({olderThanDays} day(s) Older). Files got deleted successfully.";
            }
#pragma warning disable CA1031 // Do not catch general exception types
            catch (Exception ex)
#pragma warning restore CA1031 // Do not catch general exception types
            {
                fileDeleteResult.IsSuccess = false;
                fileDeleteResult.ErrorMessage = ex.Message;
            }
            return fileDeleteResult;
        }
    }
}
