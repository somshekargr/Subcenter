using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Utils
{
    internal static class DbContextExtensions
    {
        public static void AddOrUpdateRange<TEntity>(this DbSet<TEntity> set, IEnumerable<TEntity> entities)
           where TEntity : class
        {
            foreach (var entity in entities)
            {
                set.AddOrUpdateRange((IEnumerable<TEntity>)entity);
            }
        }

        public static void AddOrUpdate<TEntity>(this DbSet<TEntity> set, TEntity entity)
          where TEntity : class
        {
            _ = !set.Exists(entity) ? set.Add(entity) : set.Update(entity);
        }

        public static bool Exists<TEntity>(this DbSet<TEntity> set, TEntity entity)
           where TEntity : class
        {
            return set.Any(e => e == entity);
        }

        public static PropertyBuilder<TValue> UseJsonSerialization<TValue>(this PropertyBuilder<TValue> property)
        {
            return property
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonConvert.SerializeObject(v, new StringEnumConverter()),
                    v => JsonConvert.DeserializeObject<TValue>(v)
                );
        }

        public static PropertyBuilder<TModel> UseJsonSerialization<TModel>(this PropertyBuilder<TModel> property, DatabaseFacade database)
        {
            if (database.IsNpgsql())
                property = property.HasColumnType("jsonb");

            if (database.IsSqlite())
                property.HasColumnType("text");

            return property.HasConversion(
                v => JsonConvert.SerializeObject(v, new StringEnumConverter()),
                v => JsonConvert.DeserializeObject<TModel>(v, new StringEnumConverter())
            );
        }

        public static bool In<T>(this T theObject, params T[] collection)
        {
            return collection.Contains(theObject);
        }
    }
}
