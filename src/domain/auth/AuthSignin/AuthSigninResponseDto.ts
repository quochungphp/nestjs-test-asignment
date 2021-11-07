import { AuthAccessTokenResponseDto } from '../AuthTokenResponseDto';

export class AuthSigninResponseDto {
  user!: AuthAccessTokenResponseDto;

  accessToken!: string;

  refreshToken!: string;
}
