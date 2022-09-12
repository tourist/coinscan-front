import { ApolloClient } from '@apollo/client';
import { createApolloClient, paginationMerge } from './apolloClient';

test('createApolloClient returns apollo client instance', () => {
  // mock non-existing fetch function
  const originalGlobalFetch = global.fetch;
  // @ts-ignore
  global.fetch = jest.fn(() => {});
  const client = createApolloClient(() => {});
  expect(client).toBeInstanceOf(ApolloClient);
  jest.clearAllMocks();
  // @ts-ignore
  global.fetch = originalGlobalFetch;
});

test('pagination merger function returns only new page data', () => {
  const existingContent = [1, 2, 3, 4];
  const newContent = [5, 6, 7, 8];
  expect(paginationMerge(existingContent, newContent)).toEqual([5, 6, 7, 8]);
});
