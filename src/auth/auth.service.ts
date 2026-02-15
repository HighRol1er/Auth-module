import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(reqUser: any) {
    if (!reqUser) {
      throw new BadRequestException('구글 유저 정보가 없습니다.');
    }

    const user = await this.usersService.findOrCreateUser({
      email: reqUser.email,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      picture: reqUser.picture,
      provider: 'google',
    });

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      message: '로그인 성공',
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.lastName}${user.firstName}`,
        role: user.role,
      },
    };
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.usersService.findOneById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    if (user.refreshToken !== rt) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload), // 300s 짜리 새 토큰
    };
  }
}
