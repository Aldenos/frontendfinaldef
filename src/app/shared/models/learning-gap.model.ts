export interface StudentLearningPath {
  studentName: string;
  studentEmail: string;
  collectionName: string;
  currentPercentage: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
  completedTopics: number;
  totalTopics: number;
  completionRate: number;
}

export interface GroupPerformance {
  groupCode: string;
  topicAverages: Record<string, number>;
}
