import PDLJS from "peopledatalabs"
import type { BaseSearchResponse } from "peopledatalabs/dist/types/search-types"

import { env } from "./config"
import { writeData } from "./filesystem"
import { logger } from "./logger"

/**
 * Base class for building PDL queries.
 *
 * @public
 */
export abstract class Query<Result extends { id?: string }, Schema> {
  /**
   * PeopleDataLabs client.
   *
   * @see https://github.com/peopledatalabs/peopledatalabs-js
   *
   * @public
   */
  public readonly client: PDLJS = new PDLJS({ apiKey: env.PEOPLEDATALABS_KEY })

  /**
   * Checks if the query has data to send.
   *
   * @returns True if the query has data to send.
   *
   * @public
   */
  public abstract hasData(): boolean

  /**
   * Returns the filename to use for writing query results.
   *
   * @param suffix - Optional suffix to append to the filename.
   *
   * @returns The filename with optional suffix.
   *
   * @public
   */
  public abstract getFileName(suffix?: string): string

  /**
   * Builds the query to send to PDL.
   *
   * @returns The flat SQL query string.
   *
   * @public
   */
  public abstract buildQuery(): string

  /**
   * Parses the query result into via a Zod schema.
   *
   * @param data - Unsafe query result.
   *
   * @public
   */
  public abstract parse(data: Result): Schema

  /**
   * Executes the query and writes the results to json files.
   *
   * @returns The query results.
   *
   * @public
   */
  public async execute(): Promise<Result[]> {
    if (!this.hasData()) {
      throw new Error(`No query data provided.`)
    }

    const searchQuery: string = this.buildQuery()

    logger.debug(`Sending PDL query:`, searchQuery)

    const response = await this._send(searchQuery)

    if (response.status !== 200) {
      throw new Error(`Request failed with status: ${response.status}`)
    }

    await writeData(this.getFileName("full"), response.data)

    for (const result of response.data) {
      await writeData(this.getFileName(result.id), this.parse(result))
    }

    return response.data
  }

  /**
   * Sends the query to PDL.
   *
   * @remarks
   * Can be typed to any valid PDL response.
   *
   * @param searchQuery - String SQL query to send to PDL.
   *
   * @returns The typed PDL response.
   *
   * @internal
   */
  protected abstract _send(
    searchQuery: string
  ): Promise<BaseSearchResponse<Result>>
}
