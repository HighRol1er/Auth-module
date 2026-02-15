import { Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '@/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req: any) {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Request() req: any) {
    return this.authService.googleLogin(req.user);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') rt: string) {
    try {
      const payload = this.jwtService.verify(rt);
      console.log('토큰 검증 성공, 페이로드:', payload);
      return this.authService.refreshTokens(payload.sub, rt);
    } catch (e) {
      console.error('JWT 검증 에러 상세:', e.message);
      throw new UnauthorizedException('리프레시 토큰이 만료되었습니다. 다시 로그인하세요.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const userId = req.user.userId || req.user.id;

    await this.userService.updateRefreshToken(userId, null);

    return {
      success: true,
      message: '로그아웃 되었습니다. 이제 이 리프레시 토큰은 사용할 수 없습니다.',
    };
  }
}
