import { useState } from 'react';
import type { PhoneDetails } from '../../../types';
import styles from './ProductImages.module.scss';

type ProductImagesProps = {
  product: PhoneDetails;
};

export const ProductImages = ({ product }: ProductImagesProps) => {
  const [currentImage, setCurrentImage] = useState(product.images[0]);

  return (
    <section className={styles.images}>
      <div className={styles.images__principal}>
        <img src={currentImage} alt="Principal image" />
      </div>

      <div className={styles.images__secundary}>
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => setCurrentImage(image)}
            className={currentImage === image ? 'active' : ''}
          />
        ))}
      </div>
    </section>
  );
};
