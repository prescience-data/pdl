import { Logger } from "tslog"

import { env } from "./config"

/**
 * Application logger.
 *
 * @public
 */
export const logger = new Logger({ name: "pdl", minLevel: env.LOG_LEVEL })
