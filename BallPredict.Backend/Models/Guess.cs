using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;

namespace BallPredict.Backend.Models
{
    [Table("Guesses")]
    public class Guess : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }

        [Column("game_id")]
        public Guid gameId { get; set; }

        [Column("user_id")]
        public string userId { get; set; }

        [Column("guess")] 
        public int guess { get; set; }
       

    }
}
