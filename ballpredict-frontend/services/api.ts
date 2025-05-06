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

export async function submitGuess(
  gameId: number,
  guess: string,
  token: string
) {
  const res = await fetch(`http://localhost:5245/api/Guesses/${gameId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ guess }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
