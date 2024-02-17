using BOTAIML.VisionBot.Monitoring.Web.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class PersonViewModel
    {
        [Required]
        public int PersonId { get; set; }

        public IEnumerable<FaceImageDataViewModel> FaceImages { get; set; }

        public Person ToModel()
        {
            return new Person
            {
                Id = this.PersonId
            };
        }

        public static PersonViewModel FromModel(Person person, int? noOfFaceImagesToLoad = null)
        {
            if (person == null)
                return new PersonViewModel();

            IEnumerable<FaceImageDataViewModel> faceImages = null;

            if (!noOfFaceImagesToLoad.HasValue)
                faceImages = person.FaceData?.Select(fd => FaceImageDataViewModel.FromModel(fd));
            else
                faceImages = person.FaceData?.Take(noOfFaceImagesToLoad.Value).Select(fd => FaceImageDataViewModel.FromModel(fd));

            return new PersonViewModel
            {
                PersonId = person.Id,
                FaceImages = faceImages
            };
        }
    }

    public class FaceImageDataViewModel
    {
        public int Id { get; set; }

        [Required]
        public string Image { get; set; }

        internal static FaceImageDataViewModel FromModel(FaceData fd)
        {
            if (fd == null)
                return null;

            if (!File.Exists(fd.ImagePath))
            {
                return null;
            }

            var buffer = File.ReadAllBytes(fd.ImagePath);

            return new FaceImageDataViewModel
            {
                Id = fd.Id,
                Image = Convert.ToBase64String(buffer)
            };
        }
    }
}