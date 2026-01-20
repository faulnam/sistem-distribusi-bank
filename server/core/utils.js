/**
 * SERVER CORE - Utilities
 */

// Generate unique transaction ID
export function generateTransactionId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRX${timestamp}${random}`;
}

// Generate account number (4 digit)
export function generateAccountNumber() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Format currency to number
export function parseAmount(amount) {
    const parsed = parseFloat(amount);
    return isNaN(parsed) ? 0 : Math.abs(parsed);
}

// Format response
export function successResponse(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
        status: 'success',
        message,
        ...data
    });
}

export function errorResponse(res, message = 'Error', statusCode = 400, errors = null) {
    const response = {
        status: 'error',
        message
    };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
}

export default {
    generateTransactionId,
    generateAccountNumber,
    parseAmount,
    successResponse,
    errorResponse
};
