using Supabase.Postgrest.Models;
using Supabase.Postgrest.Attributes;
using System;

namespace BallPredict.Backend.Models
{
    [Table("LeagueMembers")]
    public class LeagueMembers : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }


		[Column("league_id")]
		public Guid LeagueId { get; set; }
        [Column("user_id")]
        public Guid PlayerId { get; set; }


    }
}
