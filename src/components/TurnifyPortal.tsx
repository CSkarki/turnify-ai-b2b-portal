import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  Eye, 
  Download, 
  Search,
  Filter,
  BarChart3,
  Users,
  ShoppingCart,
  AlertTriangle,
  Check,
  X,
  Mail,
  Calendar,
  MapPin,
  CreditCard
} from 'lucide-react';

// Type definitions
export type ReturnItem = {
  sku: string;
  title: string;
  qty: number;
  price?: number;
  available_return?: number;
  po_number?: string;
  return_qty?: number;
  reason?: string;
};

interface ReturnData {
  id: number;
  rma_number: string;
  po_number: string;
  status: string;
  created_at: string;
  total_value: number;
  items: {
    sku: string;
    title: string;
    qty: number;
    reason: string;
  }[];
  approval_needed: boolean;
  approver?: string | null;
  tracking_number?: string | null;
}

// Sample Data
const initialOrders = [
  {
    id: 1,
    po_number: "PO-2024-001",
    order_date: "2024-03-15",
    total: 15420.50,
    items: [
      { sku: "SH-SN-001", title: "Premium Running Shoes", qty: 50, price: 89.99, available_return: 45 },
      { sku: "SH-CS-002", title: "Casual Sneakers", qty: 30, price: 59.99, available_return: 30 },
      { sku: "SH-BT-003", title: "Leather Boots", qty: 25, price: 129.99, available_return: 20 }
    ]
  },
  {
    id: 2,
    po_number: "PO-2024-002", 
    order_date: "2024-03-20",
    total: 8950.25,
    items: [
      { sku: "SH-SN-004", title: "Athletic Trainers", qty: 40, price: 79.99, available_return: 35 },
      { sku: "SH-AC-005", title: "Shoe Care Kit", qty: 20, price: 24.99, available_return: 18 }
    ]
  },
  {
    id: 3,
    po_number: "PO-2024-003",
    order_date: "2024-03-22",
    total: 12500.75,
    items: [
      { sku: "SH-SN-006", title: "Basketball Shoes", qty: 35, price: 99.99, available_return: 30 },
      { sku: "SH-SN-007", title: "Tennis Shoes", qty: 25, price: 69.99, available_return: 20 }
    ]
  },
  {
    id: 4,
    po_number: "PO-2024-004",
    order_date: "2024-03-25",
    total: 18750.00,
    items: [
      { sku: "SH-BT-008", title: "Hiking Boots", qty: 40, price: 149.99, available_return: 35 },
      { sku: "SH-AC-009", title: "Shoe Insoles", qty: 50, price: 19.99, available_return: 45 }
    ]
  },
  {
    id: 5,
    po_number: "PO-2024-005",
    order_date: "2024-03-28",
    total: 9500.50,
    items: [
      { sku: "SH-SN-010", title: "Slip-on Shoes", qty: 30, price: 49.99, available_return: 25 },
      { sku: "SH-SN-011", title: "Loafers", qty: 25, price: 79.99, available_return: 20 }
    ]
  }
];

