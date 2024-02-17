using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public class FaceData
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required, ForeignKey(nameof(Person))]
        public int PersonId { get; set; }

        [Required]
        public string Encoding { get; set; }
        public string FaceIndexId { get; set; }

        [Required]
        public string ImagePath { get; set; } 

        public virtual Person Person { get; set; }
    }
}

