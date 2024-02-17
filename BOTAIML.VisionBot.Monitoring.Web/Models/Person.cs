using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public class Person : ChangeTrackableEntity
    {
        public Person()
        {
            FaceData = new HashSet<FaceData>();
        }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public virtual ICollection<FaceData> FaceData { get; set; }

    }


}
