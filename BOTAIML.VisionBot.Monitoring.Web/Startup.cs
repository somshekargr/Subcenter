using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.Services;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using System;
using System.IO;
using System.Reflection;
using System.Text;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.Filters;
using BOTAIML.VisionBot.Monitoring.Web.Hubs;
using Microsoft.AspNetCore.SignalR;
using BOTAIML.VisionBot.Monitoring.Web.WebSocketManager;
using BOTAIML.VisionBot.Monitoring.Web.Constants;
using Hangfire;
using Hangfire.Common;
using Hangfire.PostgreSql;
using Hangfire.States;
using BOTAIML.VisionBot.Monitoring.Web.Controllers;

namespace BOTAIML.VisionBot.Monitoring.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                 .AddNewtonsoftJson(options =>
                 {
                     options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.RoundtripKind;
                     // options.SerializerSettings.DefaultValueHandling = DefaultValueHandling.IgnoreAndPopulate;
                     options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                     options.SerializerSettings.Formatting = Formatting.Indented;
                     options.SerializerSettings.NullValueHandling = NullValueHandling.Include;
                     options.SerializerSettings.Converters.Add(new StringEnumConverter());
                 });

            services.AddSignalR();
            services.AddScoped<AlertHub>();

            services.AddHttpContextAccessor();
            services.AddScoped<UserAuthorizationService>();

            services.AddHttpClient<FaceDataService>();


            var authSettingsSection = Configuration.GetSection(nameof(AuthorizationSettings));

            var authSettings = authSettingsSection.Get<AuthorizationSettings>();

            var telegramSection = Configuration.GetSection(nameof(TelegramSettings));

            var telegramSettings = telegramSection.Get<TelegramSettings>();
            services.AddSingleton(telegramSettings);

            services.AddPermissionsBasedAuthorization();

            var appSettingsSection = Configuration.GetSection(nameof(AppSettings));

            var appSettings = appSettingsSection.Get<AppSettings>();

            services.AddSingleton(appSettings);

            services.Configure<AppSettings>(appSettingsSection);

            services.AddScoped<UserResolverService>();

            services.AddScoped<TelegramService>();

            services.AddScoped<AlertToUIService>();

            services.AddSingleton<IAuthorizationHandler, PermissionHandler>();

            var key = Encoding.ASCII.GetBytes(authSettings.Secret);

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.Configure<AuthorizationSettings>(authSettingsSection);

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                );
            });

            services.AddWebSocketManager();

            services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Sub-Center API",
                    Version = "v1"
                });

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

                c.IncludeXmlComments(xmlPath);
                c.DescribeAllParametersInCamelCase();

                // Use method name as operationId
                c.CustomOperationIds(apiDesc =>
                {
                    return apiDesc.TryGetMethodInfo(out MethodInfo methodInfo) ? methodInfo.Name : null;
                });

                c.OperationFilter<AppendAuthorizeToSummaryOperationFilter>(); // Adds "(Auth)" to the summary so that you can see which endpoints have Authorization
                                                                              // or use the generic method, e.g. c.OperationFilter<AppendAuthorizeToSummaryOperationFilter<MyCustomAttribute>>();

                // add Security information to each operation for OAuth2
                c.OperationFilter<SecurityRequirementsOperationFilter>();
                // or use the generic method, e.g. c.OperationFilter<SecurityRequirementsOperationFilter<MyCustomAttribute>>();
                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Description = "Standard Authorization header using the Bearer scheme. Example: \"bearer {token}\"",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    Type = SecuritySchemeType.ApiKey
                });
            });
            services.AddSwaggerGenNewtonsoftSupport();

            var dbConnectionString = Configuration.GetConnectionString(AppConstants.DB_CONNECTION_STRING_KEY);

            services.AddDbContext<AppDbContext>(options => options.UseNpgsql(dbConnectionString));

            ConfigureHangfireService(services, dbConnectionString);

            ConfigureHangfire(services, dbConnectionString);
        }



        private void ConfigureHangfireService(IServiceCollection services, string dbConnectionString)
        {
            // Add Hangfire services.
            services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseColouredConsoleLogProvider()
                //.UseSerializerSettings(new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore })
                .UsePostgreSqlStorage(dbConnectionString, new PostgreSqlStorageOptions
                {
                    SchemaName = "hangfire",
                    PrepareSchemaIfNecessary = Configuration.GetValue<bool>("Hangfire:PrepareSchemaIfNecessary")
                })
            );
        }

        private void ConfigureHangfire(IServiceCollection services, string dbConnectionString)
        {
            services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseColouredConsoleLogProvider()
                //.UseSerializerSettings(new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore })
                .UsePostgreSqlStorage(dbConnectionString, new PostgreSqlStorageOptions
                {
                    SchemaName = "hangfire",
                    PrepareSchemaIfNecessary = Configuration.GetValue<bool>("Hangfire:PrepareSchemaIfNecessary")
                })
            );

            var databaseBackupSettings = Configuration.GetSection("AutoBackupDatabaseSettings");

            var isDailyBackupEnabled = databaseBackupSettings.GetValue<bool>("DailyBackupEnabled");
            var deleteOlderBackupsEnabled = databaseBackupSettings.GetValue<bool>("DeleteOlderBackups");

            //Code Section for Enabling the AutoBackup via HangFire Service
            if (isDailyBackupEnabled)
            {
                EnableDatabaseAutoBackup(dbConnectionString);
            }

            if (deleteOlderBackupsEnabled)
            {
                DeleteBackupFileOlderthanDays(dbConnectionString);
            }
        }

        private void EnableDatabaseAutoBackup(string dbConnectionString)
        {
            var databaseBackupSettings = Configuration.GetSection("AutoBackupDatabaseSettings");
            var cronExpression = databaseBackupSettings.GetValue<string>("DailyBackupCronExpression");

            var jobStorage = new PostgreSqlStorage(dbConnectionString, new PostgreSqlStorageOptions
            {
                PrepareSchemaIfNecessary = Configuration.GetValue<bool>("Hangfire:PrepareSchemaIfNecessary"),
                SchemaName = "hangfire"
            });

            var jobManager = new RecurringJobManager(jobStorage);
            var job = Job.FromExpression<BackupUtilController>(c => c.DailyBackupDatabase());
            var recurringJobId = $"{BackupType.Daily}{" Backup Database"}{"--Expression--"}{ cronExpression}";
            jobManager.AddOrUpdate(recurringJobId, job, cronExpression, TimeZoneInfo.Local, EnqueuedState.DefaultQueue);
        }

        private void DeleteBackupFileOlderthanDays(string dbConnectionString)
        {
            var databaseBackupSettings = Configuration.GetSection("AutoBackupDatabaseSettings");
            var cronExpression = databaseBackupSettings.GetValue<string>("DeleteBackupsCronExpression");
            var olderThan = databaseBackupSettings.GetValue<int>("DeleteBackupsOlderthanDays");
            var jobStorage = new PostgreSqlStorage(dbConnectionString, new PostgreSqlStorageOptions
            {
                PrepareSchemaIfNecessary = Configuration.GetValue<bool>("Hangfire:PrepareSchemaIfNecessary"),
                SchemaName = "hangfire"
            });

            var jobManager = new RecurringJobManager(jobStorage);
            var job = Job.FromExpression<BackupUtilController>(c => c.DeleteBackupsOlderthanDays());
            var recurringJobId = $"{"Delete Local Database Backup Older than "}{olderThan}{"Days"}{"--Expression--"}{cronExpression}";
            jobManager.AddOrUpdate(recurringJobId, job, cronExpression, TimeZoneInfo.Local, EnqueuedState.DefaultQueue);
        }



        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            //Changes for Adding websocket
            app.UseWebSockets();
            var serviceScopeFactory = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>();
            var serviceProvider = serviceScopeFactory.CreateScope().ServiceProvider;

            app.MapWebSocketManager("/camera_api", serviceProvider.GetService<CameraManagementBackendHandler>());
            app.MapWebSocketManager("/camera_ui", serviceProvider.GetService<CameraManagementUIHandler>());

            app.UseRouting();
            app.UseCors();
            app.UseHangfireServer();
            app.UseHangfireDashboard();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "L&T - Sub-center API (v1)");
                c.RoutePrefix = "swagger";
                c.DocExpansion(DocExpansion.None);
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<AlertHub>("/alertsocket");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";
                spa.Options.StartupTimeout = TimeSpan.FromMinutes(2);

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
