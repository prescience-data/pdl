/**
 * Strips all undefined and null values from an object.
 *
 * @param record - The object to strip.
 *
 * @returns The stripped object.
 *
 * @public
 */
export const stripEmpty = <T extends object>(record: T): T =>
  Object.fromEntries(
    Object.entries(record).filter(
      ([, value]) => value !== undefined && value !== null
    )
  ) as T
