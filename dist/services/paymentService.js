"use strict";
/**
 * DiscHub Payment Service
 * Handles payment processing through DiscHub API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearPendingOrderId = exports.getPendingOrderId = exports.initiateDiscHubPayment = exports.checkPaymentStatus = exports.createOrder = void 0;
/**
 * Create a payment order via Dischub proxy endpoint
 */
const createOrder = async (payload) => {
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
            throw new Error((data === null || data === void 0 ? void 0 : data.message) || 'Failed to create payment order');
        }
        return data;
    }
    catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};
exports.createOrder = createOrder;
/**
 * Check payment status via Dischub proxy endpoint
 */
const checkPaymentStatus = async (orderId, recipient) => {
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
            throw new Error((data === null || data === void 0 ? void 0 : data.message) || 'Failed to check payment status');
        }
        return data;
    }
    catch (error) {
        console.error('Error checking payment status:', error);
        throw error;
    }
};
exports.checkPaymentStatus = checkPaymentStatus;
/**
 * Initiate DiscHub payment flow
 * Stores pending order and redirects to DiscHub payment page
 */
const initiateDiscHubPayment = (orderId) => {
    try {
        localStorage.setItem('dischub_pending_order_id', orderId);
        window.location.href = `https://dischub.co.zw/api/make/payment/to/${orderId}`;
    }
    catch (error) {
        console.error('Error initiating DiscHub payment:', error);
        throw new Error('Failed to initiate payment');
    }
};
exports.initiateDiscHubPayment = initiateDiscHubPayment;
/**
 * Get pending order ID from localStorage
 */
const getPendingOrderId = () => {
    return localStorage.getItem('dischub_pending_order_id');
};
exports.getPendingOrderId = getPendingOrderId;
/**
 * Clear pending order ID
 */
const clearPendingOrderId = () => {
    localStorage.removeItem('dischub_pending_order_id');
};
exports.clearPendingOrderId = clearPendingOrderId;
//# sourceMappingURL=paymentService.js.map