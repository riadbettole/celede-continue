import { QueryInterface } from "./components/query-interface";
import { UploadForm } from "./components/upload-form";
import { FileManager } from "./components/file-manager";
import { LogoutButton } from "./components/logout-button";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-start">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              AWS Bedrock Knowledge Base
            </h1>
            <p className="text-gray-600">
              Upload documents and query them with AI
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <UploadForm />
          <QueryInterface />
        </div>

        <div className="mt-12">
          <FileManager />
        </div>
      </div>
    </div>
  );
}