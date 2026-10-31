import type { PhoneDetails } from './PhoneDetails';

export interface ChatMessage {
  id: number;
  author: 'user' | 'bot';
  text: string;
  products?: PhoneDetails[];
}
