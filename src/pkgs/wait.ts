/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
export function wait(ms = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
