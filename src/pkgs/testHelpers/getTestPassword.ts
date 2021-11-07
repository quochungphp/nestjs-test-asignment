/* eslint-disable no-plusplus */
function randomString(length: number, chars: string): string {
  let result = '';
  for (let index = length; index > 0; index--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getTestPassword(email: string): Promise<string> {
  return Promise.resolve(
    randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
  );
}
