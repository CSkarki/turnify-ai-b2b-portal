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
  isOpenRA?: boolean;
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
    comment?: string;
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

  // Generate 45 more orders (total 50) - using deterministic values
  for (let i = 6; i <= 50; i++) {
    const orderDate = new Date(2024, 2, 15 + i);
    const items = [
      {
        sku: `SH-SN-${String(i).padStart(3, '0')}`,
        title: `Running Shoes Model ${i}`,
        qty: 20 + (i % 30), // Deterministic quantity
        price: Number((50 + (i % 50) + 49.99).toFixed(2)), // Deterministic price
        available_return: 15 + (i % 25) // Deterministic available return
      },
      {
        sku: `SH-AC-${String(i).padStart(3, '0')}`,
        title: `Shoe Accessories Set ${i}`,
        qty: 10 + (i % 20), // Deterministic quantity
        price: Number((20 + (i % 30) + 19.99).toFixed(2)), // Deterministic price
        available_return: 8 + (i % 17) // Deterministic available return
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

  // Generate 45 more returns (total 50) - using deterministic values
  for (let i = 6; i <= 50; i++) {
    const returnDate = new Date(2024, 2, 22 + i);
    const statusIndex = i % statuses.length; // Deterministic status
    const status = statuses[statusIndex];
    const items = [
      {
        sku: `SH-SN-${String(i).padStart(3, '0')}`,
        title: `Running Shoes Model ${i}`,
        qty: 1 + (i % 10), // Deterministic quantity
        reason: reasons[i % reasons.length] // Deterministic reason
      }
    ];

    additionalReturns.push({
      id: i,
      rma_number: `RMA-2024-${String(i).padStart(3, '0')}`,
      po_number: `PO-2024-${String(i).padStart(3, '0')}`,
      status,
      created_at: returnDate.toISOString().split('T')[0],
      total_value: Number((items[0].qty * (50 + (i % 50) + 49.99)).toFixed(2)), // Deterministic value
      items,
      approval_needed: status === 'pending',
      approver: status === 'pending' ? null : approvers[i % approvers.length], // Deterministic approver
      tracking_number: status === 'shipped' ? `1Z999AA${String(100000 + i).padStart(6, '0')}` : null // Deterministic tracking
    });
  }

  return {
    orders: [...initialOrders, ...additionalOrders],
    returns: [...initialReturns, ...additionalReturns]
  };
};

const { orders: sampleOrders } = generateSampleData();

// Internal memoized component for individual order items
interface OrderItemProps {
  item: ReturnItem;
  order: any;
  selectedItems: ReturnItem[];
  onToggleItem: (checked: boolean, item: ReturnItem, poNumber: string) => void;
}
const OrderItem: React.FC<OrderItemProps> = React.memo(({ item, order, selectedItems, onToggleItem }) => {
  const isSelected = selectedItems.some(
    (selected: ReturnItem) => selected.sku === item.sku && selected.po_number === order.po_number
  );

  const handleToggle = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleItem(e.target.checked, item, order.po_number);
  }, [onToggleItem, item, order.po_number]);

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleToggle}
            className="h-4 w-4 text-blue-600"
          />
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-600">
              SKU: {item.sku} • Qty: {item.qty} • Available: {item.available_return}
            </p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">${item.price}</p>
        <p className="text-sm text-gray-600">Available: {item.available_return}</p>
      </div>
    </div>
  );
});

// Internal memoized component for order section
interface OrderSectionProps {
  order: any;
  selectedItems: ReturnItem[];
  onToggleItem: (checked: boolean, item: ReturnItem, poNumber: string) => void;
  onSelectAllItems: (allItems: ReturnItem[]) => void;
}
const OrderSection: React.FC<OrderSectionProps> = React.memo(({ order, selectedItems, onToggleItem, onSelectAllItems }) => {
  const handleSelectAll = React.useCallback(() => {
    const allItems = order.items.map((item: any) => ({
      ...item,
      po_number: order.po_number,
      return_qty: item.available_return,
      reason: ''
    }));
    onSelectAllItems(allItems);
  }, [order, onSelectAllItems]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">{order.po_number}</h3>
          <p className="text-sm text-gray-600">
            {order.order_date} • ${order.total.toLocaleString()}
          </p>
        </div>
        <button 
          onClick={handleSelectAll}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Select All Items
        </button>
      </div>
      <div className="space-y-3">
        {order.items.map((item: any, index: number) => (
          <OrderItem
            key={`${order.po_number}-${item.sku}-${index}`}
            item={item}
            order={order}
            selectedItems={selectedItems}
            onToggleItem={onToggleItem}
          />
        ))}
      </div>
    </div>
  );
});

