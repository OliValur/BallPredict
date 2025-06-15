using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;
using System;

namespace BallPredict.Backend.Models
{
    [Table("Leagues")]
    public class LeagueInfo : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }

        [Column("league_id")]
        public Guid LeagueId { get; set; }
        [Column("invite_code")]
        public string InviteCode { get; set; }


    }
}
