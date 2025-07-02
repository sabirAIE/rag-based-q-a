import React, { useEffect, useRef, useState } from "react";
import { Upload, Trash2, FileText, TreePalm } from "lucide-react";
import { api } from "../APIs";
import type { DocumentFile } from "../types";

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const res = await api.get<DocumentFile[]>("/documents/getall");
      setDocuments(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch documents. Please try again.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/documents/upload", formData);
      await fetchDocuments();
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear input
      }
    } catch (err) {
      setError("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      await api.delete(`/documents/${documentId}`);
      await fetchDocuments();
      setError(null);
    } catch (err) {
      setError("Failed to delete document. Please try again.");
    }
  };

  const handleDataIngestion = async (documentId: string) => {
    try {
      const res = await api.post(`/ingestion/${documentId}`);
      if (res.data) {
        await fetchDocuments();
      } else {
        setError("Failed to start data ingestion. Please try again.");
      }
    } catch (err) {
      setError("Failed to start data ingestion. Please try again.");
    } finally {
      await fetchDocuments();
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText size={24} />
        Document Management
      </h2>

      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Upload New Document
        </h3>
        <div className="flex items-center gap-4">
          <label className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
              <Upload size={20} className="text-gray-600" />
              <span className="text-gray-600">
                {uploading ? "Uploading..." : "Choose PDF File"}
              </span>
            </div>
          </label>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {/* Documents List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Uploaded Documents
        </h3>
        {documents.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li
                key={doc.documentId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-gray-600" />
                  <span className="text-gray-800">{doc.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(doc.documentId)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    title="Delete Document"
                    disabled={uploading}
                  >
                    Delete
                  </button>
                  {doc.status === "pending" ? (
                    <button
                      onClick={() => handleDataIngestion(doc.documentId)}
                      className="text-green-600 hover:text-red-800 transition-colors duration-200"
                      title="Start Ingestion"
                      disabled={uploading}
                    >
                      Start Ingestion
                    </button>
                  ) : (
                    <span className="text-green-600">Document Ingested</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