// Internal ItemSelectionPage component
interface ItemSelectionPageProps {
  navigate: (view: string) => void;
  selectedItems: ReturnItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ReturnItem[]>>;
  sampleOrders: any[];
}
const ItemSelectionPage: React.FC<ItemSelectionPageProps> = ({ navigate, selectedItems, setSelectedItems, sampleOrders }) => {
  const [searchBySKU, setSearchBySKU] = React.useState('');
  const [filteredOrders, setFilteredOrders] = React.useState(sampleOrders);

  // Update filteredOrders when sampleOrders changes
  React.useEffect(() => {
    setFilteredOrders(sampleOrders);
  }, [sampleOrders]);

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBySKU(e.target.value);
  }, []);

  const handleSearch = React.useCallback(() => {
    const query = searchBySKU.trim().toLowerCase();
    if (!query) {
      setFilteredOrders(sampleOrders);
      return;
    }
    setFilteredOrders(
      sampleOrders.filter(order =>
        order.po_number.toLowerCase().includes(query) ||
        order.items.some((item: any) =>
          item.sku.toLowerCase().includes(query)
        )
      )
    );
  }, [searchBySKU, sampleOrders]);

  const handleToggleItem = React.useCallback((isChecked: boolean, item: ReturnItem, poNumber: string) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, {
        ...item,
        po_number: poNumber,
        return_qty: item.available_return,
        reason: ''
      }]);
    } else {
      setSelectedItems(prev => prev.filter(selected => 
        !(selected.sku === item.sku && selected.po_number === poNumber)
      ));
    }
  }, [setSelectedItems]);

  const handleSelectAllItems = React.useCallback((allItems: ReturnItem[]) => {
    setSelectedItems(allItems);
  }, [setSelectedItems]);

  const handleBackToDashboard = React.useCallback(() => {
    navigate('landing');
  }, [navigate]);

  const handleContinue = React.useCallback(() => {
    navigate('return-details');
  }, [navigate]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <button 
          onClick={handleBackToDashboard}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Select Items for Return</h1>
        <p className="text-gray-600 mt-2">Choose items from your orders or search by SKU</p>
      </div>
      {/* SKU Search Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Search
        </h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter SKU or Order Number to search..."
            value={searchBySKU}
            onChange={handleSearchChange}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Search
          </button>
        </div>
        <p className="text-sm text-gray-600">Search for items by SKU or Order Number regardless of order date</p>
      </div>
      {/* Order Selection */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <OrderSection
                key={order.id}
                order={order}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
                onSelectAllItems={handleSelectAllItems}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
          >
            Continue with {selectedItems.length} items
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
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
  const [showAIFeatures, setShowAIFeatures] = useState(true);
  const [shippingPreference, setShippingPreference] = useState('own'); // 'own', 'turnify', 'none'
  const [searchBySKU, setSearchBySKU] = useState('');
  const [openRA, setOpenRA] = useState(false);
  const [openRAForm, setOpenRAForm] = useState({
    identifierType: 'sku',
    productId: '',
    quantity: 1,
    reason: ''
  });
  const [customReturnReasons] = useState([
    'Quality Issue',
    'Wrong Size',
    'Damaged in Transit',
    'Customer Changed Mind',
    'Defective Product',
    'Wrong Color',
    'Not as Described',
    'Late Delivery',
    'Duplicate Order',
    'Other'
  ]);
  const [returnReasons, setReturnReasons] = useState<Record<string, string>>({});
  const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>({});
  const [returnComments, setReturnComments] = useState<Record<string, string>>({});

  // Initialize returns data with state management
  const [returnsData, setReturnsData] = useState<ReturnData[]>(() => {
    const { returns } = generateSampleData();
    return returns;
  });

  // Function to add new return
  const addNewReturn = (newReturn: ReturnData) => {
    setReturnsData(prev => [newReturn, ...prev]);
  };

  // Generate analytics from current returns data
  const sampleAnalytics = {
    totalReturns: returnsData.length,
    pendingApprovals: returnsData.filter(r => r.status === 'pending').length,
    approvedReturns: returnsData.filter(r => r.status === 'approved').length,
    rejectedReturns: returnsData.filter(r => r.status === 'rejected').length,
    totalValue: returnsData.reduce((sum, r) => sum + r.total_value, 0),
    avgProcessingTime: '2.3 days'
  };

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
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold ml-2 focus:outline-none transition shadow hover:shadow-lg hover:scale-105 cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowAIFeatures(v => !v)}
            title={showAIFeatures ? 'Hide AI Features' : 'Show AI Features'}
          >
            AI-powered
          </button>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => navigate('item-selection')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm p-4 flex flex-col items-center hover:shadow-md transition"
        >
          <Package className="h-8 w-8 text-white mb-2" />
          <span className="font-semibold text-base">Create New Return</span>
          <span className="text-xs text-blue-100 mt-1">Start a new return request</span>
        </button>
        <button 
          onClick={() => navigate('open-ra')}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-sm p-4 flex flex-col items-center hover:shadow-md transition"
        >
          <AlertTriangle className="h-8 w-8 text-white mb-2" />
          <span className="font-semibold text-base">Return Without Order</span>
          <span className="text-xs text-orange-100 mt-1">Open RA for items w/o order</span>
        </button>
        <button 
          onClick={() => navigate('returns-list')}
          className="bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm p-4 flex flex-col items-center hover:shadow-md transition"
        >
          <Eye className="h-8 w-8 text-white mb-2" />
          <span className="font-semibold text-base">View Returns</span>
          <span className="text-xs text-green-100 mt-1">Track your returns</span>
        </button>
        {(userRole === 'admin_csr' || userRole === 'admin_admin') && (
          <button 
            onClick={() => navigate('admin-dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm p-4 flex flex-col items-center hover:shadow-md transition"
          >
            <Users className="h-8 w-8 text-white mb-2" />
            <span className="font-semibold text-base">Admin Dashboard</span>
            <span className="text-xs text-purple-100 mt-1">Manage approvals</span>
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
            {returnsData.slice(0, 3).map(returnItem => (
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

      {/* AI Features Section */}
      {showAIFeatures && (
        <div
          className="bg-gradient-to-br from-blue-50/80 to-white/80 backdrop-blur-md shadow-xl rounded-2xl border border-blue-100 p-6 mb-8 max-w-md mx-auto md:mx-0 md:fixed md:right-8 md:top-28 md:w-96 animate-fade-in z-20"
          style={{ transition: 'box-shadow 0.3s' }}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-extrabold text-blue-800 flex items-center gap-2">
              <span role="img" aria-label="AI">🤖</span>
              AI Features in Turnify
            </h2>
            <button
              className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
              onClick={() => setShowAIFeatures(false)}
            >
              Hide Me
            </button>
          </div>
          <ul className="list-disc pl-6 text-blue-900 text-base space-y-1">
            <li>Automated return approval using AI risk analysis</li>
            <li>AI-generated recommendations for manual review</li>
            <li>Fraud detection and flagging of suspicious returns</li>
            <li>Smart inventory optimization suggestions</li>
            <li>Real-time AI status updates and explanations</li>
            <li>Seamless SAP S/4 HANA integration</li>
            <li>Configurable approval workflows and custom logic</li>
            <li>Flexible product identifier support (SKU, UPC, EAN)</li>
          </ul>
        </div>
      )}
    </div>
  );

  // Open RA Page
  const OpenRAPage = () => {
    const handleSubmit = () => {
      if (!openRAForm.productId || !openRAForm.reason) {
        alert('Please fill in all required fields');
        return;
      }

      // Create Open RA item and add to selected items
      const openRAItem = {
        sku: openRAForm.productId,
        title: `Open RA - ${openRAForm.productId}`,
        qty: openRAForm.quantity,
        price: 0, // Will be determined by system
        available_return: openRAForm.quantity,
        po_number: 'OPEN-RA',
        return_qty: openRAForm.quantity,
        reason: openRAForm.reason,
        isOpenRA: true
      };

      setSelectedItems([openRAItem]);
      navigate('return-details');
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate('landing')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Return Without Original Order</h1>
          <p className="text-gray-600 mt-2">Create an Open RA for items without a specific order reference</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">When to use Open RA:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Items received without a purchase order</li>
            <li>• Long-tail returns from old orders</li>
            <li>• Items with missing or incorrect order references</li>
            <li>• Special circumstances requiring manual processing</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Open RA Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Identifier Type *</label>
              <select 
                value={openRAForm.identifierType}
                onChange={(e) => setOpenRAForm({...openRAForm, identifierType: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="upc">UPC</option>
                <option value="ean">EAN</option>
                <option value="custom">Custom ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product ID *</label>
              <input
                type="text"
                placeholder={`Enter ${openRAForm.identifierType.toUpperCase()}...`}
                value={openRAForm.productId}
                onChange={(e) => setOpenRAForm({...openRAForm, productId: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
              <input
                type="number"
                min="1"
                value={openRAForm.quantity}
                onChange={(e) => setOpenRAForm({...openRAForm, quantity: parseInt(e.target.value) || 1})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Reason *</label>
              <select 
                value={openRAForm.reason}
                onChange={(e) => setOpenRAForm({...openRAForm, reason: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a reason</option>
                {customReturnReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button 
              onClick={() => navigate('landing')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Continue to Return Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Return Details Page
  const ReturnDetailsPage = () => {
    const [returnReasons, setReturnReasons] = useState<Record<string, string>>({});
    const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>({});
    const [shippingPreference, setShippingPreference] = useState('own');

    // Helper to get unique item key
    const getItemKey = (item: ReturnItem) => `${item.sku}_${item.po_number || (item.isOpenRA ? 'OPEN-RA' : '')}`;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate(selectedItems[0]?.isOpenRA ? 'open-ra' : 'item-selection')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {selectedItems[0]?.isOpenRA ? 'Open RA' : 'Item Selection'}
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

        {/* Shipping Preferences */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="shipping"
                value="own"
                checked={shippingPreference === 'own'}
                onChange={(e) => setShippingPreference(e.target.value)}
                className="mr-3"
              />
              <div>
                <span className="font-medium">Use my own shipping account</span>
                <p className="text-sm text-gray-600">We'll provide return details for your carrier</p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="shipping"
                value="turnify"
                checked={shippingPreference === 'turnify'}
                onChange={(e) => setShippingPreference(e.target.value)}
                className="mr-3"
              />
              <div>
                <span className="font-medium">Use Turnify shipping label</span>
                <p className="text-sm text-gray-600">We'll generate and email you a prepaid label</p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="shipping"
                value="none"
                checked={shippingPreference === 'none'}
                onChange={(e) => setShippingPreference(e.target.value)}
                className="mr-3"
              />
              <div>
                <span className="font-medium">No shipping needed</span>
                <p className="text-sm text-gray-600">Return details only, no label provided</p>
              </div>
            </label>
          </div>
        </div>

        {/* Return Items with Custom Reasons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Return Items</h2>
          <div className="space-y-4">
            {selectedItems.map((item, index) => {
              // Use a stable, unique key for each item
              const itemKey = `${item.sku}_${item.po_number || (item.isOpenRA ? 'OPEN-RA' : '')}_${index}`;
              return (
                <div key={itemKey} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.isOpenRA ? `Open RA - ${item.sku}` : `SKU: ${item.sku} • PO: ${item.po_number}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price || 'TBD'}</p>
                      <p className="text-sm text-gray-600">Available: {item.available_return}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Return Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max={item.available_return}
                        value={returnQuantities[itemKey] || item.return_qty || 1}
                        onChange={(e) => setReturnQuantities({
                          ...returnQuantities,
                          [itemKey]: parseInt(e.target.value)
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Return Reason</label>
                      <select
                        value={returnReasons[itemKey] || item.reason || ''}
                        onChange={(e) => setReturnReasons({
                          ...returnReasons,
                          [itemKey]: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a reason</option>
                        {customReturnReasons.map(reason => (
                          <option key={reason} value={reason}>{reason}</option>
                        ))}
                      </select>
                      {/* Comment box appears when a reason is selected */}
                      {returnReasons[itemKey] && (
                        <textarea
                          className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Add additional comments (optional)"
                          value={returnComments[itemKey] || ''}
                          onChange={e => setReturnComments({
                            ...returnComments,
                            [itemKey]: e.target.value
                          })}
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
            onClick={() => navigate(selectedItems[0]?.isOpenRA ? 'open-ra' : 'item-selection')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button 
            onClick={() => navigate('approval-check')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Submit Return Request
          </button>
        </div>
      </div>
    );
  };

  // Approval Check Page
  const ApprovalCheckPage = () => {
    const [isChecking, setIsChecking] = useState(true);
    const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
    const [aiRecommendation, setAiRecommendation] = useState('');

    useEffect(() => {
      // Simulate approval check with AI analysis
      const timer = setTimeout(() => {
        setIsChecking(false);
        
        // AI recommendation logic
        const totalValue = selectedItems.reduce((sum, item) => sum + ((item.price || 0) * (returnQuantities[item.sku] || item.return_qty || 1)), 0);
        const hasOpenRA = selectedItems.some(item => item.isOpenRA);
        
        if (hasOpenRA) {
          setApprovalStatus('pending');
          setAiRecommendation('Open RA returns require manual review. Our team will contact you within 24 hours.');
        } else if (totalValue > 1000) {
          setApprovalStatus('pending');
          setAiRecommendation('High-value return detected. Manual approval required for amounts over $1,000.');
        } else if (totalValue > 500) {
          setApprovalStatus('approved');
          setAiRecommendation('Return approved with standard processing. Shipping label will be generated.');
        } else {
          setApprovalStatus('approved');
          setAiRecommendation('Quick approval granted. Return meets all criteria for immediate processing.');
        }

        // Create new return record
        const newReturn: ReturnData = {
          id: Date.now(), // Use timestamp as unique ID
          rma_number: `RMA-${new Date().getFullYear()}-${String(returnsData.length + 1).padStart(3, '0')}`,
          po_number: selectedItems[0]?.isOpenRA ? 'OPEN-RA' : selectedItems[0]?.po_number || 'N/A',
          status: hasOpenRA || totalValue > 1000 ? 'pending' : 'approved',
          created_at: new Date().toISOString().split('T')[0],
          total_value: totalValue,
          items: selectedItems.map((item, index) => {
            const itemKey = `${item.sku}_${item.po_number || (item.isOpenRA ? 'OPEN-RA' : '')}_${index}`;
            return {
              sku: item.sku,
              title: item.title,
              qty: returnQuantities[itemKey] || item.return_qty || 1,
              reason: returnReasons[itemKey] || item.reason || 'Not specified',
              comment: returnComments[itemKey] || ''
            };
          }),
          approval_needed: hasOpenRA || totalValue > 1000,
          approver: hasOpenRA || totalValue > 1000 ? null : 'Auto-approved',
          tracking_number: hasOpenRA || totalValue > 1000 ? null : `1Z999AA${Date.now().toString().slice(-10)}`
        };

        // Add the new return to the system
        addNewReturn(newReturn);
      }, 2000);

      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate('return-details')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Return Details
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Return Approval Check</h1>
          <p className="text-gray-600 mt-2">Turnify AI is analyzing your return request</p>
        </div>

        {isChecking ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Analyzing Return Request</h2>
            <p className="text-gray-600">Turnify AI is evaluating your return against our policies...</p>
            
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                Checking return eligibility
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                Validating product information
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                Reviewing customer history
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">✓</span>
                Applying custom approval logic
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* AI Recommendation */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <span className="mr-2">🤖</span>
                AI Recommendation
              </h3>
              <p className="text-blue-700">{aiRecommendation}</p>
            </div>

            {/* Approval Status */}
            <div className={`rounded-lg p-6 ${
              approvalStatus === 'approved' ? 'bg-green-50 border border-green-200' :
              approvalStatus === 'rejected' ? 'bg-red-50 border border-red-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center mb-4">
                {approvalStatus === 'approved' && (
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                )}
                {approvalStatus === 'rejected' && (
                  <XCircle className="h-8 w-8 text-red-600 mr-3" />
                )}
                {approvalStatus === 'pending' && (
                  <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                )}
                <div>
                  <h2 className="text-xl font-semibold">
                    {approvalStatus === 'approved' ? 'Return Approved' :
                     approvalStatus === 'rejected' ? 'Return Rejected' :
                     'Manual Review Required'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {approvalStatus === 'approved' ? 'Your return has been approved and is being processed' :
                     approvalStatus === 'rejected' ? 'Your return request has been rejected' :
                     'Your return requires manual review by our team'}
                  </p>
                </div>
              </div>

              {/* Open RA Specific Notice */}
              {selectedItems.some(item => item.isOpenRA) && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Open RA Processing</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Manual verification of product details required</li>
                    <li>• Price validation needed</li>
                    <li>• Expected processing time: 24-48 hours</li>
                    <li>• You will receive an email with next steps</li>
                  </ul>
                </div>
              )}

              {/* Next Steps */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Next Steps:</h4>
                <ul className="text-sm space-y-1">
                  {approvalStatus === 'approved' && (
                    <>
                      <li>• Shipping label will be emailed within 1 hour</li>
                      <li>• Package your items securely</li>
                      <li>• Drop off at any authorized carrier location</li>
                      <li>• Track your return in the portal</li>
                    </>
                  )}
                  {approvalStatus === 'pending' && (
                    <>
                      <li>• Our team will review your return within 24 hours</li>
                      <li>• You'll receive an email with the decision</li>
                      <li>• Check your email for updates</li>
                      <li>• Contact support if you have questions</li>
                    </>
                  )}
                  {approvalStatus === 'rejected' && (
                    <>
                      <li>• Review the rejection reason</li>
                      <li>• Contact support for clarification</li>
                      <li>• Consider alternative return options</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Return Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Return Summary</h3>
              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        {item.isOpenRA ? `Open RA - ${item.sku}` : `SKU: ${item.sku}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        Qty: {item.return_qty || 1}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${item.price || 'TBD'} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={() => navigate('return-details')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          {!isChecking && (
            <button 
              onClick={() => navigate('landing')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Return to Dashboard
            </button>
          )}
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
    const filteredReturns = returnsData.filter(returnItem => {
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

                {returnItem.approver === 'Auto-approved' && (
                  <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">AI Auto-Approved</span>
                )}
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
            Pending Approvals ({returnsData.filter(r => r.status === 'pending').length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {returnsData.filter(r => r.status === 'pending').map(returnItem => (
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
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-center">
                <span className="mr-2">🤖</span>
                <span className="font-semibold text-blue-800">AI Recommendation: <span className="text-green-700">APPROVE</span> (Low Risk)</span>
                <span className="ml-2 text-xs text-blue-600">(AI auto-approves low-risk returns. High-risk returns are flagged for review.)</span>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Return Items</h4>
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
              {(selectedReturn.items || returnsData[0]?.items || []).map((item, index) => (
                <div key={item.sku + '_' + index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-600">Reason: {item.reason}</p>
                      {item.comment && (
                        <p className="text-sm text-gray-500 italic">Comment: {item.comment}</p>
                      )}
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
        return <ItemSelectionPage navigate={navigate} selectedItems={selectedItems} setSelectedItems={setSelectedItems} sampleOrders={sampleOrders} />;
      case 'open-ra':
        return <OpenRAPage />;
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