export interface ServiceModel {
  id: number;
  name: string;
  price: number;
  durationM: number;
  description?: string;
  isActive?: boolean;
}

export interface ServiceCategory {
  categoryId: number;
  categoryName: string;
  services: ServiceModel[];
}
