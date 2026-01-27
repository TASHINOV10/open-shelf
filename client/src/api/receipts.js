import { apiFetch } from "./client";

/**
 * Upload a receipt image to backend for OCR/parsing.
 * Expects backend to return JSON with { receipt_id, parsed_receipt, ... }.
 */
export async function uploadReceiptImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch("/upload-receipt", {
    method: "POST",
    body: formData,
  });
}

/**
 * Confirm (final) receipt payload and persist to DB.
 */
export async function confirmReceipt(payload) {
  return apiFetch("/confirm-receipt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
