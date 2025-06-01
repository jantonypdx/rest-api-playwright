import { defineConfig } from "@playwright/test";
export default defineConfig({
  use: {
    // All requests we send go to this API endpoint.
    baseURL: "https://fakerestapi.azurewebsites.net",
  },
});
