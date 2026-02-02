import { QueryInterface } from "./components/query-interface";
import { UploadForm } from "./components/upload-form";


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AWS Bedrock Knowledge Base
          </h1>
          <p className="text-gray-600">
            Upload PDFs and query them with AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <UploadForm />
          <QueryInterface />
        </div>
      </div>
    </div>
  );
}