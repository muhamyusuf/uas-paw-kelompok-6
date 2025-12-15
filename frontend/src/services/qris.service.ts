import apiClient from "./api";

// QRIS entity
export interface QRIS {
    id: string;
    staticQrisString: string;
    fotoQrPath: string;
    feeType: "rupiah" | "persentase" | null;
    feeValue: number | null;
    createdAt: string;
}

// Preview QRIS response
export interface QRISPreviewResponse {
    qrisUrl: string;
    qrisString: string;
    amount: number;
    feeType: string | null;
    feeValue: number | null;
    totalAmount: number;
}

// Create QRIS response
export interface QRISCreateResponse {
    id: string;
    staticQrisString: string;
    fotoQrPath: string;
    feeType: string | null;
    feeValue: number | null;
    createdAt: string;
    message: string;
}

// Generate Payment response
export interface PaymentGenerateResponse {
    qrisId: string;
    staticQrisString: string;
    dynamicQrisString: string;
    amount: number;
    feeType: string | null;
    feeValue: number | null;
    totalAmount: number;
    fotoQrUrl: string;
    message: string;
}

// Get all QRIS records (Agent only)
export const getAllQRIS = async (): Promise<QRIS[]> => {
    const response = await apiClient.get<QRIS[]>("/api/qris");
    return response.data;
};

// Get QRIS by ID (Agent only)
export const getQRISById = async (id: string): Promise<QRIS> => {
    const response = await apiClient.get<QRIS>(`/api/qris/${id}`);
    return response.data;
};

// Create/Upload new QRIS (Agent only)
export const createQRIS = async (
    file: File,
    feeType?: "rupiah" | "persentase",
    feeValue?: number
): Promise<QRISCreateResponse> => {
    const formData = new FormData();
    formData.append("foto_qr", file);
    
    if (feeType) {
        formData.append("fee_type", feeType);
    }
    if (feeValue !== undefined) {
        formData.append("fee_value", feeValue.toString());
    }

    const response = await apiClient.post<QRISCreateResponse>("/api/qris", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

// Delete QRIS by ID (Agent only)
export const deleteQRIS = async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/qris/${id}`);
    return response.data;
};

// Preview QRIS with amount (no auth required)
export const previewQRIS = async (
    qrisId: string,
    amount: number
): Promise<QRISPreviewResponse> => {
    const response = await apiClient.post<QRISPreviewResponse>("/api/qris/preview", {
        qrisId,
        amount
    });
    return response.data;
};

// Generate payment QRIS with amount (Tourist/Agent)
export const generatePaymentQRIS = async (
    amount: number
): Promise<PaymentGenerateResponse> => {
    const response = await apiClient.post<PaymentGenerateResponse>("/api/payment/generate", {
        amount
    });
    return response.data;
};
