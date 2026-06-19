/**
 * Jolpica F1 API Integration
 * API Base: https://api.jolpi.ca/ergast/f1
 */

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const REVALIDATE_TIME = 43200; // 12 hours

export interface F1Race {
  season: string;
  round: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SSZ
  FirstPractice?: { date: string; time: string };
  SecondPractice?: { date: string; time: string };
  ThirdPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
}

export interface F1DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    code: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  Constructors: {
    constructorId: string;
    name: string;
    nationality: string;
  }[];
}

export interface F1ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}

export interface F1RaceResult extends F1Race {
  Results: {
    number: string;
    position: string;
    points: string;
    Driver: F1DriverStanding['Driver'];
    Constructor: F1ConstructorStanding['Constructor'];
    grid: string;
    laps: string;
    status: string;
    Time?: { millis: string; time: string };
  }[];
}

async function fetchJolpica(endpoint: string) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Jolpica API Error on ${endpoint}:`, error);
    return null;
  }
}

export async function getF1Calendar(year: string | number = 'current'): Promise<F1Race[]> {
  const data = await fetchJolpica(`/${year}.json`);
  if (!data?.MRData?.RaceTable?.Races) return [];
  return data.MRData.RaceTable.Races;
}

export async function getF1DriverStandings(year: string | number = 'current'): Promise<F1DriverStanding[]> {
  const data = await fetchJolpica(`/${year}/driverStandings.json`);
  if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings) return [];
  return data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
}

export async function getF1ConstructorStandings(year: string | number = 'current'): Promise<F1ConstructorStanding[]> {
  const data = await fetchJolpica(`/${year}/constructorStandings.json`);
  if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings) return [];
  return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
}

export async function getF1RaceResults(year: string | number = 'current', round: string | number = 'last'): Promise<F1RaceResult | null> {
  const data = await fetchJolpica(`/${year}/${round}/results.json`);
  if (!data?.MRData?.RaceTable?.Races?.[0]) return null;
  return data.MRData.RaceTable.Races[0];
}

export async function getAllF1Results(year: string | number = 'current'): Promise<F1RaceResult[]> {
  const data = await fetchJolpica(`/${year}/results.json?limit=50`);
  if (!data?.MRData?.RaceTable?.Races) return [];
  return data.MRData.RaceTable.Races;
}
