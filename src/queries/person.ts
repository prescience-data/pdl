import { camelCaseKeys, snakeCase } from "@nodesuite/case"
import { z } from "zod"
import type { PersonResponse, PersonSearchResponse } from "peopledatalabs"

import { logger, PersonSchema, Query } from "../support"
import { stripEmpty } from "../support/utils"
import type { Person } from "../support"
import type { SocialNetwork } from "../types"

/**
 * Query PDL for a Person by username.
 *
 * @public
 */
export class PersonQuery extends Query<PersonResponse, Person> {
  /**
   * List of query dimensions.
   *
   * @internal
   */
  readonly #dimensions: string[] = []

  /**
   * Accumulates filename elements.
   *
   * @internal
   */
  readonly #filename: string[] = []

  /**
   * Checks if the query has data to send.
   *
   * @returns True if the query has data to send.
   *
   * @public
   */
  public hasData(): boolean {
    return this.#dimensions.length > 0
  }

  /**
   * Returns the filename to use for writing query results.
   *
   * @param suffix - Optional suffix to append to the filename.
   *
   * @returns The filename with optional suffix.
   *
   * @public
   */
  public getFileName(suffix: string = ""): string {
    const base: string = this.#filename.filter((item) => !!item).join(" ")
    return [snakeCase(base), suffix, "json"].join(".")
  }

  /**
   * Builds the query to send to PDL.
   *
   * @returns The flat SQL query string.
   *
   * @public
   */
  public buildQuery(): string {
    return `SELECT * FROM person WHERE (${this.#dimensions.join(" OR ")})`
  }

  /**
   * Parses the query result into via a Zod schema.
   *
   * @param data - Unsafe query result.
   *
   * @returns The parsed and narrowed query result.
   *
   * @public
   */
  public parse(data: PersonResponse): Person {
    return PersonSchema.parse(stripEmpty(camelCaseKeys(data)))
  }

  /**
   * Adds a username to the query.
   *
   * @param network - The social network to search.
   * @param username - The username to search.
   *
   * @public
   */
  public addUsername(network: SocialNetwork, username?: string): void {
    // Skip on empty.
    if (!username) {
      logger.debug(`Skipping empty ${network} username.`)
      return
    }

    this.#filename.push(`${network}:${username}`)

    switch (network) {
      case "linkedin":
        this.#dimensions.push(`linkedin_username = '${username}'`)
        break
      case "github":
        this.#dimensions.push(`github_username = '${username}'`)
        break
      case "facebook":
        this.#dimensions.push(`facebook_username = '${username}'`)
        break
      default:
        throw new Error(`Invalid network: ${network}`)
    }
  }

  /**
   * Adds an email to the query.
   *
   * @param email - The email to search.
   *
   * @public
   */
  public addEmail(email?: string): void {
    // Skip on empty.
    if (!email) {
      logger.debug(`Skipping empty email.`)
      return
    }

    const cleanEmail: string = z
      .string()
      .email({
        message: `Invalid email: ${email}.`
      })
      .parse(email.trim().toLowerCase())

    this.#filename.push(`email:${cleanEmail}`)

    this.#dimensions.push(`personal_emails = '${cleanEmail}'`)
    this.#dimensions.push(`work_email = '${cleanEmail}'`)
  }

  /**
   * Executes the correct query using the PDL client.
   *
   * @param searchQuery - Flat SQL query string.
   *
   * @returns The raw query results.
   *
   * @internal
   */
  protected async _send(searchQuery: string): Promise<PersonSearchResponse> {
    return await this.client.person.search.sql({
      dataset: "all",
      size: 10,
      pretty: true,
      searchQuery
    })
  }
}
