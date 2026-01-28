# Apphgio Tools Platform

Plataforma de gestion de herramientas tecnologicas de produccion.

## Stack Tecnologico

- **Frontend:** Next.js 14 (React)
- **Backend:** NestJS (Node.js)
- **Base de Datos:** PostgreSQL (Supabase) + MongoDB Atlas
- **Monorepo:** Turborepo

## Estructura del Proyecto

```
apphgio-tools/
├── apps/
│   ├── web/          # Frontend publico (Next.js)
│   ├── admin/        # Panel de administracion (Next.js)
│   └── api/          # Backend API (NestJS)
├── packages/
│   ├── types/        # TypeScript types compartidos
│   ├── config/       # Configuracion compartida
│   ├── database/     # Prisma schema y cliente
│   └── ui/           # Componentes UI compartidos
└── docs/             # Documentacion
```

## Requisitos

- Node.js >= 18.0.0
- npm >= 10.0.0
- PostgreSQL (Supabase)
- MongoDB (Atlas)

## Configuracion

1. Clonar el repositorio:
```bash
git clone https://github.com/erikguzman-hash/apphgiotools.git
cd apphgiotools
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. Generar cliente de Prisma:
```bash
npm run db:generate
```

5. Crear tablas en la base de datos:
```bash
npm run db:push
```

6. Iniciar en desarrollo:
```bash
npm run dev
```

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia todos los servicios en desarrollo |
| `npm run dev:web` | Inicia solo el frontend publico |
| `npm run dev:admin` | Inicia solo el panel admin |
| `npm run dev:api` | Inicia solo el backend API |
| `npm run build` | Compila todos los proyectos |
| `npm run lint` | Ejecuta el linter |
| `npm run db:generate` | Genera el cliente Prisma |
| `npm run db:push` | Aplica schema a la base de datos |
| `npm run db:studio` | Abre Prisma Studio |

## Roles de Usuario

| Rol | Acceso |
|-----|--------|
| Admin | Gestion completa del sistema |
| Workspace | Acceso total a herramientas |
| School | Herramientas de cursos inscritos |
| Client | Herramientas asignadas |
| Beta | Acceso limitado (pruebas) |
| Free | Acceso muy limitado |

## API Documentation

Una vez iniciado el servidor, la documentacion Swagger esta disponible en:
`http://localhost:4000/api/docs`

## Licencia

Privado - Apphgio
