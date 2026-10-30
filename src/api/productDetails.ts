import { getPhones } from './phones';
import { normalizeColor } from '../utils/productColors';

import type { PhoneDetails } from '../types';

export type PhoneDetailsWithNumericId = PhoneDetails & {
  numericId: number;
};

export const getProductById = async (
  productId: string,
): Promise<PhoneDetailsWithNumericId | undefined> => {
  try {
    const allProducts = await getPhones();

    const index = allProducts.findIndex(product => product.id === productId);

    if (index === -1) {
      return undefined;
    }

    return {
      ...allProducts[index],
      numericId: index + 1,
    };
  } catch {
    throw new Error('Failed to fetch product details');
  }
};

export const getSibling = async (
  product: PhoneDetails,
  changes: { color?: string; capacity?: string },
): Promise<PhoneDetails | undefined> => {
  try {
    const allProducts = await getPhones();

    const color = changes.color ?? product.color;
    const capacity = changes.capacity ?? product.capacity;

    return allProducts.find(
      p =>
        p.namespaceId === product.namespaceId &&
        p.capacity === capacity &&
        normalizeColor(p.color) === normalizeColor(color),
    );
  } catch {
    throw new Error('Failed to fetch product details');
  }
};
