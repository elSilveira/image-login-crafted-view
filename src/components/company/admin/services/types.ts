
export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  categoryId?: string;
  categoryName?: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}
