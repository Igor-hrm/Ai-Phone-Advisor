import styles from './ProductOptions.module.scss';

import { useNavigate } from 'react-router-dom';

import { getColorHex, normalizeColor } from '../../../utils/productColors';

import {
  getSibling,
  type PhoneDetailsWithNumericId,
} from '../../../api/productDetails';
import { useUnavailablePopup } from '../../../hooks';

type ProductOpitionsProps = {
  product: PhoneDetailsWithNumericId;
};

export const ProductOpitions = ({ product }: ProductOpitionsProps) => {
  const { showUnavailable } = useUnavailablePopup();

  const navigate = useNavigate();

  const goToSibling = async (changes: {
    color?: string;
    capacity?: string;
  }) => {
    const sibling = await getSibling(product, changes);

    if (sibling) {
      navigate(`/product/${sibling.id}`);
    }
  };

  const handleColor = (color: string) => {
    if (normalizeColor(color) !== normalizeColor(product.color)) {
      goToSibling({ color });
    }
  };

  const handleCapacity = (capacity: string) => {
    if (capacity !== product.capacity) {
      goToSibling({ capacity });
    }
  };

  return (
    <section className={styles.options}>
      <div className={styles.options__colorsBox}>
        <div className={styles['options__colorsBox--text']}>
          <p>Available colors</p>
          <p>ID: {String(product.numericId).padStart(6, '0')}</p>
        </div>

        <div className={styles['options__colorsBox--colors']}>
          {product.colorsAvailable.map(color => {
            const isActive =
              normalizeColor(color) === normalizeColor(product.color);

            return (
              <label
                key={color}
                className={styles['options__colorsBox--label']}
              >
                <input
                  type="radio"
                  name="color"
                  value={color}
                  checked={isActive}
                  onChange={() => handleColor(color)}
                  className={styles.visuallyHidden}
                  aria-label={color}
                />
                <span
                  className={styles['options__colorsBox--color']}
                  style={{ backgroundColor: getColorHex(color) }}
                />
              </label>
            );
          })}
        </div>
      </div>

      <div className={styles.options__bar}></div>

      <div className={styles.options__capacityBox}>
        <p className={styles['options__capacityBox--text']}>Select capacity</p>

        <div className={styles['options__capacityBox--capacities']}>
          {product.capacityAvailable.map(capacity => (
            <button
              key={capacity}
              type="button"
              aria-pressed={capacity === product.capacity}
              className={`${styles['options__capacityBox--capacity']} ${
                capacity === product.capacity ? styles.active : ''
              }`}
              onClick={() => handleCapacity(capacity)}
            >
              {capacity}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.options__bar}></div>

      <div className={styles.options__price}>
        <p>$ {product.priceDiscount}</p>
        <p>$ {product.priceRegular}</p>
      </div>

      <div className={styles.options__buttons}>
        <button
          type="button"
          className={styles['options__buttons--cart']}
          onClick={() => showUnavailable()}
        >
          Add to cart
        </button>

        <button
          type="button"
          aria-label="Add to favorites"
          className={styles['options__buttons--favorite']}
          onClick={() => showUnavailable()}
        >
          <img src="./icons/Favourites_HeartLike.svg" alt="" />
        </button>
      </div>

      <div className={styles.options__specs}>
        <div className={`${styles['options__specs--box']}`}>
          <p>Screen</p>
          <p>{product.screen}</p>
        </div>
        <div className={`${styles['options__specs--box']}`}>
          <p>Resolution</p>
          <p>{product.resolution}</p>
        </div>
        <div className={`${styles['options__specs--box']}`}>
          <p>Processor</p>
          <p>{product.processor}</p>
        </div>
        <div className={`${styles['options__specs--box']}`}>
          <p>RAM</p>
          <p>{product.ram}</p>
        </div>
      </div>
    </section>
  );
};
