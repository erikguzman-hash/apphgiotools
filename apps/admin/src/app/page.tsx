'use client';

import { Card, CardContent, CardHeader } from '@apphgio/ui';

// Datos de ejemplo para el dashboard
const stats = [
  { label: 'Total Usuarios', value: '1,234', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Herramientas Activas', value: '45', change: '+3', color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Accesos Hoy', value: '892', change: '+28%', color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Errores Activos', value: '7', change: '-2', color: 'text-red-600', bg: 'bg-red-100' },
];

const recentActivity = [
  { id: 1, action: 'Usuario creado', user: 'juan@empresa.com', time: 'Hace 5 min' },
  { id: 2, action: 'Herramienta accedida', user: 'maria@empresa.com', tool: 'Generador de Reportes', time: 'Hace 12 min' },
  { id: 3, action: 'Error resuelto', user: 'admin@apphgio.com', error: 'API Timeout', time: 'Hace 30 min' },
  { id: 4, action: 'Nueva herramienta', user: 'admin@apphgio.com', tool: 'Dashboard Analytics', time: 'Hace 1 hora' },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general de la plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} vs ayer
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <span className={`text-xl font-bold ${stat.color}`}>
                    {stat.label.charAt(0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user} {activity.tool && `- ${activity.tool}`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Acciones Rapidas</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
                <span className="text-2xl mb-2 block">+</span>
                <span className="text-sm font-medium text-primary-700">Nueva Herramienta</span>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                <span className="text-2xl mb-2 block">👤</span>
                <span className="text-sm font-medium text-green-700">Nuevo Usuario</span>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <span className="text-2xl mb-2 block">📊</span>
                <span className="text-sm font-medium text-purple-700">Ver Reportes</span>
              </button>
              <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
                <span className="text-2xl mb-2 block">⚙️</span>
                <span className="text-sm font-medium text-orange-700">Configuracion</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
