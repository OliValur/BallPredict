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
  const data = await res.json();
  return data;
}

export async function createTeam(teamName: string, token: string) {
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

export async function joinLeague(inviteCode: string, token: string) {
  const res = await fetch(
    `http://localhost:5245/api/LeagueMembership/join-by-code`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ InviteCode: inviteCode }),
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function getUserLeagues(token: string) {
  const res = await fetch(`http://localhost:5245/api/League`, {
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
  const res = await fetch(`http://localhost:5245/api/League/${leagueId}`, {
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
  const res = await fetch(`http://localhost:5245/api/guesses`, {
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

  const res = await fetch("http://localhost:5245/api/SeasonPrediction", {
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
  const res = await fetch("http://localhost:5245/api/SeasonPrediction", {
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
    `http://localhost:5245/api/SeasonPrediction/league/${leagueId}`,
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
