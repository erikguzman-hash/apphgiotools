import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalTools,
      activeErrors,
      recentAccess,
      usersByRole,
      topTools,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.tool.count({ where: { status: 'active' } }),
      this.prisma.errorLog.count({ where: { status: { notIn: ['resolved', 'ignored'] } } }),
      this.prisma.accessLog.count({
        where: { timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
      this.prisma.user.groupBy({ by: ['role'], _count: true }),
      this.prisma.tool.findMany({
        take: 5,
        orderBy: { totalAccess: 'desc' },
        select: { id: true, name: true, icon: true, totalAccess: true },
      }),
    ]);

    return {
      totalUsers,
      totalTools,
      activeErrors,
      todayAccess: recentAccess,
      usersByRole: Object.fromEntries(usersByRole.map(r => [r.role, r._count])),
      topTools,
    };
  }

  async getToolAnalytics(toolId: string, period: string = 'weekly') {
    const daysBack = period === 'daily' ? 7 : period === 'weekly' ? 30 : 90;
    const dateFrom = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const accessLogs = await this.prisma.accessLog.groupBy({
      by: ['action'],
      where: { toolId, timestamp: { gte: dateFrom } },
      _count: true,
    });

    return {
      toolId,
      period,
      metrics: Object.fromEntries(accessLogs.map(l => [l.action, l._count])),
    };
  }

  async getUserAnalytics(userId: string) {
    const [accessCount, toolsAccessed] = await Promise.all([
      this.prisma.accessLog.count({ where: { userId } }),
      this.prisma.accessLog.groupBy({
        by: ['toolId', 'toolName'],
        where: { userId },
        _count: true,
        orderBy: { _count: { toolId: 'desc' } },
        take: 10,
      }),
    ]);

    return { userId, totalAccess: accessCount, topTools: toolsAccessed };
  }
}
