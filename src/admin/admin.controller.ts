import { Roles } from '@/auth/decorator/roles.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('alluser')
  @Roles('admin')
  getUsers() {
    return '관리자 페이지';
  }
}
