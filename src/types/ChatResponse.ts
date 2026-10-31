import type { PhoneDetails } from './PhoneDetails';

export interface ChatResponse {
  reply: string;
  products: PhoneDetails[];
}
