using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace BallPredict.Backend.Models
{
    [Table("SeasonGuesses")]
    public class SeasonGuesses : BaseModel
    {
        [PrimaryKey("user_id")]
        public string UserId { get; set; }

        [Column("afc_north_winner")]
        public string? AfcNorth { get; set; }

        [Column("afc_south_winner")]
        public string? AfcSouth { get; set; }

        [Column("afc_east_winner")]
        public string? AfcEast { get; set; }

        [Column("afc_west_winner")]
        public string? AfcWest { get; set; }

        [Column("nfc_north_winner")]
        public string? NfcNorth { get; set; }

        [Column("nfc_south_winner")]
        public string? NfcSouth { get; set; }

        [Column("nfc_east_winner")]
        public string? NfcEast { get; set; }

        [Column("nfc_west_winner")]
        public string? NfcWest { get; set; }

        [Column("season_mvp")]
        public string? SeasonMvp { get; set; }

        [Column("rookie_of_the_year")]
        public string? RookieOfTheYear { get; set; }

        [Column("rushing_champion")]
        public string? RushingChampion { get; set; }

        [Column("most_receiving_yards")]
        public string? MostReceivingYards { get; set; }

        [Column("most_passing_yards")]
        public string? MostPassingYards { get; set; }

        [Column("afc_first_seed")]
        public string? AfcFirstSeed { get; set; }

        [Column("nfc_first_seed")]
        public string? NfcFirstSeed { get; set; }

        [Column("super_bowl_champs")]
        public string? SuperBowlChamp { get; set; }
    }
}
