import React from 'react';
import { Clock } from 'lucide-react';

interface TurnifyApprovalPendingProps {
  navigate: (view: string) => void;
}

export const TurnifyApprovalPending: React.FC<TurnifyApprovalPendingProps> = ({ navigate }) => {
  const rmaNumber = `RMA-2024-${String(Math.floor(1000)).padStart(3, '0')}`;
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="bg-yellow-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Clock className="h-10 w-10 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Approval Required</h2>
        <p className="text-gray-600 mb-6">Your return request has been submitted and is pending approval from our customer service team.</p>
        <div className="bg-yellow-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">What happens next?</h3>
          <ul className="text-sm text-yellow-700 space-y-2 text-left">
            <li>• Our CSR team has been notified via email</li>
            <li>• They will review your request within 24 hours</li>
            <li>• You'll receive an email notification once approved</li>
            <li>• Shipping labels will be generated automatically</li>
          </ul>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            RMA Number: <span className="font-medium">{rmaNumber}</span>
          </p>
          <button 
            onClick={() => navigate('landing')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}; 