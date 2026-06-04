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
export declare const createOrder: (payload: OrderPayload) => Promise<OrderResponse>;
/**
 * Check payment status via Dischub proxy endpoint
 */
export declare const checkPaymentStatus: (orderId: string, recipient: string) => Promise<PaymentStatusResponse>;
/**
 * Initiate DiscHub payment flow
 * Stores pending order and redirects to DiscHub payment page
 */
export declare const initiateDiscHubPayment: (orderId: string) => void;
/**
 * Get pending order ID from localStorage
 */
export declare const getPendingOrderId: () => string | null;
/**
 * Clear pending order ID
 */
export declare const clearPendingOrderId: () => void;
//# sourceMappingURL=paymentService.d.ts.map