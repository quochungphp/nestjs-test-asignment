export function isIntegrationTestRunning(): boolean {
  return process.env.IS_INTEGRATION_TESTING === 'true';
}
