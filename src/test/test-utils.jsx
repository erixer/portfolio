import React from 'react';
import { render } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext';
import { ContentProvider } from '../context/ContentContext';

export function renderWithProviders(ui, options = {}) {
  const Wrapper = ({ children }) => (
    <LanguageProvider>
      <ContentProvider>
        {children}
      </ContentProvider>
    </LanguageProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
