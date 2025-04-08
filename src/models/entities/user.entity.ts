export interface UserEntity {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    lastLogin: Date;
    isActive: boolean;
}