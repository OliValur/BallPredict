using BallPredict.Backend.Models;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BallPredict.Backend.Models
{
    [Table("Games")]
    public class Games : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }

        [Column("home_team")]
        public string HomeTeam { get; set; }

        [Column("away_team")]
        public string AwayTeam { get; set; }

        [Column("week")]
        public int Week { get; set; }

        [Column("start_time")]
        public DateTime StartTime { get; set; }

        [Column("home_team_score")]
        public int? HomeTeamScore { get; set; }

        [Column("away_team_score")]
        public int? AwayTeamScore { get; set; }

        public List<Guess>? Guesses { get; set; } = new();
    }

}