import { PrismaClient, UserRole, UserStatus, ToolType, ToolStatus, AccessType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ==================== CREAR ADMIN ====================
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@apphgio.com' },
    update: {},
    create: {
      email: 'admin@apphgio.com',
      password: hashedPassword,
      displayName: 'Administrador',
      role: UserRole.admin,
      status: UserStatus.active,
    },
  });
  console.log('Admin created:', admin.email);

  // ==================== CREAR CATEGORIAS ====================
  const categories = [
    {
      name: 'Desarrollo',
      slug: 'desarrollo',
      description: 'Herramientas para desarrollo de software',
      icon: 'Code',
      color: '#3b82f6',
      order: 1,
    },
    {
      name: 'Diseno',
      slug: 'diseno',
      description: 'Herramientas de diseno grafico y UX/UI',
      icon: 'Palette',
      color: '#8b5cf6',
      order: 2,
    },
    {
      name: 'Productividad',
      slug: 'productividad',
      description: 'Herramientas para mejorar la productividad',
      icon: 'Zap',
      color: '#22c55e',
      order: 3,
    },
    {
      name: 'Analytics',
      slug: 'analytics',
      description: 'Herramientas de analisis y metricas',
      icon: 'BarChart',
      color: '#f59e0b',
      order: 4,
    },
    {
      name: 'Comunicacion',
      slug: 'comunicacion',
      description: 'Herramientas de comunicacion y colaboracion',
      icon: 'MessageCircle',
      color: '#06b6d4',
      order: 5,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('Categories created:', categories.length);

  // ==================== CREAR SECCIONES ====================
  const sections = [
    {
      name: 'Herramientas Internas',
      slug: 'herramientas-internas',
      description: 'Herramientas de uso interno de la compania',
      icon: 'Building',
      order: 1,
    },
    {
      name: 'Escuela de Excelencia',
      slug: 'escuela-excelencia',
      description: 'Herramientas para los cursos de la escuela',
      icon: 'GraduationCap',
      order: 2,
    },
    {
      name: 'Para Clientes',
      slug: 'para-clientes',
      description: 'Herramientas disponibles para clientes',
      icon: 'Users',
      order: 3,
    },
    {
      name: 'Beta',
      slug: 'beta',
      description: 'Herramientas en fase beta',
      icon: 'TestTube',
      order: 4,
    },
  ];

  for (const section of sections) {
    await prisma.section.upsert({
      where: { slug: section.slug },
      update: section,
      create: section,
    });
  }
  console.log('Sections created:', sections.length);

  // ==================== CREAR CONFIGURACION INICIAL ====================
  const defaultSettings = {
    general: {
      platformName: 'Apphgio Tools',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico',
      supportEmail: 'soporte@apphgio.com',
      maintenanceMode: false,
    },
    access: {
      allowSelfRegistration: false,
      defaultRole: 'free',
      requireEmailVerification: true,
      sessionTimeout: 60,
      maxConcurrentSessions: 3,
    },
    restrictions: {
      betaMaxTools: 5,
      freeMaxTools: 3,
      betaExpirationDays: 30,
      freeExpirationDays: 14,
      dailyAccessLimit: 10,
    },
    notifications: {
      emailOnNewUser: true,
      emailOnCriticalError: true,
      adminEmails: ['admin@apphgio.com'],
    },
    appearance: {
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      darkModeEnabled: true,
    },
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.platformSetting.upsert({
      where: { key },
      update: { value: value as any },
      create: { key, value: value as any },
    });
  }
  console.log('Platform settings created');

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
