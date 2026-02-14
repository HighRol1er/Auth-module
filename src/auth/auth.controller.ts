import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './guards/google-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // 1. 구글 로그인 시작 주소: /auth/google
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req: any) {}

  // 2. 구글 인증 후 돌아오는 주소: /auth/google/callback
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Request() req: any) {
    return this.authService.googleLogin(req.user);
  }
}
