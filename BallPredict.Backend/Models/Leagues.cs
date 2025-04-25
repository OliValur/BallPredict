using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;

namespace BallPredict.Backend.Models
{
    [Table("Leagues")]
    public class Leagues : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("sport")]
        public string Sport { get; set; }
        [Column("owner")]
        public Guid OwnerId { get; set; }


    }
}
