using System.Collections.Generic;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class FaceDataServiceResultViewModel
    {
        public bool Success { get; set; }

        public string Error { get; set; }
        public List<EnrolmentServiceResultViewModel> Data { get; set; }
    }

    public class EnrolmentServiceResultViewModel 
    {   
        public int image_id { get; set; }
        public string indexid { get; set; }
        public string embeddings { get; set; }
    }
    
    //public class FaceEnrolmentImageResultViewModel
    //{
    //    public bool Success { get; set; }

    //    public string Error { get; set; }

    //    public string RejectedImage { get; set; }
    //}
    public class FaceEnrolmentImageDeleteResultViewModel
    {
        public bool Success { get; set; }

        public string Error { get; set; }
    }
    //public class IdentifyServiceResultViewModel
    //{
    //    public bool Success { get; set; }

    //    public string Error { get; set; }
    //    public SearchResultViewModel searchResult { get; set; }
    //}
    //public class SearchResultViewModel : IdentifyServiceResultViewModel
    //{
    //    public string Id { get; set; }
    //    public float distance { get; set; }
    //}
    /*public class PersonInfoViewModel
    {
        public int PersonId { get; set; }

        public string Name { get; set; }

    }*/
}
