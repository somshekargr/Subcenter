﻿// <auto-generated />
using System;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace BOTAIML.VisionBot.Monitoring.Web.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20210628074356_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityByDefaultColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.2");

            modelBuilder.HasSequence("Camera_Id_Sequence")
                .StartsAt(5L);

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.Alert", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("Base64Data")
                        .HasColumnType("text");

                    b.Property<string>("ContentType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("DateTimeStamp")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int?>("Event")
                        .HasColumnType("integer");

                    b.Property<string>("Level")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("LogId")
                        .HasColumnType("bigint");

                    b.Property<string>("LogType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("MediaFilePath")
                        .HasColumnType("text");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Alerts");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.AuthorisedUserEntry", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .UseIdentityByDefaultColumn();

                    b.Property<int>("CameraId")
                        .HasColumnType("integer");

                    b.Property<int>("Category")
                        .HasColumnType("integer");

                    b.Property<DateTime>("EndDateTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<double>("Probability")
                        .HasColumnType("double precision");

                    b.Property<DateTime>("StartDateTime")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("Id");

                    b.HasIndex("CameraId");

                    b.HasIndex("Category");

                    b.HasIndex("EndDateTime");

                    b.HasIndex("StartDateTime");

                    b.ToTable("AuthorisedUserEntries");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.Camera", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasDefaultValueSql("nextval('\"Camera_Id_Sequence\"')");

                    b.Property<string>("CameraCode")
                        .HasColumnType("text");

                    b.Property<string>("CameraStatus")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("text")
                        .HasDefaultValue("Stopped");

                    b.Property<DateTime>("CameraStatusUpdatedOn")
                        .HasColumnType("timestamp without time zone");

                    b.Property<bool>("IsEnabled")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.ToTable("Cameras");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CameraCode = "CAM-01",
                            CameraStatus = "Stopped",
                            CameraStatusUpdatedOn = new DateTime(2021, 6, 4, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            IsEnabled = false
                        },
                        new
                        {
                            Id = 2,
                            CameraCode = "CAM-02",
                            CameraStatus = "Stopped",
                            CameraStatusUpdatedOn = new DateTime(2021, 6, 4, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            IsEnabled = false
                        },
                        new
                        {
                            Id = 3,
                            CameraCode = "CAM-03",
                            CameraStatus = "Stopped",
                            CameraStatusUpdatedOn = new DateTime(2021, 6, 4, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            IsEnabled = false
                        },
                        new
                        {
                            Id = 4,
                            CameraCode = "CAM-04",
                            CameraStatus = "Stopped",
                            CameraStatusUpdatedOn = new DateTime(2021, 6, 4, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            IsEnabled = false
                        });
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.Enrolment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("timestamp without time zone");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("EmployeeId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("MobileNumber")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("character varying(10)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.Property<int>("PermitTimeMinute")
                        .HasColumnType("integer");

                    b.Property<int>("PersonId")
                        .HasColumnType("integer");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer");

                    b.Property<int>("UpdatedBy")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("Id");

                    b.HasIndex("EmployeeId")
                        .IsUnique();

                    b.HasIndex("PersonId");

                    b.HasIndex("RoleId");

                    b.ToTable("Enrolments");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.FaceData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("Encoding")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FaceIndexId")
                        .HasColumnType("text");

                    b.Property<string>("ImagePath")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("PersonId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("PersonId");

                    b.ToTable("FaceData");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.Person", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("timestamp without time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<int>("UpdatedBy")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("Id");

                    b.ToTable("People");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.Report", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn();

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("character varying(150)");

                    b.Property<string>("ReportUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Reports");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn()
                        .HasIdentityOptions(3L, null, null, null, null, null);

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Permissions")
                        .HasColumnType("jsonb");

                    b.Property<int[]>("ReportPermissions")
                        .HasColumnType("integer[]");

                    b.HasKey("Id");

                    b.ToTable("Role");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Admin"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Manager"
                        });
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.SubCenterAreaLog", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .UseIdentityByDefaultColumn();

                    b.Property<int>("CameraId")
                        .HasColumnType("integer");

                    b.Property<string>("DoorStatus")
                        .HasColumnType("text");

                    b.Property<bool>("IsAlertRequired")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<bool>("IsAlertSent")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("PersonId")
                        .HasColumnType("integer");

                    b.Property<string>("PowerStatus")
                        .HasColumnType("text");

                    b.Property<float?>("Probability")
                        .HasColumnType("real");

                    b.Property<string>("Status")
                        .HasColumnType("text");

                    b.Property<DateTime>("Time")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("Id");

                    b.HasIndex("PersonId");

                    b.ToTable("SubCenterAreaLogs");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.SystemLog", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("AdditionalData")
                        .HasColumnType("jsonb");

                    b.Property<int?>("ArchivedBy")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("ArchivedOn")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("DateTimeStamp")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("HostName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("IPAddress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsAlertRequired")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsAlertSent")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<bool>("IsArchived")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<string>("LogLevel")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("RestoredOn")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Source")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("SystemLogs");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .UseIdentityByDefaultColumn()
                        .HasIdentityOptions(3L, null, null, null, null, null);

                    b.Property<int>("CreatedBy")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("timestamp without time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int[]>("Permissions")
                        .HasColumnType("integer[]");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer");

                    b.Property<int>("UpdatedBy")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            CreatedBy = 0,
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            IsActive = false,
                            Name = "Admin",
                            Password = "Wqbk9XLf30/Rpy9eHiYA/6aNQTKjUhulSaeJPx6KvUtHnChwqZZUtIl2BjiYXyBqwM9/QxzgIAvc51dnVO0viA==",
                            RoleId = 1,
                            UpdatedBy = 0,
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Username = "admin"
                        },
                        new
                        {
                            Id = 2,
                            CreatedBy = 0,
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            IsActive = false,
                            Name = "Manager",
                            Password = "X97tlwsZnndg0CrLv89+872Qbki5rReaiqsQc9/hDakvwWhdV2tiJbtllkUoKecZEbQJ54rnyiNxyYSF26OELQ==",
                            RoleId = 2,
                            UpdatedBy = 0,
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Username = "manager"
                        });
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.Enrolment", b =>
                {
                    b.HasOne("BOTAIML.VisionBot.Monitoring.Web.Models.Person", "Person")
                        .WithMany()
                        .HasForeignKey("PersonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BOTAIML.VisionBot.Monitoring.Web.Models.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Person");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.FaceData", b =>
                {
                    b.HasOne("BOTAIML.VisionBot.Monitoring.Web.Models.Person", "Person")
                        .WithMany("FaceData")
                        .HasForeignKey("PersonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Person");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.SubCenterAreaLog", b =>
                {
                    b.HasOne("BOTAIML.VisionBot.Monitoring.Web.Models.Person", "Person")
                        .WithMany()
                        .HasForeignKey("PersonId");

                    b.Navigation("Person");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.User", b =>
                {
                    b.HasOne("BOTAIML.VisionBot.Monitoring.Web.Models.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.Person", b =>
                {
                    b.Navigation("FaceData");
                });

            modelBuilder.Entity("BOTAIML.VisionBot.Monitoring.Web.Models.Role", b =>
                {
                    b.Navigation("Users");
                });
#pragma warning restore 612, 618
        }
    }
}