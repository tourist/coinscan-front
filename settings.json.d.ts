interface ISettings {
  decimalPlaces: number;
  totalSupply: string;
  graphQLUri: string;
  addresses: {
    [key: string]: string;
  };
}
export default settings as ISettings;
