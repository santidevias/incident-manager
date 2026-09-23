export interface UserResponse {
  token: string;
  user: {
    email: string;
    name: string;
    role: 'admin' | 'support' | 'requester';
  };
}
