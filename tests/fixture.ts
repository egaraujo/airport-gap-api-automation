import { test as baseTest } from '@playwright/test'
import * as apiHelpers from '../helpers/apiHelpers'

export const fixtures = baseTest.extend<{ apiHelpers: typeof apiHelpers }>({
    apiHelpers: async ({}, use) => {
    await use(apiHelpers);
  },
});