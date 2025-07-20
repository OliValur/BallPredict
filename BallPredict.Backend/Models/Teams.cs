using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;
using System.Text.Json.Serialization;
using System.Collections.Generic;


namespace BallPredict.Backend.Models
{
    public class Points
    {
        [JsonPropertyName("weeks")]
        public Dictionary<string, int> Weeks { get; set; }

        [JsonPropertyName("totalPoints")]
        public int TotalPoints { get; set; }
    }
    [Table("Teams")]
    public class Teams : BaseModel
    {
        [PrimaryKey("id")]
        [Column("id")]
        public string Id { get; set; }

        [Column("team")]
        public string Team { get; set; }
        //point example {"weeks": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21": 0, "22": 0}, "totalPoints": 0}
        [Column("points")]
        public Points Points { get; set; }

    }
}
