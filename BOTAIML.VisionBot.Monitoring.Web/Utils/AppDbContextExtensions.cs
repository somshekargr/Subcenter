using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BOTAIML.VisionBot.Monitoring.Web.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Linq.Expressions;

namespace BOTAIML.VisionBot.Monitoring.Web.Utils
{
    public static class AppDbContextExtensions
    {

        private static bool isMasterDataSeeded;
        private static void SeedRoles(this ModelBuilder modelBuilder, DatabaseFacade database)
        {
            modelBuilder.Entity<Role>().SeedWithIdentity(
                database, r => r.Id,
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Manager" }
            );
        }

        private static void SeedUsers(this ModelBuilder modelBuilder, DatabaseFacade database)
        {
            modelBuilder.Entity<User>().SeedWithIdentity(
                database, r => r.Id,
                new User { Id = 1, Name = "Admin", Username = "admin", Password = HashingUtils.Hash("admin123", "1"), RoleId = 1 },
                new User { Id = 2, Name = "Manager", Username = "manager", Password = HashingUtils.Hash("manager123", "2"), RoleId = 2 }
            );
        }

        public static void SeedWithIdentity<TEntity>(
            this EntityTypeBuilder<TEntity> entity,
            DatabaseFacade database,
            Expression<Func<TEntity, int>> idSelector,
            params TEntity[] seedData) where TEntity : class
        {
            if (database.IsNpgsql())
            {
                var identityStartValue = seedData.Max(idSelector.Compile()) + 1;

                entity.Property(idSelector)
                      .HasIdentityOptions(startValue: identityStartValue);
            }

            entity.HasData(seedData);
        }

        internal static void SeedMasterData(this ModelBuilder modelBuilder, DatabaseFacade database)
        {
            if (isMasterDataSeeded) return;
            //Seeding the Master table data at this place
            //modelBuilder.SeedAppSettings(database);

            modelBuilder.SeedRoles(database);

            modelBuilder.SeedUsers(database);

            modelBuilder.SeedCameras(database);

            isMasterDataSeeded = true;
        }

        internal static void SeedCameras(this ModelBuilder modelBuilder, DatabaseFacade database)
        {
            for (var i = 1; i <= 4; i++)
            {
                modelBuilder.Entity<Camera>()
                    .SeedWithSequence(
                        modelBuilder, p => p.Id, new Camera
                        {
                            Id = i,
                            CameraCode = $"CAM-{i:D2}",
                            CameraStatus = CameraComponentStatus.Stopped,
                            CameraStatusUpdatedOn = new DateTime(2021, 6, 4)
                        }
                    );
            }
        }
    }
}
