using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;

namespace BallPredict.Backend.Models
{
    [Table("Teams")]
    public class Teams : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public string Id { get; set; }

        [Column("team")]
        public string Team { get; set; }
    }
}
