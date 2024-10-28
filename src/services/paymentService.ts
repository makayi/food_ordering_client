import axios from 'axios';

interface CartItem {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

interface PaymentRequest {
  items: CartItem[];
  totalAmount: number;
}
const API_URL = 'http://localhost:3001';
export const paymentService = {
  async processPayment(paymentDetails: PaymentRequest): Promise<string> {
    try {
      const response = await axios.post(`${API_URL}/initiate-payment`, paymentDetails);
      console.log(response.data.data.link);
      return response.data?.data?.link;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
}
}; 