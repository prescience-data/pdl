/**
 * Available social networks to search via Person query.
 *
 * @public
 */
export type SocialNetwork = "linkedin" | "github" | "facebook"

/**
 * Type guard for SocialNetwork.
 *
 * @param value - Unknown value to check.
 *
 * @returns True if value is a SocialNetwork.
 *
 * @public
 */
export const isSocialNetwork = (
  value: string | undefined | null
): value is SocialNetwork =>
  !!value && ["linkedin", "github", "facebook"].includes(value)
