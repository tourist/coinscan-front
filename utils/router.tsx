export const getValueOrFirstValueFromRouterQueryParam = (
  queryParam: string[] | string | undefined
): string =>
  Array.isArray(queryParam) ? queryParam[0] : queryParam ? queryParam : '';
