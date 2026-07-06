// === Learning Path / Progreso ===
export interface PathNode {
  id: number;
  topicName: string;
  orderIdx: number;
  completed: boolean;
  masteryScore: number;
}

export interface ConceptualGap {
  id: number;
  topicName: string;
  description: string;
  resolved: boolean;
}

export interface LearningPath {
  id: number;
  collectionName: string;
  targetPercentage: number;
  currentPercentage: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
  updatedAt: string;
  pathNodes: PathNode[];
  conceptualGaps: ConceptualGap[];
}

export interface SubTopicGap {
  subTopicName: string;
  topicName: string;
  errorRate: number;
  totalQuestions: number;
  incorrectAnswers: number;
}

// === Resultados de actividades ===
export interface ActivityResult {
  id: number;
  activityTitle: string;
  studentEmail: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  status: string;
  completedAt: string;
}

export interface AnswerDetail {
  questionText: string;
  selectedOptionText: string;
  correctOptionText: string;
  explanation?: string;
  isCorrect: boolean;
}

export interface ActivityResultDetail {
  id: number;
  activityTitle: string;
  studentEmail?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  status: string;
  completedAt: string;
  answers: AnswerDetail[];
}

export interface StudentAnswerSubmit {
  questionText: string;
  selectedOptionText: string;
}

export interface ActivityResultSubmitDto {
  timeSpentSeconds: number;
  answers: StudentAnswerSubmit[];
}

export interface TimelinePoint {
  date: string;
  score: number;
  activityTitle: string;
  topicName: string;
}

// === Actividades (quiz) ===
export interface QuestionOption {
  id?: number;
  text: string;
  correct?: boolean;
}

export interface Question {
  id?: number;
  statement: string;
  explanation?: string;
  orderIdx?: number;
  options: QuestionOption[];
}

export interface LearningActivity {
  id: number;
  title: string;
  description?: string;
  type: 'QUIZ' | 'FLASHCARD';
  status: string;
  generatedByAi?: boolean;
  createdAt?: string;
  personal?: boolean;
  questions?: Question[];
  topicId?: number;
  topicName?: string;
  dueDate?: string;
}

// === Flashcards ===
export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

export interface FlashcardSet {
  id: number;
  title: string;
  topicId: number;
  topicName?: string;
  flashcards: Flashcard[];
}
