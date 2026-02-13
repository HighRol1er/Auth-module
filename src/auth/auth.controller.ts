import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guards/google-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login') // 결과적으로 /api/auth/login 으로 요청을 받습니다.
  async login(@Request() req: any) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      console.error(error, error.message);
    }
    // Passport의 local strategy를 통과하면 req.user에 유저 정보가 담깁니다.
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    return req.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  // 1. 구글 로그인 시작 주소: /auth/google
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req: any) {
    // 가드가 구글로 보내버리므로 이 안은 비어있어도 됩니다.
  }

  // 2. 구글 인증 후 돌아오는 주소: /auth/google/callback
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Request() req: any) {
    // 여기서 req.user는 GoogleStrategy의 validate()에서 리턴한 값입니다!
    return {
      message: '구글 로그인 성공!',
      user: req.user,
    };
  }
}
