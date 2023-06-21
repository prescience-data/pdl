import "dotenv/config"

import { camelCase, kebabCase } from "@nodesuite/case"
import arg from "arg"
import { z } from "zod"
import type { CamelCaseKeys } from "@nodesuite/case"

/**
 * Parsed environment variables.
 *
 * @public
 */
export const env = z
  .object({
    PEOPLEDATALABS_KEY: z.string({
      required_error: `Must set a valid "PEOPLEDATALABS_KEY" value in local ".env" file.`
    }),
    LOG_LEVEL: z
      .enum([`trace`, `debug`, `info`, `warn`, `error`, `fatal`])
      .optional()
      .transform((level) => {
        switch (level) {
          case "trace":
            return 0
          case "debug":
            return 1
          case "info":
            return 2
          case "warn":
            return 3
          case "error":
            return 4
          case "fatal":
            return 5
          default:
            return 2
        }
      })
  })
  .parse(process.env)

/**
 * Extracts a set of keys from args and returns them as a camelCased object.
 *
 * @param keys - String array of keys to extract.
 *
 * @returns Object with camelCased keys.
 *
 * @public
 */
export const args = <K extends string>(
  keys: K[]
): CamelCaseKeys<Record<K, string | undefined>> => {
  // Ensure keys are in the correct `--param-case` format.
  const args = arg(
    Object.fromEntries(
      keys.map((key) => [`--${kebabCase(key).replace("--", "")}`, String])
    ),
    {
      permissive: true
    }
  )

  const entries = Object.entries(args)

  // Convert the result back to `camelCase` keyed object.
  return Object.fromEntries(
    entries.map(([key, value]) => [camelCase(key.replace("--", "")), value])
  ) as CamelCaseKeys<Record<K, string | undefined>>
}
