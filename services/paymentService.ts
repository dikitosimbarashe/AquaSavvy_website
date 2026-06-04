/**
 * DiscHub Payment Service
 * Handles payment processing through DiscHub API
 */

export interface OrderPayload {
  order_id: string;
  sender: string;
  recipient: string;
  amount: number;
  currency: 'USD' | 'ZWG';
  callback_url?: string;
  redirect_url?: string;
  mode?: 'test' | 'live';
}

export interface OrderResponse {
  status: string;
  message?: string;
  response_code?: number;
  [key: string]: any;
}

export interface PaymentStatusResponse {
  status: string;
  message?: string;
  order_id?: string;
  recipient?: string;
  sender?: string;
  currency?: string;
  amount?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Create a payment order via Dischub proxy endpoint
 */
export const createOrder = async (payload: OrderPayload): Promise<OrderResponse> => {
  try {
    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to create payment order');
    }

    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Check payment status via Dischub proxy endpoint
 */
export const checkPaymentStatus = async (orderId: string, recipient: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await fetch('/api/payment/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order_id: orderId, recipient })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to check payment status');
    }

    return data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

/**
 * Initiate DiscHub payment flow
 * Stores pending order and redirects to DiscHub payment page
 */
export const initiateDiscHubPayment = (orderId: string): void => {
  try {
    localStorage.setItem('dischub_pending_order_id', orderId);
    window.location.href = `https://dischub.co.zw/api/make/payment/to/${orderId}`;
  } catch (error) {
    console.error('Error initiating DiscHub payment:', error);
    throw new Error('Failed to initiate payment');
  }
};

/**
 * Get pending order ID from localStorage
 */
export const getPendingOrderId = (): string | null => {
  return localStorage.getItem('dischub_pending_order_id');
};

/**
 * Clear pending order ID
 */
export const clearPendingOrderId = (): void => {
  localStorage.removeItem('dischub_pending_order_id');
};
