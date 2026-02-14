import { BadRequestException, Injectable } from '@nestjs/common';
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
    };

    return {
      message: '로그인 성공',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: `${user.lastName}${user.firstName}`,
      },
    };
  }
}
