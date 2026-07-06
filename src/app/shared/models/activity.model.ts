// QUIZZES (ACTIVITIES)
export interface Activity {
  id?: number;
  title: string;
  description?: string;
  type: 'QUIZ' | 'FLASHCARD';
  status: 'PUBLISHED' | 'DRAFT' | 'INACTIVE'; 
  generatedByAi: boolean;
  topicId: number;
  questions?: Question[];
  createdAt?: string;
  personal?: boolean;
}

export interface Question {
  id?: number;
  statement: string;
  explanation?: string;
  orderIdx?: number;
  options: QuestionOption[];
}

export interface QuestionOption {
  id?: number;
  text: string;
  correct: boolean;
}

export interface FlashcardSet {
  id?: number;
  title: string;
  topicId?: number;
  topicName?: string;
  generatedByAi?: boolean;
  flashcards: Flashcard[];
}

export interface Flashcard {
  id?: number;
  front: string;   // El backend usa "front" y "back"
  back: string;
}

// DTO para crear un quiz (coincide con LearningActivityDto del backend)
export interface CreateQuizDto {
  title: string;
  description?: string;
  type: 'QUIZ';
  status: 'PUBLISHED' | 'DRAFT';
  generatedByAi?: boolean;
  personal?: boolean;
  questions: {
    statement: string;
    explanation?: string;
    options: { text: string; correct: boolean }[];
  }[];
}

// DTO para crear un set de flashcards (coincide con CreateFlashcardSetDto)
export interface CreateFlashcardSetDto {
  title: string;
  generatedByAi?: boolean;
  flashcards: { front: string; back: string }[];
}