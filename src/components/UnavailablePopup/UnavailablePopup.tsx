import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import styles from './UnavailablePopup.module.scss';

type UnavailablePopupContextType = {
  showUnavailable: (message?: string) => void;
};

const DEFAULT_MESSAGE = 'This feature is not available.';

const UnavailablePopupContext =
  createContext<UnavailablePopupContextType | null>(null);

export const UnavailablePopupProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [message, setMessage] = useState<string | null>(null);

  const showUnavailable = useCallback((text: string = DEFAULT_MESSAGE) => {
    setMessage(text);
  }, []);

  const close = useCallback(() => setMessage(null), []);

  // fecha com ESC
  useEffect(() => {
    if (message === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [message, close]);

  const value = useMemo(() => ({ showUnavailable }), [showUnavailable]);

  return (
    <UnavailablePopupContext.Provider value={value}>
      {children}

      {message !== null && (
        <div className={styles.overlay} onClick={close}>
          <div
            className={styles.popup}
            role="alertdialog"
            aria-modal="true"
            aria-label="Feature unavailable"
            onClick={event => event.stopPropagation()}
          >
            <p className={styles.popup__text}>{message}</p>

            <button
              type="button"
              className={styles.popup__button}
              onClick={close}
              autoFocus
            >
              OK
            </button>
          </div>
        </div>
      )}
    </UnavailablePopupContext.Provider>
  );
};

export const useUnavailablePopup = () => {
  const context = useContext(UnavailablePopupContext);

  if (!context) {
    throw new Error(
      'useUnavailablePopup must be used within UnavailablePopupProvider',
    );
  }

  return context;
};
