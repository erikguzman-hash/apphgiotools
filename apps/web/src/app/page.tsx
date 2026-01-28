'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ToolsGrid } from '@/components/ToolsGrid';
import { FilterBar } from '@/components/FilterBar';
import { Spinner } from '@apphgio/ui';

// Datos de ejemplo (en produccion vendran de Firebase)
const mockTools = [
  {
    id: '1',
    name: 'Generador de Reportes',
    description: 'Herramienta para generar reportes automatizados de ventas y operaciones.',
    icon: 'R',
    type: 'web-app',
    status: 'active',
    categoryName: 'Productividad',
    tags: ['reportes', 'automatizacion'],
    stats: { totalAccess: 1250, avgRating: 4.5 },
  },
  {
    id: '2',
    name: 'Dashboard Analytics',
    description: 'Panel de control con metricas en tiempo real del negocio.',
    icon: 'D',
    type: 'web-app',
    status: 'active',
    categoryName: 'Analytics',
    tags: ['metricas', 'dashboard'],
    stats: { totalAccess: 890, avgRating: 4.8 },
  },
  {
    id: '3',
    name: 'API de Integraciones',
    description: 'API REST para integracion con sistemas externos.',
    icon: 'A',
    type: 'api',
    status: 'active',
    categoryName: 'Desarrollo',
    tags: ['api', 'integracion'],
    stats: { totalAccess: 2100, avgRating: 4.2 },
  },
  {
    id: '4',
    name: 'Editor de Plantillas',
    description: 'Herramienta para crear y editar plantillas de documentos.',
    icon: 'E',
    type: 'web-app',
    status: 'beta',
    categoryName: 'Productividad',
    tags: ['plantillas', 'documentos'],
    stats: { totalAccess: 320, avgRating: 4.0 },
  },
  {
    id: '5',
    name: 'Sistema de Notificaciones',
    description: 'Gestor de notificaciones push y email para clientes.',
    icon: 'N',
    type: 'api',
    status: 'active',
    categoryName: 'Comunicacion',
    tags: ['notificaciones', 'email'],
    stats: { totalAccess: 1580, avgRating: 4.6 },
  },
  {
    id: '6',
    name: 'Analizador de Datos',
    description: 'Herramienta avanzada de analisis de datos con IA.',
    icon: 'AI',
    type: 'web-app',
    status: 'coming-soon',
    categoryName: 'Analytics',
    tags: ['ia', 'datos'],
    stats: { totalAccess: 0 },
  },
];

const mockCategories = [
  { id: 'all', name: 'Todas', count: 6 },
  { id: 'productividad', name: 'Productividad', count: 2 },
  { id: 'analytics', name: 'Analytics', count: 2 },
  { id: 'desarrollo', name: 'Desarrollo', count: 1 },
  { id: 'comunicacion', name: 'Comunicacion', count: 1 },
];

export default function HomePage() {
  const [tools, setTools] = useState(mockTools);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar herramientas
  const filteredTools = tools.filter(tool => {
    const matchesCategory =
      selectedCategory === 'all' ||
      tool.categoryName.toLowerCase() === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToolClick = (toolId: string) => {
    // En produccion, navegar al detalle de la herramienta
    console.log('Tool clicked:', toolId);
    alert(`Herramienta seleccionada: ${tools.find(t => t.id === toolId)?.name}`);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container-app py-8">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Herramientas Apphgio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Accede a todas las herramientas tecnologicas de la compania.
            Encuentra lo que necesitas para potenciar tu trabajo.
          </p>
        </div>

        {/* Filtros */}
        <FilterBar
          categories={mockCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Grid de herramientas */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <ToolsGrid tools={filteredTools} onToolClick={handleToolClick} />
        )}

        {/* Mensaje si no hay resultados */}
        {!loading && filteredTools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No se encontraron herramientas con los filtros seleccionados.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container-app py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Apphgio. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
