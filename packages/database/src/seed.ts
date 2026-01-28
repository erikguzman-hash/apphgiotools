// =============================================
// SEED DATA - Apphgio Tools (Firestore)
// =============================================

import { db, auth } from './admin';
import { collections, serverTimestamp } from './collections';

async function seed() {
  console.log('Seeding Firestore database...');

  try {
    // ==================== CREAR ADMIN ====================
    console.log('Creating admin user...');

    // Crear usuario en Firebase Auth
    let adminUser;
    try {
      adminUser = await auth.getUserByEmail('admin@apphgio.com');
      console.log('Admin user already exists in Auth');
    } catch {
      adminUser = await auth.createUser({
        email: 'admin@apphgio.com',
        password: 'Admin123!',
        displayName: 'Administrador',
        emailVerified: true,
      });
      console.log('Admin user created in Auth');
    }

    // Establecer custom claims (rol)
    await auth.setCustomUserClaims(adminUser.uid, { role: 'admin' });

    // Crear documento de usuario en Firestore
    await collections.users.doc(adminUser.uid).set(
      {
        email: 'admin@apphgio.com',
        displayName: 'Administrador',
        role: 'admin',
        status: 'active',
        assignedToolIds: [],
        enrolledCourses: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log('Admin document created in Firestore');

    // ==================== CREAR CATEGORIAS ====================
    console.log('Creating categories...');

    const categories = [
      {
        id: 'desarrollo',
        name: 'Desarrollo',
        slug: 'desarrollo',
        description: 'Herramientas para desarrollo de software',
        icon: 'Code',
        color: '#3b82f6',
        order: 1,
        isActive: true,
        toolCount: 0,
      },
      {
        id: 'diseno',
        name: 'Diseno',
        slug: 'diseno',
        description: 'Herramientas de diseno grafico y UX/UI',
        icon: 'Palette',
        color: '#8b5cf6',
        order: 2,
        isActive: true,
        toolCount: 0,
      },
      {
        id: 'productividad',
        name: 'Productividad',
        slug: 'productividad',
        description: 'Herramientas para mejorar la productividad',
        icon: 'Zap',
        color: '#22c55e',
        order: 3,
        isActive: true,
        toolCount: 0,
      },
      {
        id: 'analytics',
        name: 'Analytics',
        slug: 'analytics',
        description: 'Herramientas de analisis y metricas',
        icon: 'BarChart',
        color: '#f59e0b',
        order: 4,
        isActive: true,
        toolCount: 0,
      },
      {
        id: 'comunicacion',
        name: 'Comunicacion',
        slug: 'comunicacion',
        description: 'Herramientas de comunicacion y colaboracion',
        icon: 'MessageCircle',
        color: '#06b6d4',
        order: 5,
        isActive: true,
        toolCount: 0,
      },
    ];

    const batch1 = db.batch();
    for (const cat of categories) {
      const ref = collections.categories.doc(cat.id);
      batch1.set(ref, { ...cat, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
    await batch1.commit();
    console.log(`Created ${categories.length} categories`);

    // ==================== CREAR SECCIONES ====================
    console.log('Creating sections...');

    const sections = [
      {
        id: 'herramientas-internas',
        name: 'Herramientas Internas',
        slug: 'herramientas-internas',
        description: 'Herramientas de uso interno de la compania',
        icon: 'Building',
        order: 1,
        isActive: true,
        toolCount: 0,
      },
      {
        id: 'escuela-excelencia',
        name: 'Escuela de Excelencia',
        slug: 'escuela-excelencia',
        description: 'Herramientas para los cursos de la escuela',
        icon: 'GraduationCap',
        order: 2,
        isActive: true,
        toolCount: 0,
      },
      {
        id: 'para-clientes',
        name: 'Para Clientes',
        slug: 'para-clientes',
        description: 'Herramientas disponibles para clientes',
        icon: 'Users',
        order: 3,
        isActive: true,
        toolCount: 0,
      },
      {
        id: 'beta',
        name: 'Beta',
        slug: 'beta',
        description: 'Herramientas en fase beta',
        icon: 'TestTube',
        order: 4,
        isActive: true,
        toolCount: 0,
      },
    ];

    const batch2 = db.batch();
    for (const section of sections) {
      const ref = collections.sections.doc(section.id);
      batch2.set(ref, { ...section, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
    await batch2.commit();
    console.log(`Created ${sections.length} sections`);

    // ==================== CREAR SETTINGS ====================
    console.log('Creating platform settings...');

    await collections.settings.doc('general').set({
      platformName: 'Apphgio Tools',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico',
      supportEmail: 'soporte@apphgio.com',
      maintenanceMode: false,
      updatedAt: serverTimestamp(),
    });

    await collections.settings.doc('access').set({
      allowSelfRegistration: false,
      defaultRole: 'free',
      requireEmailVerification: true,
      sessionTimeout: 60,
      maxConcurrentSessions: 3,
      updatedAt: serverTimestamp(),
    });

    await collections.settings.doc('restrictions').set({
      betaMaxTools: 5,
      freeMaxTools: 3,
      betaExpirationDays: 30,
      freeExpirationDays: 14,
      dailyAccessLimit: 10,
      updatedAt: serverTimestamp(),
    });

    await collections.settings.doc('notifications').set({
      emailOnNewUser: true,
      emailOnCriticalError: true,
      adminEmails: ['admin@apphgio.com'],
      updatedAt: serverTimestamp(),
    });

    await collections.settings.doc('appearance').set({
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      darkModeEnabled: true,
      updatedAt: serverTimestamp(),
    });

    console.log('Platform settings created');

    console.log('\\nSeeding completed successfully!');
    console.log('\\nAdmin credentials:');
    console.log('  Email: admin@apphgio.com');
    console.log('  Password: Admin123!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
