namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class SaveEnrolmentResultViewModel
    {
        public int Id { get; set; }
        public FaceDataServiceResultViewModel FaceEnrolmentResult { get; set; }
        public string Error { get; set; }
    }
}
