import { apiClient } from "@/lib/axios";
import { API_ROUTES } from "@/lib/constants";
import { handleResponse } from "./helper";
import { AxiosProgressEvent } from "axios";

export const documentService = {
  uploadDocument(
    spaceId: number,
    file: File,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
    description?: string
  ) {
    const formData = new FormData();
    formData.append("space_id", spaceId.toString());
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }
    const mimeType = file.type;

    return apiClient.post(API_ROUTES.DOCUMENT.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        "Mime-Type": mimeType,
      },
      onUploadProgress: onUploadProgress,
      timeout: 0,
    });
  },
  getCountMyDocuments: async (): Promise<number> => {
    const response = await apiClient.head(
      API_ROUTES.DOCUMENT.COUNT_MY_DOCUMENTS
    );
    const count = response.headers["x-document-count"];
    return Number(count);
  },
  getDocumentById: async (documentId: number) => {
    const response = await apiClient.get(
      API_ROUTES.DOCUMENT.DETAIL(documentId.toString())
    );
    return handleResponse(response.data);
  },
  deleteDocument: async (documentId: string) => {
    const response = await apiClient.delete(
      API_ROUTES.DOCUMENT.DELETE(documentId)
    );
    return handleResponse(response.data);
  },
};
