/**
 * Returns a random integer in the inclusive range [min, max].
 * @param max Upper bound (inclusive)
 * @param min Lower bound (inclusive), defaults to 1
 */
export function rand(max: number, min = 1): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
