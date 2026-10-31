import { useContext } from 'react';
import { UnavailablePopupContext } from '../contexts/UnavailablePopupContext';

export const useUnavailablePopup = () => {
  const context = useContext(UnavailablePopupContext);

  if (!context) {
    throw new Error(
      'useUnavailablePopup must be used within a UnavailablePopupProvider',
    );
  }

  return context;
};
