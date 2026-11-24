import React from 'react';

declare global {
  interface Window {
    Cookiebot?: {
      renew: () => void;
    };
  }
}

interface CookiePreferencesButtonProps {
  className: string;
}

export const CookiePreferencesButton: React.FC<CookiePreferencesButtonProps> = ({ className }) => {
  const openPreferences = () => {
    if (!window.Cookiebot) {
      console.error('Cookiebot is not available; cookie preferences cannot be opened.');
      return;
    }

    window.Cookiebot.renew();
  };

  return (
    <button type="button" onClick={openPreferences} className={className}>
      Preferenze cookie
    </button>
  );
};
