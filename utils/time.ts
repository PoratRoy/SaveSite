export const TWENTY_FOUR_HOURS = 24 * 60 * 60;


// Returns session duration in seconds
export const getSessionMaxAge = (remember: boolean) =>
  remember ? 30 * 24 * 60 * 60 : 60 * 60;
