export type UserRole = 'admin' | 'support' | 'requester';
export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  agentId: string;
}
export interface UserResponse {
  token: string;
  user: User;
}