const initialReturns = [
  {
    id: 1,
    rma_number: "RMA-2024-001",
    po_number: "PO-2024-001",
    status: "approved",
    created_at: "2024-03-22",
    total_value: 562.50,
    items: [
      { sku: "SH-SN-001", title: "Premium Running Shoes", qty: 5, reason: "Damaged during transit" }
    ],
    approval_needed: true,
    approver: "John Smith (CSR)",
    tracking_number: "1Z999AA1234567890"
  },
  {
    id: 2,
    rma_number: "RMA-2024-002",
    po_number: "PO-2024-002",
    status: "pending",
    created_at: "2024-03-23",
    total_value: 190.00,
    items: [
      { sku: "SH-AC-005", title: "Shoe Care Kit", qty: 2, reason: "Wrong product received" }
    ],
    approval_needed: true
  },
  {
    id: 3,
    rma_number: "RMA-2024-003",
    po_number: "PO-2024-003",
    status: "approved",
    created_at: "2024-03-24",
    total_value: 699.90,
    items: [
      { sku: "SH-SN-006", title: "Basketball Shoes", qty: 7, reason: "Quality issue" }
    ],
    approval_needed: false,
    approver: "Auto-approved",
    tracking_number: "1Z999AA2345678901"
  },
  {
    id: 4,
    rma_number: "RMA-2024-004",
    po_number: "PO-2024-004",
    status: "rejected",
    created_at: "2024-03-25",
    total_value: 149.99,
    items: [
      { sku: "SH-BT-008", title: "Hiking Boots", qty: 1, reason: "Customer changed mind" }
    ],
    approval_needed: true,
    approver: "Sarah Johnson (CSR)"
  },
  {
    id: 5,
    rma_number: "RMA-2024-005",
    po_number: "PO-2024-005",
    status: "shipped",
    created_at: "2024-03-26",
    total_value: 399.95,
    items: [
      { sku: "SH-SN-010", title: "Slip-on Shoes", qty: 8, reason: "Size mismatch" }
    ],
    approval_needed: false,
    approver: "Auto-approved",
    tracking_number: "1Z999AA3456789012"
  }
];

// Generate additional sample data
const generateSampleData = () => {
  const additionalOrders = [];
  const additionalReturns = [];
  const statuses = ['approved', 'pending', 'rejected', 'shipped'];
  const reasons = [
    'Damaged during transit',
    'Wrong product received',
    'Quality issue',
    'Size mismatch',
    'Customer changed mind',
    'Defective product',
    'Wrong color received',
    'Package damaged'
  ];
  const approvers = [
    'John Smith (CSR)',
    'Sarah Johnson (CSR)',
    'Mike Brown (CSR)',
    'Auto-approved'
  ];

  // Generate 45 more orders (total 50)
  for (let i = 6; i <= 50; i++) {
    const orderDate = new Date(2024, 2, 15 + i);
    const items = [
      {
        sku: `SH-SN-${String(i).padStart(3, '0')}`,
        title: `Running Shoes Model ${i}`,
        qty: Math.floor(Math.random() * 50) + 10,
        price: Number((Math.random() * 50 + 49.99).toFixed(2)),
        available_return: Math.floor(Math.random() * 40) + 10
      },
      {
        sku: `SH-AC-${String(i).padStart(3, '0')}`,
        title: `Shoe Accessories Set ${i}`,
        qty: Math.floor(Math.random() * 30) + 5,
        price: Number((Math.random() * 30 + 19.99).toFixed(2)),
        available_return: Math.floor(Math.random() * 25) + 5
      }
    ];

    additionalOrders.push({
      id: i,
      po_number: `PO-2024-${String(i).padStart(3, '0')}`,
      order_date: orderDate.toISOString().split('T')[0],
      total: Number(items.reduce((sum, item) => sum + (item.qty * item.price), 0).toFixed(2)),
      items
    });
  }

  // Generate 45 more returns (total 50)
  for (let i = 6; i <= 50; i++) {
    const returnDate = new Date(2024, 2, 22 + i);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const items = [
      {
        sku: `SH-SN-${String(i).padStart(3, '0')}`,
        title: `Running Shoes Model ${i}`,
        qty: Math.floor(Math.random() * 10) + 1,
        reason: reasons[Math.floor(Math.random() * reasons.length)]
      }
    ];

    additionalReturns.push({
      id: i,
      rma_number: `RMA-2024-${String(i).padStart(3, '0')}`,
      po_number: `PO-2024-${String(i).padStart(3, '0')}`,
      status,
      created_at: returnDate.toISOString().split('T')[0],
      total_value: Number((items[0].qty * (Math.random() * 50 + 49.99)).toFixed(2)),
      items,
      approval_needed: status === 'pending',
      approver: status === 'pending' ? null : approvers[Math.floor(Math.random() * approvers.length)],
      tracking_number: status === 'shipped' ? `1Z999AA${Math.floor(Math.random() * 1000000)}` : null
    });
  }

  return {
    orders: [...initialOrders, ...additionalOrders],
    returns: [...initialReturns, ...additionalReturns]
  };
};

const { orders: sampleOrders, returns: sampleReturns } = generateSampleData();

