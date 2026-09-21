import { FiImage } from "react-icons/fi";

export default function AdminAssetsPage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
      <FiImage className="text-4xl text-brand-500 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-gray-900">Assets</h2>
      <p className="text-gray-500 mt-1">
        Image/video upload UI is coming soon — the upload API is already live at{" "}
        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">/api/assets/upload-url</code>.
      </p>
    </div>
  );
}
