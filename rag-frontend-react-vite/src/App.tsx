import { useEffect, useState} from "react";
import {
  Search,
  FileText,
  Upload,
  Sparkles,
  ChevronRight,
  Check,
  AlertCircle,
  FileX2,
} from "lucide-react";
import { api } from "./APIs";
import type { DocumentFile, QAResponse } from "./types";
import { useNavigate } from "react-router-dom";
import LLMResponseFormatter from "./views/LLMformatter";

export function ChatAPP() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [response, setResponse] = useState<QAResponse | null>(null);
  const [loading, setLoading] = useState(false);
  // const [activeTab, setActiveTab] = useState<"query" | "documents">("query");

  const [mockDocuments, setDocuments] = useState<DocumentFile[]>([]);

  const fetchDocuments = async () => {
    try {
      const res = await api.get<DocumentFile[]>("/documents/get-ingested-docs");
      setDocuments(res.data);
    } catch (err) {
      alert("Unable to get the documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async () => {
    if (!question.trim() || selectedDocs.length === 0) return;
    setLoading(true);

    try {
      const res = await api.post<QAResponse>("http://localhost:8001/qa/query", {
        question,
        documentIds: selectedDocs,
      });
      setResponse(res.data);
    } catch (err) {
      console.error("Failed to fetch answer:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDoc = (documentId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(documentId)
        ? prev.filter((d) => d !== documentId)
        : [...prev, documentId]
    );
  };

  const selectAllDocs = () => {
    setSelectedDocs(mockDocuments.map((doc) => doc.documentId));
  };

  const clearSelection = () => {
    setSelectedDocs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Document Management */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {mockDocuments.length ? (
                <>
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Documents
                      </h2>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Upload
                          className="w-4 h-4"
                          onClick={() => navigate("/app/upload")}
                        />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={selectAllDocs}
                        className="flex-1 text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearSelection}
                        className="flex-1 text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                    {mockDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => toggleDoc(doc.documentId)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedDocs.includes(doc.id)
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className={`p-1.5 rounded-lg ${
                                  doc.type === "pdf"
                                    ? "bg-red-100"
                                    : "bg-blue-100"
                                }`}
                              >
                                <FileText
                                  className={`w-3 h-3 ${
                                    doc.type === "pdf"
                                      ? "text-red-600"
                                      : "text-blue-600"
                                  }`}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {doc.name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>
                                {doc.size} • {doc.pages} pages
                              </div>
                            </div>
                          </div>
                          <div
                            className={`ml-3 p-1 rounded-full ${
                              selectedDocs.includes(doc.documentId)
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <Check
                              className={`w-3 h-3 ${
                                selectedDocs.includes(doc.documentId)
                                  ? "text-white"
                                  : "text-transparent"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedDocs.length > 0 && (
                    <div className="p-4 bg-blue-50 border-t border-blue-100">
                      <div className="text-sm text-blue-800 font-medium">
                        {selectedDocs.length} document
                        {selectedDocs.length > 1 ? "s" : ""} selected
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-6 max-h-96 overflow-y-auto bg-white rounded-lg shadow-md">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <FileX2 size={48} className="text-gray-400 animate-pulse" />
                    <p className="text-lg font-semibold text-gray-700">
                      No Documents Found
                    </p>
                    <p className="text-sm text-gray-500 max-w-sm">
                      It looks like there are no documents available at the
                      moment. Please contact the administrator for assistance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Query Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Ask Your Question
                </h2>
                <p className="text-sm text-gray-600">
                  Query your documents using natural language and get AI-powered
                  insights
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Question Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    What would you like to know?
                  </label>
                  <div className="relative">
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      rows={4}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask anything about your documents... For example: 'What is the company policy on remote work?' or 'When is the next product release scheduled?'"
                    />
                    <div className="absolute bottom-3 right-3">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={
                      loading || !question.trim() || selectedDocs.length === 0
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Get Answer
                      </>
                    )}
                  </button>

                  {(!question.trim() || selectedDocs.length === 0) && (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      {!question.trim()
                        ? "Enter a question"
                        : "Select documents to search"}
                    </div>
                  )}
                </div>

                {/* Response */}
                {response && (
                  <div className="space-y-6 border-t border-gray-100 pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-green-600" />
                        Answer
                      </h3>
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                        <p className="text-gray-800 leading-relaxed">
                          <LLMResponseFormatter response={response.answer} />
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Supporting Evidence
                      </h3>
                      <div className="space-y-3">
                        {response.matched_chunks.map((chunk, i) => (
                          <div
                            key={i}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                                {i + 1}
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {chunk}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
