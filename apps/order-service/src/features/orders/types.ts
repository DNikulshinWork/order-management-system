export interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateOrderInput = Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
export type UpdateOrderInput = Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>;
