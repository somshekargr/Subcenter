using BOTAIML.VisionBot.Monitoring.Web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Linq;
using System.Linq.Expressions;
using BOTAIML.VisionBot.Monitoring.Web.Authorization;
using BOTAIML.VisionBot.Monitoring.Web.Utils;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;


namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Enrolment>()
                        .HasIndex(e => e.EmployeeId)
                        .IsUnique(true);


            modelBuilder.Entity<Alert>()
                        .Property(e => e.Type)
                        .HasConversion(new EnumToStringConverter<AlertType>());
            modelBuilder.Entity<Alert>()
                        .Property(e => e.Level)
                        .HasConversion(new EnumToStringConverter<AlertLevel>());
            modelBuilder.Entity<Alert>()
                        .Property(e => e.LogType)
                        .HasConversion(new EnumToStringConverter<AreaName>());
            modelBuilder.Entity<Alert>()
                        .Property(e => e.ContentType)
                        .HasConversion(new EnumToStringConverter<AlertContentType>());

            modelBuilder.Entity<Role>()
                       .Property(e => e.Permissions)
                       .UseJsonSerialization(Database)
                       .Metadata
                       .SetValueComparer(new ValueComparer<ApplicationPermissions[]>(false));

            if (Database.IsSqlite())
            {
                modelBuilder.Entity<Role>()
                .Property(e => e.ReportPermissions)
                .UseJsonSerialization(Database);
            }

            // SQLite does not support array data types. Just a workaround to use JSON serialization
            if (Database.IsSqlite())
            {
                modelBuilder.Entity<FaceData>()
                            .Property(e => e.Encoding)
                            .UseJsonSerialization(Database);
            }

            modelBuilder.Entity<Camera>()
                      .Property(e => e.CameraStatus)
                      .HasEnumToStringConversion();

            modelBuilder.Entity<Camera>()
                     .Property(l => l.CameraStatus)
                     .HasDefaultValue(CameraComponentStatus.Stopped);

            modelBuilder.Entity<AuthorisedUserEntry>()
                       .HasIndex(e => e.CameraId);

            modelBuilder.Entity<AuthorisedUserEntry>()
                        .HasIndex(e => e.Category);

            modelBuilder.Entity<AuthorisedUserEntry>()
                        .HasIndex(e => e.StartDateTime);

            modelBuilder.Entity<AuthorisedUserEntry>()
                        .HasIndex(e => e.EndDateTime);

            modelBuilder.Entity<SystemLog>()
                     .Property(l => l.IsArchived)
                     .HasDefaultValue(false);

            modelBuilder.Entity<SystemLog>()
                        .Property(l => l.Source)
                        .HasEnumToStringConversion();

            modelBuilder.Entity<SystemLog>()
                        .Property(l => l.Category)
                        .HasEnumToStringConversion();

            modelBuilder.Entity<SystemLog>()
                       .Property(l => l.LogLevel)
                       .HasEnumToStringConversion();

            modelBuilder.Entity<SystemLog>()
                       .Property(l => l.IsAlertSent)
                       .HasDefaultValue(false);

            modelBuilder.Entity<SystemLog>()
                           .Property(l => l.AdditionalData)
                           .UseJsonSerialization();

            modelBuilder.Entity<SubCenterAreaLog>()
                          .Property(e => e.Status)
                          .HasConversion(new EnumToStringConverter<TrackingStatus>());
            modelBuilder.Entity<SubCenterAreaLog>()
                          .Property(e => e.Name)
                          .HasConversion(new EnumToStringConverter<AreaName>());
            modelBuilder.Entity<SubCenterAreaLog>()
                          .Property(e => e.IsAlertRequired)
                          .HasDefaultValue(false);
            modelBuilder.Entity<SubCenterAreaLog>()
                          .Property(e => e.IsAlertSent)
                          .HasDefaultValue(false);

            modelBuilder.Entity<SubCenterAreaLog>()
                         .Property(e => e.DoorStatus)
                         .HasConversion(new EnumToStringConverter<DoorStatus>());
            modelBuilder.Entity<SubCenterAreaLog>()
                         .Property(e => e.PowerStatus)
                         .HasConversion(new EnumToStringConverter<PowerStatus>());

            modelBuilder.SeedMasterData(Database);
        }
      
        public virtual DbSet<Alert> Alerts { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Person> People { get; set; }
        public virtual DbSet<SubCenterAreaLog> SubCenterAreaLogs { get; set; }
        public virtual DbSet<FaceData> FaceData { get; set; }
        public virtual DbSet<Enrolment> Enrolments { get; set; }

        public virtual DbSet<AuthorisedUserEntry> AuthorisedUserEntries { get; set; }
        public virtual DbSet<Camera> Cameras { get; set; }

        public virtual DbSet<SystemLog> SystemLogs { get; set; }

        public virtual DbSet<Report> Reports { get; set; }

        //   public virtual DbSet<FaceEnrolment> FaceEnrolment { get; set; }
    }

    internal static class MyExtensions
    {
        public static void SeedWithSequence<TEntity>(
            this EntityTypeBuilder<TEntity> entity,
            ModelBuilder modelBuilder,
            Expression<Func<TEntity, int>> idSelector,
            params TEntity[] seedData) where TEntity : class
        {
            var seqName = $"{typeof(TEntity).Name}_Id_Sequence";

            var seqStartValue = seedData.Max(idSelector.Compile()) + 1;

            modelBuilder.HasSequence(seqName)
                .StartsAt(seqStartValue)
                .IncrementsBy(1);

            entity.Property(idSelector)
                 .HasDefaultValueSql($"nextval('\"{seqName}\"')");

            entity.HasData(seedData);
        }

        public static void SeedWithSequence<TEntity>(
            this EntityTypeBuilder<TEntity> entity,
            ModelBuilder modelBuilder,
            Expression<Func<TEntity, long>> idSelector,
            params TEntity[] seedData) where TEntity : class
        {
            var seqName = $"{typeof(TEntity).Name}_Id_Sequence";

            var seqStartValue = seedData.Max(idSelector.Compile()) + 1;

            modelBuilder.HasSequence(seqName)
                .StartsAt(seqStartValue)
                .IncrementsBy(1);

            entity.Property(idSelector)
                 .HasDefaultValueSql($"nextval('\"{seqName}\"')");

            entity.HasData(seedData);
        }

        public static void HasEnumToStringConversion<TEnum>(this PropertyBuilder<TEnum> property) where TEnum : struct
        {
            property.HasConversion(
                v => v.ToString(),
                v => Enum.Parse<TEnum>(v));
        }
    }
}

