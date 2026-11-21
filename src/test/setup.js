import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock window.scrollTo
window.scrollTo = () => {};

// Mock Element.prototype.scrollIntoView
Element.prototype.scrollIntoView = () => {};

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = MockResizeObserver;

// Mock document.fonts for SplitText component
if (!document.fonts) {
  document.fonts = {
    status: 'loaded',
    ready: Promise.resolve(),
    addEventListener: () => {},
    removeEventListener: () => {},
    check: () => true,
    load: () => Promise.resolve([]),
  };
}
