// =============================================
// TIPOS DE CATEGORIAS Y SECCIONES - Apphgio Tools
// =============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  toolCount: number; // Denormalizado
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  toolCount: number; // Denormalizado
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  icon?: string;
  color?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CreateSectionDto {
  name: string;
  description: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateSectionDto extends Partial<CreateSectionDto> {}

// Para el menu de navegacion
export interface CategoryWithSections extends Category {
  sections: Section[];
}

// Para filtros
export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  icon: string;
  toolCount: number;
}

export interface SectionOption {
  id: string;
  name: string;
  slug: string;
  toolCount: number;
}
