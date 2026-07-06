export interface Collection {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  topicCount?: number;
}

export interface CollectionCreateDto {
  name: string;
  description?: string;
  groupIds?: number[]; // Para vincular a grupos desde la creación
}