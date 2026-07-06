export interface Topic {
  id: number;
  name: string;
  description?: string;
  orderIdx: number;
  collectionId: number;
  activitiesCount?: number;
}

export interface TopicCreateDto {
  name: string;
  description?: string;
  orderIdx?: number;
}