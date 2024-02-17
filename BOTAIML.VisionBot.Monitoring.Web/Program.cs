using System.IO;
using System.Net;
using System.Security.Cryptography.X509Certificates;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace BOTAIML.VisionBot.Monitoring.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        /*public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });*/
        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            var config = new ConfigurationBuilder()
                                .SetBasePath(Directory.GetCurrentDirectory())
                                .AddEnvironmentVariables()
                                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                                .Build();

            var httpPort = config.GetValue<int>("HttpPort");

            var sslSettings = config.GetSection("SslSettings");
            
            var isSslEnabled = sslSettings.GetValue<bool>("Enabled");

            return Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder
                        .UseKestrel(options =>
                        {
                            options.AddServerHeader = false;

                            options.Listen(IPAddress.Any, httpPort);

                            if (isSslEnabled)
                            {
                                var certificateFileName = sslSettings.GetValue<string>("FileName");
                                var certificatePassword = sslSettings.GetValue<string>("Password");

                                var certificate = new X509Certificate2(certificateFileName, certificatePassword);

                                var httpsPort = sslSettings.GetValue<int>("HttpsPort");

                                options.Listen(IPAddress.Any, httpsPort, listenOptions =>
                                {
                                    listenOptions.UseHttps(certificate);
                                });
                            }
                        })
                        .UseStartup<Startup>();
                });
        }
    }
}
