namespace BOTAIML.VisionBot.Monitoring.Web.Models
{
    public enum TrackingStatus : int
    {
        None = 0,
        Smoke = 1,
        Fire = 2,
        Unauthorised_Loitering = 3,
        Person = 4,
        Door_Open = 5,
        Door_Close = 6,
        Genset_Door_Open = 7,
        Genset_Door_Close = 8
    }
}