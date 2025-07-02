import React, { useState, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { ReturnItem } from '../types';

interface TurnifyReturnDetailsProps {
  navigate: (view: string) => void;
  selectedItems: ReturnItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ReturnItem[]>>;
  returnQuantities?: Record<string, number>;
  returnReasons?: Record<string, string>;
  returnComments?: Record<string, string>;
  setReturnQuantities?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setReturnReasons?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setReturnComments?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const TurnifyReturnDetails: React.FC<TurnifyReturnDetailsProps> = ({ 
  navigate, 
  selectedItems, 
  setSelectedItems,
  returnQuantities: initialQuantities = {},
  returnReasons: initialReasons = {},
  returnComments: initialComments = {},
  setReturnQuantities,
  setReturnReasons,
  setReturnComments
}) => {
  const [returnReasons, setReturnReasonsLocal] = useState<Record<string, string>>(initialReasons);
  const [returnQuantities, setReturnQuantitiesLocal] = useState<Record<string, number>>(initialQuantities);
  const [returnComments, setReturnCommentsLocal] = useState<Record<string, string>>(initialComments);
  const [shippingPreference, setShippingPreference] = useState('own');

  // Use the passed setters if available, otherwise use local state
  const finalSetReturnQuantities = setReturnQuantities || setReturnQuantitiesLocal;
  const finalSetReturnReasons = setReturnReasons || setReturnReasonsLocal;
  const finalSetReturnComments = setReturnComments || setReturnCommentsLocal;
  const finalReturnQuantities = setReturnQuantities ? initialQuantities : returnQuantities;
  const finalReturnReasons = setReturnReasons ? initialReasons : returnReasons;
  const finalReturnComments = setReturnComments ? initialComments : returnComments;

  // Helper to get a stable, unique key for each item
  const getItemKey = (item: ReturnItem, index: number) =>
    `${item.upc}_${item.po_number || (item.isOpenRA ? 'OPEN-RA' : '')}_${index}`;

  const handleBack = useCallback(() => {
    navigate(selectedItems[0]?.isOpenRA ? 'open-ra' : 'item-selection');
  }, [navigate, selectedItems]);

  const handleSubmit = useCallback(() => {
    // Check if any item with "Other" reason has empty comments
    const hasOtherReasonWithoutComment = selectedItems.some((item, index) => {
      const itemKey = getItemKey(item, index);
      const reason = returnReasons[itemKey] ?? item.reason ?? '';
      const comment = returnComments[itemKey] ?? '';
      return reason === 'Other' && !comment.trim();
    });

    if (hasOtherReasonWithoutComment) {
      alert('Comments are required when return reason is "Other". Please provide details for all items with "Other" reason.');
      return;
    }

    navigate('approval-check');
  }, [navigate, selectedItems, returnReasons, returnComments]);

  // Memoized back button text
  const backButtonText = useMemo(() => 
    selectedItems[0]?.isOpenRA ? 'Open RA' : 'Item Selection',
    [selectedItems]
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {backButtonText}
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Return Details</h1>
        <p className="text-gray-600 mt-2">Review your return request details before submission</p>
      </div>
      {/* Custom Approval Logic Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
          <span className="mr-2">⚙️</span>
          Custom Approval Logic
        </h3>
        <p className="text-sm text-blue-700">
          Turnify's configurable workflow will evaluate your return based on quantity, value, customer profile, and custom criteria.
        </p>
      </div>
      {/* Open RA Notice */}
      {selectedItems[0]?.isOpenRA && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <span className="mr-2">📋</span>
            Open RA Return
          </h3>
          <p className="text-sm text-yellow-700">
            This is an Open RA return that will be manually reviewed by our team. Additional verification will be required.
          </p>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Return Items Review</h2>
        <div className="space-y-4">
          {selectedItems.map((item: ReturnItem, index: number) => {
            const itemKey = getItemKey(item, index);
            return (
              <div key={itemKey} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">UPC: {item.upc}</p>
                    <p className="text-sm text-gray-600">Reason: {item.reason}</p>
                    {'comment' in item && (item as any).comment && (
                      <p className="text-sm text-gray-500 italic">Comment: {(item as any).comment}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.qty}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Quantity</label>
                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-900">
                      {finalReturnQuantities[itemKey] ?? item.return_qty ?? 1}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Reason</label>
                    <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-900">
                      {finalReturnReasons[itemKey] ?? item.reason ?? 'Not specified'}
                    </div>
                    {finalReturnComments[itemKey] && (
                      <div className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-900 text-sm">
                        <span className="font-medium">Comments:</span> {finalReturnComments[itemKey]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button 
          onClick={handleBack}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button 
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Review & Submit Return Request
        </button>
      </div>
    </div>
  );
}; 