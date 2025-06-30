import React, { useState, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';

export interface ReturnItem {
  sku: string;
  title: string;
  qty: number;
  price?: number;
  available_return?: number;
  po_number?: string;
  return_qty?: number;
  reason?: string;
  isOpenRA?: boolean;
}

interface TurnifyReturnDetailsProps {
  navigate: (view: string) => void;
  selectedItems: ReturnItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ReturnItem[]>>;
}

export const TurnifyReturnDetails: React.FC<TurnifyReturnDetailsProps> = ({ navigate, selectedItems, setSelectedItems }) => {
  const [returnReasons, setReturnReasons] = useState<Record<string, string>>({});
  const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>({});
  const [returnComments, setReturnComments] = useState<Record<string, string>>({});
  const [shippingPreference, setShippingPreference] = useState('own');

  // Helper to get a stable, unique key for each item
  const getItemKey = (item: ReturnItem, index: number) =>
    `${item.sku}_${item.po_number || (item.isOpenRA ? 'OPEN-RA' : '')}_${index}`;

  const handleBack = useCallback(() => {
    navigate(selectedItems[0]?.isOpenRA ? 'open-ra' : 'item-selection');
  }, [navigate, selectedItems]);

  const handleSubmit = useCallback(() => {
    navigate('approval-check');
  }, [navigate]);

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
        <p className="text-gray-600 mt-2">Provide details for your return request</p>
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
            This is an Open RA return that will be manually reviewed by our team. Additional verification may be required.
          </p>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Return Items</h2>
        <div className="space-y-4">
          {selectedItems.map((item: ReturnItem, index: number) => {
            const itemKey = getItemKey(item, index);
            return (
              <div key={itemKey} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
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
                    <input
                      type="number"
                      min="1"
                      max={item.available_return}
                      value={returnQuantities[itemKey] ?? item.return_qty ?? 1}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setReturnQuantities(prev => ({
                          ...prev,
                          [itemKey]: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Reason</label>
                    <select
                      value={returnReasons[itemKey] ?? item.reason ?? ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setReturnReasons(prev => ({
                          ...prev,
                          [itemKey]: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a reason</option>
                      <option value="Quality Issue">Quality Issue</option>
                      <option value="Wrong Size">Wrong Size</option>
                      <option value="Damaged in Transit">Damaged in Transit</option>
                      <option value="Customer Changed Mind">Customer Changed Mind</option>
                      <option value="Defective Product">Defective Product</option>
                      <option value="Wrong Color">Wrong Color</option>
                      <option value="Not as Described">Not as Described</option>
                      <option value="Late Delivery">Late Delivery</option>
                      <option value="Duplicate Order">Duplicate Order</option>
                      <option value="Other">Other</option>
                    </select>
                    {returnReasons[itemKey] && (
                      <textarea
                        className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Add additional comments (optional)"
                        value={returnComments[itemKey] ?? ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setReturnComments(prev => ({
                            ...prev,
                            [itemKey]: e.target.value,
                          }))
                        }
                        rows={2}
                      />
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
          Submit Return Request
        </button>
      </div>
    </div>
  );
}; 