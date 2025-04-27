namespace BallPredict.Backend.DTOs
{
    public class GuessDto
    {
        public Guid GameId { get; set; }
        public string HomeTeam { get; set; }
        public string AwayTeam { get; set; }
        public DateTime StartTime { get; set; }
        public int Week { get; set; }
        public int? Prediction { get; set; }
    }
}
