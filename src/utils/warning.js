/* @flow */

/**
 * @param {string} message the message to be logged.
 */
export default function warning(message: string): void {
  if (console && console.warn) {
    console.warn(message)
  }
}
