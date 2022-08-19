interface ISettings {
  tokenName: string;
  tokenTicker: string;
  decimalPlaces: number;
  totalSupply: string;
  graphqlUri: string;
  scannerAddressLink: string;
  scannerTxnLink: string;
  addresses: {
    [key: string]: string;
  };
}
export default settings as ISettings;
