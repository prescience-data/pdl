import { createPromptModule } from "inquirer"
import type { PromptModule } from "inquirer"
import type { PersonResponse } from "peopledatalabs"

import { PersonQuery } from "./queries"
import { args, logger } from "./support"
import { isSocialNetwork } from "./types"

/**
 * Executes a "Person" query against PeopleDataLabs API.
 *
 * @remarks
 * Requires a valid PDL api key.
 *
 * @see https://github.com/peopledatalabs/peopledatalabs-js
 * @see https://docs.peopledatalabs.com/docs/javascript-sdk
 *
 * @public
 */
export class Cli {
  /**
   * Inquirer prompt module.
   *
   * @internal
   */
  readonly #prompt: PromptModule = createPromptModule()

  /**
   * Static interface for calling the async run method.
   *
   * @public
   */
  public static run(): void {
    const cli = new Cli()
    cli.run().catch((error) => logger.error(error.message))
  }

  /**
   * Executes the CLI command.
   *
   * @public
   */
  public async run(): Promise<void> {
    const query: string = await this.#getQuery()

    logger.info(`Executing "${query}" query.`)

    switch (query) {
      case "person":
        await this.#queryPerson()
    }
  }

  /**
   * Resolves the intended query from args or cli prompt.
   *
   * @returns The query to execute.
   *
   * @public
   */
  async #getQuery(): Promise<string> {
    const { query } = args(["--query"])

    if (query) {
      return query
    }

    const answers = await this.#prompt({
      query: {
        message: `Select a query to execute...`,
        type: `list`,
        choices: ["person"]
      }
    })

    return answers.query
  }

  /**
   * Executes a "Person" query against PeopleDataLabs API.
   *
   * @remarks
   * When using cli arguments, any number of usernames can be provided.
   * However, if using the interactive prompts only one network can be
   * searched at a time.
   *
   * @example
   * ```sh
   * pnpm cli --query=person --github=<username> --linkedin=<username>
   * ```
   *
   * @internal
   */
  async #queryPerson(): Promise<void> {
    const query = new PersonQuery()

    const input = args(["--email", "--github", "--linkedin", "--facebook"])

    const hasInput: boolean = !!(
      input.email ||
      input.github ||
      input.linkedin ||
      input.facebook
    )

    // If no usernames provided in cli arguments, prompt user for input.
    if (!hasInput) {
      const answers = await this.#prompt({
        network: {
          message: `Select social network (optional):`,
          type: `list`,
          choices: ["none", "github", "linkedin", "facebook"]
        },
        username: {
          message: `Enter username to query:`,
          type: `input`,
          when: (answers) => answers.network !== "none"
        },
        email: {
          message: `Enter email to query (optional):`,
          type: `input`,
          default: input.email,
          askAnswered: false
        }
      })

      if (isSocialNetwork(answers.network)) {
        input[answers.network] = answers.username
      }

      if (answers.email) {
        input.email = answers.email
      }
    }

    query.addUsername(`github`, input.github)
    query.addUsername(`linkedin`, input.linkedin)
    query.addUsername(`facebook`, input.facebook)
    query.addEmail(input.email)

    const responses: PersonResponse[] = await query.execute()

    logger.info(
      `Results`,
      responses.map(({ full_name }) => full_name).join("\n")
    )

    logger.info(`Query complete.`)
  }
}

/** Execute the CLI command. **/
Cli.run()
