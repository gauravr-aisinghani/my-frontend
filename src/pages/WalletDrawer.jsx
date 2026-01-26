import { X, IndianRupee } from "lucide-react";

export default function WalletDrawer({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="bg-white w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Wallet</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <p className="text-sm text-gray-600">Available Balance</p>
          <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
            <IndianRupee /> 45,000
          </h1>
        </div>

        <button className="w-full mb-3 bg-green-600 text-white py-2 rounded-lg">
          Add Money
        </button>
        <button className="w-full border border-green-600 text-green-600 py-2 rounded-lg">
          View Transactions
        </button>
      </div>
    </div>
  );
}
