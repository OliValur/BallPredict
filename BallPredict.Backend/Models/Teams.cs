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
        public Dictionary<string, int> weeks { get; set; }

        [JsonPropertyName("totalPoints")]
        public int totalPoints { get; set; }

        public Points()
        {
            weeks = Enumerable.Range(1, 22)
                .ToDictionary(week => week.ToString(), _ => 0);
            totalPoints = 0;
        }

        public override string ToString()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            return JsonSerializer.Serialize(this, options);
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
        public Points Points { get; set; } 
    }
}
