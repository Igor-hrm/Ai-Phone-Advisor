import styles from './CatalogCard.module.scss';

import type { PhoneDetails } from '../../types';

import { Link, useSearchParams } from 'react-router-dom';

import { useUnavailablePopup } from '../../hooks';

type CatalogCardProps = {
  product: PhoneDetails;
  showFullPrice?: boolean;
};

export const CatalogCard = ({
  product,
  showFullPrice: forceFullPrice = false,
}: CatalogCardProps) => {
  const [searchParams] = useSearchParams();

  const { showUnavailable } = useUnavailablePopup();

  const category = searchParams.get('category');

  const showPrice =
    forceFullPrice ||
    category === 'phones' ||
    category === 'tablets' ||
    category === 'accessories';

  return (
    <div className={styles.catalogCard}>
      <Link to={`/product/${product.id}`} className={styles.catalogCard__image}>
        <img src={product.images[0]} alt={product.name} />
      </Link>

      <Link to={`/product/${product.id}`} className={styles.catalogCard__name}>
        {product.name}
      </Link>

      <div className={styles.catalogCard__price}>
        <p className={styles.catalogCard__currentPrice}>
          ${product.priceDiscount}
        </p>

        {showPrice && (
          <p className={styles.catalogCard__fullPrice}>
            ${product.priceRegular}
          </p>
        )}
      </div>

      <div className={styles.catalogCard__horizontalBar}></div>

      <div className={styles.catalogCard__info}>
        <div className={styles.catalogCard__infoItem}>
          <p>Screen</p>
          <p>{product.screen}</p>
        </div>

        <div className={styles.catalogCard__infoItem}>
          <p>Capacity</p>
          <p>{product.capacity}</p>
        </div>

        <div className={styles.catalogCard__infoItem}>
          <p>RAM</p>
          <p>{product.ram}</p>
        </div>
      </div>

      <div className={styles.catalogCard__buttons}>
        <button
          className={styles.catalogCard__addButton}
          onClick={() => showUnavailable()}
        >
          Add to cart
        </button>

        <button onClick={() => showUnavailable()}>
          <img src="./icons/Favourites_HeartLike.svg" alt="Add to favorite" />
        </button>
      </div>
    </div>
  );
};
