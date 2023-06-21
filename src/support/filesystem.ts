import { resolve } from "node:path"
import { writeFile } from "fs/promises"

import { logger } from "./logger"

/**
 * Path to the data output directory.
 *
 * @internal
 */
const DATA_PATH: string = resolve(process.cwd(), "./data")

/**
 * Returns the absolute path to the data output directory.
 *
 * @param filename - Name of the file to resolve.
 *
 * @returns Absolute path to the data output directory.
 *
 * @public
 */
export const toDataPath = (filename: string): string =>
  resolve(DATA_PATH, filename)

/**
 * Writes data to the filesystem data directory.
 *
 * @param filename - Name of the file to write.
 * @param data - Data to write to the file.
 *
 * @public
 */
export const writeData = async (
  filename: string,
  data: string | Buffer | unknown
): Promise<void> => {
  let content: string
  if (typeof data === "string") {
    content = data
  } else if (Buffer.isBuffer(data)) {
    content = data.toString()
  } else {
    content = JSON.stringify(data, null, 2)
  }

  await writeFile(toDataPath(filename), content)

  logger.info(`Wrote  ${new Blob([content]).size} bytes to "${filename}".`)
}
