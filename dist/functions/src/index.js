"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.validateWaterMetrics = exports.onWaterMetricsUpdate = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const express_1 = __importDefault(require("express"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
/**
 * Triggered when water metrics are updated in system_settings/water_metrics.
 * This function logs the change and can trigger global recalculations.
 */
exports.onWaterMetricsUpdate = (0, firestore_1.onDocumentUpdated)('system_settings/water_metrics', async (event) => {
    const change = event.data;
    if (!change)
        return;
    const newData = change.after.data();
    const previousData = change.before.data();
    if (!newData || !previousData)
        return;
    console.log('Water metrics updated by:', newData.updatedBy);
    // Trigger event for gamification system
    await db.collection('system_events').add({
        type: 'WATER_METRICS_CHANGED',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        payload: {
            previousDaily: previousData.dailyPerPersonLiters,
            newDaily: newData.dailyPerPersonLiters,
            updatedBy: newData.updatedBy
        }
    });
});
/**
 * Validates water metrics before they are saved.
 */
exports.validateWaterMetrics = (0, firestore_1.onDocumentWritten)('system_settings/water_metrics', async (event) => {
    const change = event.data;
    if (!change || !change.after.exists)
        return; // Deletion or no data
    const data = change.after.data();
    if (!data)
        return;
    // Validation logic
    const errors = [];
    if (data.dailyPerPersonLiters <= 0)
        errors.push('Daily liters must be positive');
    if (data.dailyPerPersonLiters > 1000)
        errors.push('Daily liters seems excessively high');
    if (errors.length > 0) {
        console.error('Validation failed for water metrics:', errors);
    }
});
// --- HTTP API proxy for Dischub (orders + payment status) ---
const DISCHUB_API_KEY = process.env.DISCHUB_API_KEY || '084978e58f844ea5aaee1960d4f997ba';
const apiApp = (0, express_1.default)();
apiApp.use(express_1.default.json());
const getApiKeyFromReq = (req) => {
    return req.headers['x-api-key'] || DISCHUB_API_KEY;
};
const validatePhoneNumber = (phone) => {
    if (typeof phone !== 'string')
        return false;
    const normalized = phone.replace(/\s+/g, '');
    return /^(\+263|0?263|0)?7\d{8}$/.test(normalized) || /^(\+263|0?263|0)?11\d{7}$/.test(normalized);
};
apiApp.post('/orders/create', async (req, res) => {
    try {
        const apiKey = getApiKeyFromReq(req);
        if (!apiKey) {
            return res.status(401).json({ status: 'error', message: 'missing api key in request headers', response_code: 401 });
        }
        const { order_id, sender, recipient, amount, currency, callback_url, redirect_url, mode = 'test' } = req.body;
        if (typeof order_id !== 'string') {
            return res.status(400).json({ status: 'error', message: 'order_id must be posted as a string', response_code: 400 });
        }
        if (!order_id || order_id.length > 30) {
            return res.status(422).json({ status: 'error', message: 'order_id must be 30 characters or less', response_code: 422 });
        }
        if (!sender || !validatePhoneNumber(sender)) {
            return res.status(422).json({ status: 'error', message: 'invalid sender phone number format', response_code: 422 });
        }
        if (!recipient || typeof recipient !== 'string' || !recipient.includes('@')) {
            return res.status(422).json({ status: 'error', message: 'missing or invalid required keys in request data', response_code: 422 });
        }
        if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0 || amount >= 100000) {
            return res.status(422).json({ status: 'error', message: 'amount must be greater than 0 and less than 100000', response_code: 422 });
        }
        if (currency !== 'USD' && currency !== 'ZWG') {
            return res.status(400).json({ status: 'error', message: 'invalid or unsupported currency. Accepted values: USD, ZWG', response_code: 400 });
        }
        const payload = { order_id, sender, recipient, amount, currency, callback_url, redirect_url, mode };
        const response = await fetch('https://dischub.co.zw/api/orders/create/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
            return res.status(response.status).json(data !== null && data !== void 0 ? data : { status: 'error', message: 'order could not be created due to an internal error', response_code: response.status });
        }
        return res.status(response.status).json(data);
    }
    catch (error) {
        console.error('Order creation proxy error:', error);
        return res.status(500).json({ status: 'error', message: 'order could not be created due to an internal error', response_code: 500 });
    }
});
apiApp.post('/payment/status', async (req, res) => {
    try {
        const apiKey = getApiKeyFromReq(req);
        if (!apiKey) {
            return res.status(401).json({ status: 'error', message: 'missing api key in request headers', response_code: 401 });
        }
        const { order_id, recipient } = req.body;
        if (typeof order_id !== 'string' || !order_id) {
            return res.status(422).json({ status: 'error', message: 'missing or invalid required keys in request data', response_code: 422 });
        }
        if (!recipient || typeof recipient !== 'string' || !recipient.includes('@')) {
            return res.status(422).json({ status: 'error', message: 'missing or invalid required keys in request data', response_code: 422 });
        }
        const response = await fetch('https://dischub.co.zw/api/payment/status/3/step/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Api-Key': apiKey },
            body: JSON.stringify({ order_id, recipient })
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
            return res.status(response.status).json(data !== null && data !== void 0 ? data : { status: 'error', message: 'an unexpected error occurred while retrieving the order', response_code: response.status });
        }
        return res.status(response.status).json(data);
    }
    catch (error) {
        console.error('Payment status proxy error:', error);
        return res.status(500).json({ status: 'error', message: 'an unexpected error occurred while retrieving the order', response_code: 500 });
    }
});
exports.api = (0, https_1.onRequest)(apiApp);
//# sourceMappingURL=index.js.map