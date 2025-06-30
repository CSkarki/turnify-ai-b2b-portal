import React from 'react';
import { CheckCircle, Download } from 'lucide-react';
import type { ReturnItem } from './TurnifyReturnDetails';

interface TurnifyConfirmationProps {
  navigate: (view: string) => void;
  selectedItems: ReturnItem[];
}

export const TurnifyConfirmation: React.FC<TurnifyConfirmationProps> = ({ navigate, selectedItems }) => {
  const rmaNumber = `RMA-2024-${String(Math.floor(1000)).padStart(3, '0')}`;
  const trackingNumber = `1Z999AA${String(Math.floor(1000000)).padStart(6, '0')}`;
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Request Approved!</h2>
          <p className="text-gray-600">Your return has been automatically approved and processed.</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-green-800 mb-4">Return Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">RMA Number:</span>
              <span className="font-medium text-green-900">{rmaNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Tracking Number:</span>
              <span className="font-medium text-green-900">{trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Return Items:</span>
              <span className="font-medium text-green-900">{selectedItems.length} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Estimated Value:</span>
              <span className="font-medium text-green-900">${selectedItems.reduce((sum, item) => sum + (item.price ?? 0), 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-4">Shipping Instructions</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Download and print the shipping label below</li>
            <li>• Pack items securely in original packaging if possible</li>
            <li>• Attach the shipping label to the outside of the package</li>
            <li>• Drop off at any authorized shipping location</li>
          </ul>
        </div>
        <div className="space-y-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center">
            <Download className="h-4 w-4 mr-2" />
            Download Shipping Label (PDF)
          </button>
          <button 
            onClick={() => navigate('landing')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}; 