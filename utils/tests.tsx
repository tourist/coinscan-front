import { ReactNode } from 'react';
import { faker } from '@faker-js/faker';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { loadSchemaSync } from '@graphql-tools/load';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import { addMocksToSchema, IMocks } from '@graphql-tools/mock';
import { IResolvers } from '@graphql-tools/utils';
import { render as rtlRender } from '@testing-library/react';

const schema = loadSchemaSync('./graphql.schema.json', {
  loaders: [new JsonFileLoader()],
});

export function renderWithApolloMocks(
  component: ReactNode,
  mocks: IMocks<IResolvers>
) {
  const mockSchema = addMocksToSchema({
    schema,
    ...mocks,
  });

  const client = new ApolloClient({
    link: new SchemaLink({ schema: mockSchema }),
    cache: new InMemoryCache(),
  });

  return rtlRender(
    <ApolloProvider client={client}>{component}</ApolloProvider>
  );
}
