export interface JWTPayload {
    email: string;
    isActive: boolean;
}

export interface JWTResponse {
    accessToken: string;
    expires: Date;
}