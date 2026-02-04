import { QueryInterface } from "./components/query-interface";
import { UploadForm } from "./components/upload-form";
import { FileManager } from "./components/file-manager";
import { LogoutButton } from "./components/logout-button";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Tight Content Grid */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Upload - Compact */}
          <div className="lg:col-span-2">
            <UploadForm />
          </div>

          {/* Right: Query - More space */}
          <div className="lg:col-span-3">
            <QueryInterface />
          </div>
        </div>

        {/* Full width files below */}
        <div className="mt-6">
          <FileManager />
        </div>
      </div>
    </div>
  );
}