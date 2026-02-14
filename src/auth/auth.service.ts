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

    // 1. DB에서 유저 찾기 또는 생성 (위에서 만든 findOrCreateUser 활용)
    const user = await this.usersService.findOrCreateUser({
      email: reqUser.email,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      picture: reqUser.picture,
      provider: 'google',
    });

    // 2. 우리 서비스 전용 JWT 페이로드 생성
    const payload = {
      email: user.email,
      sub: user.id, // DB의 유저 PK(id)
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
