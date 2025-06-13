export function getTeamLogo(teamName: string): string {
  //file names are in the format "teamabbreviation.png for example "DAL.png"

  // Normalize the team name to lowercase and remove spaces
  const normalizedTeamName = teamName;

  // Return the path to the logo image
  return `/logos/${normalizedTeamName}.png`;
}
