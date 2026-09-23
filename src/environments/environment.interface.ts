export interface Environment {
  production: boolean;
  apiUrl: string;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
  };
}
