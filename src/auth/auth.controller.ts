import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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
}
