export const getValueOrFirstValueFromRouterQueryParam = (
  queryParam: string[] | string | undefined
): string => {
  const value = Array.isArray(queryParam) ? queryParam[0] : queryParam;
  return value || '';
};
