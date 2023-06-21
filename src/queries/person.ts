import { camelCaseKeys, snakeCase } from "@nodesuite/case"
import type { PersonResponse, PersonSearchResponse } from "peopledatalabs"

import { PersonSchema, Query } from "../support"
import type { Person } from "../support"
import type { SocialNetwork } from "../types"

/**
 * Query PDL for a Person by username.
 *
 * @public
 */
export class PersonQuery extends Query<PersonResponse, Person> {
  /**
   * List of usernames to query.
   *
   * @internal
   */
  readonly #usernames: string[] = []

  /**
   * Checks if the query has data to send.
   *
   * @returns True if the query has data to send.
   *
   * @public
   */
  public hasData(): boolean {
    return this.#usernames.length > 0
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
    return [snakeCase(this.#usernames.join(" ")), suffix, "json"].join(".")
  }

  /**
   * Builds the query to send to PDL.
   *
   * @returns The flat SQL query string.
   *
   * @public
   */
  public buildQuery(): string {
    return `SELECT * FROM person WHERE (${this.#usernames.join(" OR ")})`
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
    return PersonSchema.parse(camelCaseKeys(data))
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
      return
    }

    switch (network) {
      case "linkedin":
        this.#usernames.push(`linkedin_username = '${username}'`)
        break
      case "github":
        this.#usernames.push(`github_username = '${username}'`)
        break
      case "facebook":
        this.#usernames.push(`facebook_username = '${username}'`)
        break
      default:
        throw new Error(`Invalid network: ${network}`)
    }
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
