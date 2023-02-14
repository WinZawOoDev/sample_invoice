interface Items {
  name: string;
  price: number;
  qty: number;
  total: number;
}

export interface Invoice {
  id?: string;
  name: string;
  items: Items[];
  subtotal: number;
  tax: number;
  total: number;
}
