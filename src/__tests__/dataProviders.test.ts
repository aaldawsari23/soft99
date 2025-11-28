import { createProvider, localProvider, apiProvider } from '@/lib/data-providers';

describe('data providers', () => {
  it('returns the local provider for local source', () => {
    const provider = createProvider({ source: 'local' });
    expect(provider).toBe(localProvider);
  });

  it('exposes the api provider stub for api source', () => {
    const provider = createProvider({ source: 'api' });
    expect(provider).toBe(apiProvider);
    expect(provider.getProducts).toBeDefined();
  });
});
