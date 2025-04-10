import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/models/entities/user.entity";
import { JWTPayload, JWTResponse } from "src/types/common";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async singIn(user: UserEntity) : Promise<JWTResponse> {
    const { email } = user;
    const payload: JWTPayload = { email, isActive: user.isActive };
    const accessToken: string = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }
}