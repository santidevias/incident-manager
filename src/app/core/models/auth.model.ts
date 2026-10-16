export type UserRole = 'admin' | 'support' | 'requester';
export interface UserResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}
