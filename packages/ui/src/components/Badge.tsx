import * as React from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      secondary: 'bg-purple-100 text-purple-800',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center font-medium rounded-full', variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Badge para estados de herramientas
export const ToolStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    active: { variant: 'success', label: 'Activo' },
    beta: { variant: 'warning', label: 'Beta' },
    maintenance: { variant: 'danger', label: 'Mantenimiento' },
    deprecated: { variant: 'default', label: 'Obsoleto' },
    'coming-soon': { variant: 'info', label: 'Proximamente' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Badge para roles de usuario
export const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const roleConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    admin: { variant: 'danger', label: 'Admin' },
    workspace: { variant: 'info', label: 'Workspace' },
    school: { variant: 'secondary', label: 'Escuela' },
    client: { variant: 'success', label: 'Cliente' },
    beta: { variant: 'warning', label: 'Beta' },
    free: { variant: 'default', label: 'Free' },
  };

  const config = roleConfig[role] || { variant: 'default', label: role };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
