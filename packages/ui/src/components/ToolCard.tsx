import * as React from 'react';
import { cn } from '../utils/cn';
import { Card } from './Card';
import { Badge, ToolStatusBadge } from './Badge';

export interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  status: string;
  categoryName?: string;
  tags?: string[];
  stats?: {
    totalAccess?: number;
    avgRating?: number;
  };
  onClick?: () => void;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  name,
  description,
  icon,
  type,
  status,
  categoryName,
  tags = [],
  stats,
  onClick,
  className,
}) => {
  const typeLabels: Record<string, string> = {
    'web-app': 'Web App',
    'desktop-app': 'Desktop',
    'mobile-app': 'Mobile',
    api: 'API',
    script: 'Script',
    template: 'Plantilla',
    resource: 'Recurso',
    documentation: 'Docs',
  };

  return (
    <Card
      variant="hover"
      className={cn('group overflow-hidden', className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="p-6">
        {/* Header con icono y status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Icono placeholder - en produccion usar iconos reales */}
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-xl font-bold">
              {icon ? icon.charAt(0).toUpperCase() : name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {name}
              </h3>
              {categoryName && <p className="text-sm text-gray-500">{categoryName}</p>}
            </div>
          </div>
          <ToolStatusBadge status={status} />
        </div>

        {/* Descripcion */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

        {/* Tipo y tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="info" size="sm">
            {typeLabels[type] || type}
          </Badge>
          {tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{stats.totalAccess || 0} accesos</span>
            </div>
            {stats.avgRating && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{stats.avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

ToolCard.displayName = 'ToolCard';
