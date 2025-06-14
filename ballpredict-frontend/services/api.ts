// services/api-client.ts

export async function getGamesAndUserGuesses(week: number, token: string) {
  const res = await fetch(`http://localhost:5245/api/Guesses/week/${week}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function createTeam(teamName: string, token: string) {
  console.log("Creating team with name:", teamName, "and token:", token);
  const res = await fetch(`http://localhost:5245/api/Team`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Team: teamName }),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function submitGuess(
  gameId: number,
  guess: number,
  token: string
) {
  const res = await fetch(`http://localhost:5245/api/Guesses/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ GameId: gameId, Prediction: guess }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function updateGuess(
  gameId: number,
  guess: number,
  token: string
) {
  const res = await fetch(`http://localhost:5245/api/Guesses/`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ GameId: gameId, Prediction: guess }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function createLeague(leagueName: string, token: string) {
  const res = await fetch(`http://localhost:5245/api/League`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Name: leagueName }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function joinLeague(leagueId: number, token: string) {
  const res = await fetch(`http://localhost:5245/api/League/${leagueId}/join`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return new Error(await res.text());
  }

  return res.json();
}
