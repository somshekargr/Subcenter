using BOTAIML.VisionBot.Monitoring.Web.Models;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.WebSocketManager
{
    public class ScopedAppDbContextProvider : IDisposable
    {
        private readonly IServiceProvider serviceProvider;

        public ScopedAppDbContextProvider(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        private IServiceScope scope;
        private AppDbContext dbContext;

        public AppDbContext DbContext
        {
            get
            {
                if (dbContext == null)
                {
                    scope = serviceProvider.CreateScope();

                    dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                }

                return dbContext;
            }
        }

        private bool disposedValue;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    if (dbContext != null)
                    {
                        dbContext.Dispose();
                        dbContext = null;
                    }

                    if (scope != null)
                    {
                        scope.Dispose();
                        scope = null;
                    }
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
