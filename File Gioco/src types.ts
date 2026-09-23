export type PlayerHistoryEntry = {
  season: number;
  age: number;
  goalPower: number;
  assistPower: number;
  foulPower: number;
  goals: number;
  assists: number;
  yellows: number;
  reds: number;
};

export type Player = {
  id: string;
  name: string;
  age: number; // 18-40
  goalPower: number;
  assistPower: number;
  foulPower: number;
  photoUri?: string;
  injuredUntil?: number; // matchday until which the player is out (inclusive)
  history?: PlayerHistoryEntry[];
};