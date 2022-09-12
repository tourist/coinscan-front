import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import {
  ErrorHandler,
  onError as apolloClientOnError,
} from '@apollo/client/link/error';
import settings from '../settings.json';

export const paginationMerge = (existing: any, incoming: any) => {
  return [...incoming];
};

export const createApolloClient = (onError: ErrorHandler = () => {}) => {
  const httpLink = new HttpLink({
    uri: settings.graphqlUri,
  });
  const errorLink = apolloClientOnError(onError);

  return new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    defaultOptions: {
      query: { errorPolicy: 'ignore' },
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            walletTransactions: {
              keyArgs: false,
              merge: paginationMerge,
            },
            wallets: {
              keyArgs: false,
              merge: paginationMerge,
            },
            transactions: {
              keyArgs: false,
              merge: paginationMerge,
            },
          },
        },
      },
    }),
  });
};

export default createApolloClient;
