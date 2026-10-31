import type { ChatResponse } from '../types';

export const getRecommendations = async (
  message: string,
): Promise<ChatResponse> => {
  const response = await fetch('http://localhost:3001/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }

  return response.json();
};
