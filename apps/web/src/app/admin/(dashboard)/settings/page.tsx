import { FiSettings } from "react-icons/fi";

export default function AdminSettingsPage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
      <FiSettings className="text-4xl text-brand-500 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>
      <p className="text-gray-500 mt-1">Account and site settings are coming soon.</p>
    </div>
  );
}
