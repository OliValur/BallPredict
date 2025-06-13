namespace BallPredict.Backend.DTOs
{
    public class GuessDto
    {
        public Guid GameId { get; set; }
        public int Prediction { get; set; }
    }
}
