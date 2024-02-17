using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Authorization
{
    public class ReportPermissionViewModel
    {
        public ReportPermissionViewModel(int id, string name, string description)
        {
            Id = id;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Description = description;
        }

        /// <summary>
        /// ID of the Report
        /// </summary>
        public int Id { get; private set; }

        /// <summary>
        /// Name of the Report
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Long description of this Report
        /// </summary>
        public string Description { get; private set; }
    }
}

