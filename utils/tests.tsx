import { ReactNode } from 'react';
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

export function asFragmentBaseElement(baseElement: Element) {
  const template = document.createElement('template');
  template.innerHTML = baseElement.outerHTML;
  return template.content;
}

export function exceptRowsCountToEqual(count: number): void {
  const totalRows = document.getElementsByTagName('tr').length;
  expect(totalRows - 1).toEqual(count);
}

export function exceptColumnsCountToEqual(count: number): void {
  const totalCells = document.getElementsByTagName('td').length;
  const totalRows = document.getElementsByTagName('tr').length;

  expect(totalCells / (totalRows - 1)).toEqual(count);
}
