import type { PhoneDetails } from '../types';

export type ChatResponse = {
  reply: string;
  products: PhoneDetails[];
};

export const sendMessage = async (message: string): Promise<ChatResponse> => {
  const response = await fetch('http://localhost:3001/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to get recommendations');
  }

  return response.json();
};
