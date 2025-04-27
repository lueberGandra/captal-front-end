export interface User {
  id: string;
  name: string;
  email: string;
}

export class UserModel {
  private users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
  ];

  async getUsers(): Promise<User[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.users), 500);
    });
  }
}