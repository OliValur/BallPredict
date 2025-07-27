// services/api-client.ts

const API_BASE_URL = "https://ballpredict-1.onrender.com/api";

export async function getGamesAndUserGuesses(week: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/Guesses/week/${week}`, {
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
  const data = await res.json();
  return data;
}

export async function createTeam(teamName: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/Team`, {
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
  const res = await fetch(`${API_BASE_URL}/Guesses/`, {
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
  const res = await fetch(`${API_BASE_URL}/Guesses/`, {
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
  const res = await fetch(`${API_BASE_URL}/League`, {
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

export async function joinLeague(inviteCode: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/LeagueMembership/join-by-code`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ InviteCode: inviteCode }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function getUserLeagues(token: string) {
  const res = await fetch(`${API_BASE_URL}/League`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: 600,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function getLeagueScores(leagueId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/League/${leagueId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: 600,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function getAllGames(token: string) {
  const res = await fetch(`${API_BASE_URL}/guesses`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: 600,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function submitSeasonPredictions(
  category: string,
  guess: string,
  token: string
) {
  const payload = {
    category,
    guess,
  };

  console.log("Submitting season prediction:", payload);

  const res = await fetch(`${API_BASE_URL}/SeasonPrediction`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(await res.text());
  return res;
}

export async function getSeasonPredictions(token: string) {
  const res = await fetch(`${API_BASE_URL}/SeasonPrediction`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  console.log("Fetched season predictions:", data);
  return data;
}

export async function getLeagueSeasonPredictions(
  leagueId: string,
  token: string
) {
  const res = await fetch(
    `${API_BASE_URL}/SeasonPrediction/league/${leagueId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  console.log("Fetched league season predictions:", data);
  return data;
}
