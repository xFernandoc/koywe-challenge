export interface UserEntity {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}
