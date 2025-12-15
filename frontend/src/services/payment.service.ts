import apiClient from "./api";

export interface PaymentProofUploadResponse {
    message: string;
    bookingId: string;
    paymentProofUrl: string;
    paymentStatus: string;
}

export interface PaymentVerifyResponse {
    message: string;
    bookingId: string;
    paymentStatus: string;
    paymentVerifiedAt: string;
}

export interface PaymentRejectResponse {
    message: string;
    bookingId: string;
    paymentStatus: string;
    paymentRejectionReason: string;
}

export interface PendingPayment {
    id: string;
    packageId: string;
    touristId: string;
    travelDate: string;
    travelersCount: number;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    paymentProofUrl: string;
    paymentProofUploadedAt: string;
    createdAt: string;
    // Extended info
    packageName?: string;
    touristName?: string;
    touristEmail?: string;
}

export interface QRISGenerateRequest {
    amount: number;
    bookingId: string;
}

export interface QRISGenerateResponse {
    qrisUrl: string;
    amount: number;
    expiresAt: string;
}

// Upload payment proof (Tourist)
export const uploadPaymentProof = async (
    bookingId: string,
    file: File
): Promise<PaymentProofUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file); // Backend expects "file" or "proof"

    const response = await apiClient.post<PaymentProofUploadResponse>(
        `/api/bookings/${bookingId}/payment-proof`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
};

// Verify payment (Agent) - uses PUT method
export const verifyPayment = async (
    bookingId: string
): Promise<PaymentVerifyResponse> => {
    const response = await apiClient.put<PaymentVerifyResponse>(
        `/api/bookings/${bookingId}/payment-verify`
    );
    return response.data;
};

// Reject payment (Agent) - uses PUT method
export const rejectPayment = async (
    bookingId: string,
    reason: string
): Promise<PaymentRejectResponse> => {
    const response = await apiClient.put<PaymentRejectResponse>(
        `/api/bookings/${bookingId}/payment-reject`,
        { reason }
    );
    return response.data;
};

// Get pending payments (Agent)
export const getPendingPayments = async (): Promise<PendingPayment[]> => {
    const response = await apiClient.get<PendingPayment[]>(
        "/api/bookings/payment/pending"
    );
    return response.data;
};

// Generate QRIS for payment
export const generateQRIS = async (
    data: QRISGenerateRequest
): Promise<QRISGenerateResponse> => {
    const response = await apiClient.post<QRISGenerateResponse>(
        "/api/payment/generate",
        data
    );
    return response.data;
};