const sampleAnalytics = {
  totalReturns: sampleReturns.length,
  pendingApprovals: sampleReturns.filter(r => r.status === 'pending').length,
  approvedReturns: sampleReturns.filter(r => r.status === 'approved').length,
  rejectedReturns: sampleReturns.filter(r => r.status === 'rejected').length,
  totalValue: sampleReturns.reduce((sum, r) => sum + r.total_value, 0),
  avgProcessingTime: "2.3 days"
};

const TurnifyPortal = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [userRole, setUserRole] = useState<string>('retail_partner'); // retail_partner, admin_csr, admin_admin
  const [selectedItems, setSelectedItems] = useState<ReturnItem[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<ReturnData>({
    id: 0,
    rma_number: '',
    po_number: '',
    status: '',
    created_at: '',
    total_value: 0,
    items: [],
    approval_needed: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Navigation function
  const navigate = (view: string, data?: ReturnData) => {
    setCurrentView(view);
    if (data) setSelectedReturn(data);
  };

  // Header Component
  const Header = () => (
    <header className="bg-blue-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Package className="h-8 w-8 text-orange-400" />
          <h1 className="text-2xl font-bold">Turnify: B2B Return Portal</h1>
          <p className="text-base text-gray-300 italic mt-1">Turnify – turning inventory efficiently.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, Store Manager</span>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            className="bg-blue-800 border border-blue-700 rounded px-3 py-1 text-sm"
          >
            <option value="retail_partner">Retail Partner</option>
            <option value="admin_csr">Turnify CSR</option>
            <option value="admin_admin">Turnify Admin</option>
          </select>
        </div>
      </div>
    </header>
  );

  // Landing Page
  const LandingPage = () => (
    <div className="max-w-7xl mx-auto p-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900">{sampleAnalytics.totalReturns}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-orange-600">{sampleAnalytics.pendingApprovals}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Return Value</p>
              <p className="text-2xl font-bold text-green-600">${sampleAnalytics.totalValue.toLocaleString()}</p>
            </div>
            <CreditCard className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing</p>
              <p className="text-2xl font-bold text-purple-600">{sampleAnalytics.avgProcessingTime}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => navigate('item-selection')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-lg transition-colors"
        >
          <Package className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Create New Return</h3>
          <p className="text-blue-100">Start a new return request for your products</p>
        </button>
        
        <button 
          onClick={() => navigate('returns-list')}
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-lg transition-colors"
        >
          <Eye className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">View Returns</h3>
          <p className="text-green-100">Track status of your existing returns</p>
        </button>
        
        {(userRole === 'admin_csr' || userRole === 'admin_admin') && (
          <button 
            onClick={() => navigate('admin-dashboard')}
            className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-lg shadow-lg transition-colors"
          >
            <Users className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
            <p className="text-orange-100">Manage approvals and analytics</p>
          </button>
        )}
      </div>

      {/* Recent Returns */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Returns</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {sampleReturns.slice(0, 3).map(returnItem => (
              <div key={returnItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    returnItem.status === 'approved' ? 'bg-green-100' :
                    returnItem.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {returnItem.status === 'approved' ? 
                      <CheckCircle className="h-5 w-5 text-green-600" /> :
                      returnItem.status === 'pending' ?
                      <Clock className="h-5 w-5 text-yellow-600" /> :
                      <XCircle className="h-5 w-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">{returnItem.rma_number}</p>
                    <p className="text-sm text-gray-600">{returnItem.po_number} • ${returnItem.total_value}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  returnItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                  returnItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Item Selection Page
  const ItemSelectionPage = () => (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('landing')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Select Items for Return</h1>
        <p className="text-gray-600 mt-2">Choose items from your recent orders to return</p>
      </div>

      {sampleOrders.map(order => (
        <div key={order.id} className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{order.po_number}</h3>
                <p className="text-gray-600">Order Date: {order.order_date} • Total: ${order.total}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.sku} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems((prev: ReturnItem[]) => [...prev, {
                            ...item,
                            po_number: order.po_number,
                            return_qty: 1,
                            reason: ''
                          }]);
                        } else {
                          setSelectedItems((prev: ReturnItem[]) => prev.filter(selected => selected.sku !== item.sku));
                        }
                      }}
                    />
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600">SKU: {item.sku} • Available for return: {item.available_return}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price ?? 0}</p>
                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={() => navigate('return-details')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
          >
            Continue with {selectedItems.length} items
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );

  // Return Details Page
  const ReturnDetailsPage = () => {
    const [returnReasons, setReturnReasons] = useState({});
    const [returnQuantities, setReturnQuantities] = useState({});

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate('item-selection')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Item Selection
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Return Details</h1>
          <p className="text-gray-600 mt-2">Provide details for your return request</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Selected Items</h2>
          </div>
          <div className="p-6 space-y-6">
            {selectedItems.map(item => (
              <div key={item.sku} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">SKU: {item.sku} • From: {item.po_number}</p>
                  </div>
                  <p className="font-medium">${item.price ?? 0}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Quantity (Max: {item.available_return})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={item.available_return}
                      defaultValue="1"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      onChange={(e) => setReturnQuantities({...returnQuantities, [item.sku]: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Return
                    </label>
                    <select 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      onChange={(e) => setReturnReasons({...returnReasons, [item.sku]: e.target.value})}
                    >
                      <option value="">Select reason</option>
                      <option value="damaged">Damaged during transit</option>
                      <option value="wrong_product">Wrong product received</option>
                      <option value="quality_issue">Quality issue</option>
                      <option value="expired">Product expired</option>
                      <option value="overstock">Overstock</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Items: {selectedItems.length}</p>
                <p className="text-sm text-gray-600">Estimated Value: ${selectedItems.reduce((sum, item) => sum + (item.price ?? 0), 0).toFixed(2)}</p>
              </div>
              <button 
                onClick={() => navigate('approval-check')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Approval Check Page
  const ApprovalCheckPage = () => {
    const needsApproval = Math.random() > 0.5; // Simulate AI decision
    
    useEffect(() => {
      // Simulate processing delay
      const timer = setTimeout(() => {
        if (needsApproval) {
          navigate('approval-pending');
        } else {
          navigate('confirmation');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }, [needsApproval]);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Your Return Request</h2>
          <p className="text-gray-600 mb-4">Our AI system is analyzing your return request...</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              ✓ Validating return eligibility<br/>
              ✓ Checking return policies<br/>
              ✓ Calculating risk score<br/>
              {needsApproval ? '• Approval required - forwarding to CSR' : '• Auto-approval granted'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Approval Pending Page
  const ApprovalPendingPage = () => {
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

  // Confirmation Page
  const ConfirmationPage = () => {
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

  // Returns List Page
  const ReturnsListPage = () => {
    const filteredReturns = sampleReturns.filter(returnItem => {
      const matchesSearch = returnItem.rma_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           returnItem.po_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || returnItem.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate('landing')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Return Requests</h1>
          <p className="text-gray-600 mt-2">Manage and track your return requests</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by RMA or PO number..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Returns List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Your Returns ({filteredReturns.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredReturns.map(returnItem => (
              <div key={returnItem.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      returnItem.status === 'approved' ? 'bg-green-100' :
                      returnItem.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {returnItem.status === 'approved' ? 
                        <CheckCircle className="h-5 w-5 text-green-600" /> :
                        returnItem.status === 'pending' ?
                        <Clock className="h-5 w-5 text-yellow-600" /> :
                        <XCircle className="h-5 w-5 text-red-600" />
                      }
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{returnItem.rma_number}</h3>
                      <p className="text-gray-600">{returnItem.po_number} • Created: {returnItem.created_at}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${returnItem.total_value}</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      returnItem.status === 'approved' ? 'bg-green-100 text-green-800' :
                      returnItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {returnItem.status.charAt(0).toUpperCase() + returnItem.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-medium">{returnItem.items.length} items</p>
                  </div>
                  {returnItem.tracking_number && (
                    <div>
                      <p className="text-sm text-gray-600">Tracking</p>
                      <p className="font-medium">{returnItem.tracking_number}</p>
                    </div>
                  )}
                  {returnItem.approver && (
                    <div>
                      <p className="text-sm text-gray-600">Approved by</p>
                      <p className="font-medium">{returnItem.approver}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {returnItem.items.map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                        {item.sku}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => navigate('return-details-view', returnItem)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Admin Dashboard
  const AdminDashboard = () => (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('landing')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage return approvals and view analytics</p>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            Pending Approvals ({sampleReturns.filter(r => r.status === 'pending').length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sampleReturns.filter(r => r.status === 'pending').map(returnItem => (
            <div key={returnItem.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{returnItem.rma_number}</h3>
                  <p className="text-gray-600">{returnItem.po_number} • ${returnItem.total_value}</p>
                  <p className="text-sm text-gray-500">Created: {returnItem.created_at}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">AI Recommendation</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    Recommend: APPROVE
                  </span>
                  <span className="text-sm text-gray-600">Risk Score: Low (15/100)</span>
                </div>
                <p className="text-sm text-gray-700">
                  ✓ Retail partner has good return history<br/>
                  ✓ Return reason is valid<br/>
                  ✓ Items within return window
                </p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Return Items</h4>
                <div className="space-y-2">
                  {returnItem.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.title} (SKU: {item.sku})</span>
                      <span>Qty: {item.qty} • Reason: {item.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Return Trends</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">This Month</span>
              <span className="font-medium">+12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Processing</span>
              <span className="font-medium">2.3 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approval Rate</span>
              <span className="font-medium">87%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Return Reasons</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Damaged</span>
              <span className="font-medium">35%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wrong Product</span>
              <span className="font-medium">28%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quality Issue</span>
              <span className="font-medium">22%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Partners</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tapri Store #001</span>
              <span className="font-medium">45 returns</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thela Express</span>
              <span className="font-medium">38 returns</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CP Store Mumbai</span>
              <span className="font-medium">29 returns</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Alerts</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm">3 high-value returns</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm">1 fraud alert</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">All systems normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Return Details View
  const ReturnDetailsView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={() => navigate('returns-list')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Returns List
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Return Details</h1>
        <p className="text-gray-600 mt-2">{selectedReturn.rma_number || 'RMA-2024-001'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Return Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Return Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">RMA Number</p>
                <p className="font-medium">{selectedReturn.rma_number || 'RMA-2024-001'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PO Number</p>
                <p className="font-medium">{selectedReturn.po_number || 'PO-2024-001'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  (selectedReturn.status || 'approved') === 'approved' ? 'bg-green-100 text-green-800' :
                  (selectedReturn.status || 'approved') === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {((selectedReturn.status || 'approved').charAt(0).toUpperCase() + (selectedReturn.status || 'approved').slice(1))}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="font-medium">${selectedReturn.total_value || '562.50'}</p>
              </div>
            </div>
          </div>

          {/* Return Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Return Items</h2>
            <div className="space-y-4">
              {(selectedReturn.items || sampleReturns[0].items).map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-600">Reason: {item.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Qty: {item.qty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Status Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Return Created</p>
                  <p className="text-sm text-gray-600">{selectedReturn.created_at || '2024-03-22'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Approved</p>
                  <p className="text-sm text-gray-600">2024-03-22</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Shipping Label Generated</p>
                  <p className="text-sm text-gray-600">2024-03-22</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {selectedReturn.tracking_number && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-medium">{selectedReturn.tracking_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carrier</p>
                  <p className="font-medium">UPS Ground</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Delivery</p>
                  <p className="font-medium">2024-03-25</p>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Download Label
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Main Render
  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'item-selection':
        return <ItemSelectionPage />;
      case 'return-details':
        return <ReturnDetailsPage />;
      case 'approval-check':
        return <ApprovalCheckPage />;
      case 'approval-pending':
        return <ApprovalPendingPage />;
      case 'confirmation':
        return <ConfirmationPage />;
      case 'returns-list':
        return <ReturnsListPage />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'return-details-view':
        return <ReturnDetailsView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {renderCurrentView()}
    </div>
  );
};

export default TurnifyPortal;