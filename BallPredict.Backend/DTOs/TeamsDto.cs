using BallPredict.Backend.Models;

namespace BallPredict.Backend.DTOs
{
    public class TeamsDto
    {
        public Teams Team { get; set; }
        public List<GuessDto> Guesses { get; set; } 


    }
}
