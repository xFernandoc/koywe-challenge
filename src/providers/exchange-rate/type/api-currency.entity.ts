export interface CurrencyData {
  currency: string;
  price: string;
  timestamp: string;
}

export type PriceDataResponse = {
  [key: string]: CurrencyData;
};

export interface CurrencyInfoResponse {
  fullName: string;
}

export type CurrencyListResponse = [
  {
    [key: string]: CurrencyInfoResponse;
  },
];
