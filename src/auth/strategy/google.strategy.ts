import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URI!,
      scope: ['profile', 'email'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    const { sub, email, given_name, family_name, picture } = profile._json;

    const user = {
      googleId: sub,
      email: email,
      firstName: given_name,
      lastName: family_name,
      picture: picture,
      accessToken,
    };
    this.logger.log('profile', profile);
    return user;
  }
}
