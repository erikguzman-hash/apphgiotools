'use client';

import { ToolCard } from '@apphgio/ui';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  status: string;
  categoryName: string;
  tags: string[];
  stats?: {
    totalAccess?: number;
    avgRating?: number;
  };
}

interface ToolsGridProps {
  tools: Tool[];
  onToolClick: (toolId: string) => void;
}

export const ToolsGrid = ({ tools, onToolClick }: ToolsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map(tool => (
        <ToolCard
          key={tool.id}
          id={tool.id}
          name={tool.name}
          description={tool.description}
          icon={tool.icon}
          type={tool.type}
          status={tool.status}
          categoryName={tool.categoryName}
          tags={tool.tags}
          stats={tool.stats}
          onClick={() => onToolClick(tool.id)}
        />
      ))}
    </div>
  );
};
