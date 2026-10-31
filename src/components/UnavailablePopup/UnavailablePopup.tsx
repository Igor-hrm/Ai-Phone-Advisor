import styles from './UnavailablePopup.module.scss';

import { useEffect } from 'react';

type UnavailablePopupProps = {
  message: string;
  onClose: () => void;
};

export const UnavailablePopup = ({
  message,
  onClose,
}: UnavailablePopupProps) => {
  useEffect(() => {
    // fecha o popup com a tecla ESC
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.popup} onClick={onClose}>
      <div
        className={styles.popup__box}
        role="alertdialog"
        aria-modal="true"
        aria-label="Feature unavailable"
        onClick={event => event.stopPropagation()}
      >
        <p className={styles.popup__text}>{message}</p>

        <button
          className={styles.popup__button}
          type="button"
          onClick={onClose}
          autoFocus
        >
          OK
        </button>
      </div>
    </div>
  );
};
