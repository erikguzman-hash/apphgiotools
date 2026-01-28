import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('tools/:id')
  getToolAnalytics(@Param('id') id: string, @Query('period') period: string) {
    return this.analyticsService.getToolAnalytics(id, period);
  }

  @Get('users/:id')
  getUserAnalytics(@Param('id') id: string) {
    return this.analyticsService.getUserAnalytics(id);
  }
}
