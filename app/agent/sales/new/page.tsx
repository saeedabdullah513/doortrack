import { auth } from "@/lib/auth";
import { SalesForm } from "@/components/agent/sales-form";
import { ShoppingCart } from "lucide-react";

export default async function NewSalePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-200 flex-shrink-0">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">New Sale</h1>
            <p className="text-sm text-gray-400 font-medium">Enter customer details below</p>
          </div>
        </div>
        <SalesForm agentName={session!.user.name} />
      </div>
    </div>
  );
}
