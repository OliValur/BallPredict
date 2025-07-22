using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.Linq;

namespace BallPredict.Backend.Models
{
    public class Points
    {
        [JsonPropertyName("weeks")]
        public Dictionary<string, int> Weeks { get; set; }

        [JsonPropertyName("totalPoints")]
        public int TotalPoints { get; set; }

        public Points()
        {
            Weeks = Enumerable.Range(1, 22)
                .ToDictionary(week => week.ToString(), _ => 0);
            TotalPoints = 0;
        }

        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }
    }

    [Table("Teams")]
    public class Teams : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public string Id { get; set; }

        [Column("team")]
        public string Team { get; set; }

        [Column("points")]
        public Points Points { get; set; } = new Points();
    }
}
