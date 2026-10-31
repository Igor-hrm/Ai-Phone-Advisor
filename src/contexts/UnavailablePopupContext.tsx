import { createContext, useState, type ReactNode } from 'react';

import { UnavailablePopup } from '../components/UnavailablePopup';

export interface UnavailablePopupProviderProps {
  children: ReactNode;
}

export interface UnavailablePopupContextType {
  showUnavailable: (message?: string) => void;
}

// O Provider recebe tudo que estiver dentro dele através de:
export const UnavailablePopupContext =
  createContext<UnavailablePopupContextType | null>(null);

export const UnavailablePopupProvider = ({
  children,
}: UnavailablePopupProviderProps) => {
  // null = popup fechado, texto = popup aberto mostrando essa mensagem
  const [message, setMessage] = useState<string | null>(null);

  const showUnavailable = (text: string = 'This feature is not available.') => {
    setMessage(text);
  };

  const closePopup = () => {
    setMessage(null);
  };

  return (
    <UnavailablePopupContext.Provider value={{ showUnavailable }}>
      {children}

      {message !== null && (
        <UnavailablePopup message={message} onClose={closePopup} />
      )}
    </UnavailablePopupContext.Provider>
  );
};
