declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string;
      ENV: string;
      EXPO_PUBLIC_API_BASE_URL: string;
    }
  }
}

export { };

