import { APP_CONFIG } from "@/lib/config";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">System configuration</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        <div className="px-5 py-4">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">Attendance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Daily Target Hours</p>
              <p className="text-xs text-gray-400 mt-0.5">Minimum hours for a completed day</p>
            </div>
            <span className="text-sm font-bold text-gray-900">{APP_CONFIG.attendance.targetHours}h</span>
          </div>
        </div>

        <div className="px-5 py-4">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">Feature Flags</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Photo Capture on Punch-In</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Set <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_PHOTO_CAPTURE_ENABLED=true</code> in .env to enable
              </p>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                APP_CONFIG.features.photoCapture
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {APP_CONFIG.features.photoCapture ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs text-gray-400">
            To change feature flags or system settings, update the <code className="bg-gray-100 px-1 rounded">.env</code> file
            and restart the server.
          </p>
        </div>
      </div>
    </div>
  );
}
