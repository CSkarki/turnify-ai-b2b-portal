import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { TurnifyViewReturns } from './TurnifyViewReturns';
import { TurnifyAdmin } from './TurnifyAdmin';
import { TurnifyOpenRA } from './TurnifyOpenRA';
import { TurnifyReturnDetails } from './TurnifyReturnDetails';
import { TurnifyApprovalCheck } from './TurnifyApprovalCheck';
import { TurnifyApprovalPending } from './TurnifyApprovalPending';
import { TurnifyConfirmation } from './TurnifyConfirmation';
import { TurnifyReturnDetailsView } from './TurnifyReturnDetailsView';

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
  const LandingPage = () => {
    const statusData = [
      { label: 'Approved', color: 'bg-green-500', count: returnsData.filter(r => r.status === 'approved').length },
      { label: 'Pending', color: 'bg-yellow-400', count: returnsData.filter(r => r.status === 'pending').length },
      { label: 'Rejected', color: 'bg-red-400', count: returnsData.filter(r => r.status === 'rejected').length },
      { label: 'Shipped', color: 'bg-blue-400', count: returnsData.filter(r => r.status === 'shipped').length },
    ];
    const barChart = (
      <div className="w-full h-36 flex items-end gap-6 justify-center">
        {statusData.map(({ label, color, count }) => (
          <div key={label} className="flex flex-col items-center w-16">
            <span className="text-sm font-bold mb-1">{count}</span>
            <div className={`${color} w-8 rounded-t`} style={{ height: `${Math.max(count * 8, 12)}px` }}></div>
            <span className="text-xs mt-2 text-center">{label}</span>
          </div>
        ))}
      </div>
    );
    // Pie chart logic
    const reasonColors = {
      'Quality Issue': '#34d399',
      'Wrong Item': '#fbbf24',
      'Damaged': '#f87171',
      'Other': '#60a5fa',
    };
    let reasonCounts = { 'Quality Issue': 0, 'Wrong Item': 0, 'Damaged': 0, 'Other': 0 };
    returnsData.forEach(r => r.items.forEach(item => {
      if (item.reason === 'Quality Issue') reasonCounts['Quality Issue']++;
      else if (item.reason === 'Wrong Item Received' || item.reason === 'Wrong Item') reasonCounts['Wrong Item']++;
      else if (item.reason === 'Damaged in Transit' || item.reason === 'Defective/Damaged' || item.reason === 'Damaged') reasonCounts['Damaged']++;
      else reasonCounts['Other']++;
    }));
    const allZero = Object.values(reasonCounts).every(v => v === 0);
    if (allZero) {
      reasonCounts = { 'Quality Issue': 12, 'Wrong Item': 10, 'Damaged': 8, 'Other': 20 };
    }
    const totalReasons = Object.values(reasonCounts).reduce((a, b) => a + b, 0) || 1;
    let startAngle = 0;
    const radius = 16;
    const cx = 16, cy = 16;
    const piePaths = Object.entries(reasonCounts).map(([reason, count]) => {
      const angle = (count / totalReasons) * 360;
      const endAngle = startAngle + angle;
      const large = angle > 180 ? 1 : 0;
      const x1 = cx + radius * Math.cos((Math.PI * startAngle) / 180);
      const y1 = cy + radius * Math.sin((Math.PI * startAngle) / 180);
      const x2 = cx + radius * Math.cos((Math.PI * endAngle) / 180);
      const y2 = cy + radius * Math.sin((Math.PI * endAngle) / 180);
      const d = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${large} 1 ${x2},${y2} Z`;
      const path = <path key={reason} d={d} fill={reasonColors[reason as keyof typeof reasonColors]} />;
      startAngle = endAngle;
      return path;
    });
    const pieLegend = Object.entries(reasonCounts).map(([reason, count]) => (
      <span key={reason} className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: reasonColors[reason as keyof typeof reasonColors] }}></span>
        {reason} ({count})
      </span>
    ));

    return (
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

        {/* Metrics & Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Returns by Status Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center w-full">Returns by Status</h3>
            {barChart}
          </div>
          {/* Return Reasons Pie Chart (SVG, dynamic) */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center w-full">Return Reasons</h3>
            <svg width="100" height="100" viewBox="0 0 32 32" className="mb-2">
              <circle r="16" cx="16" cy="16" fill="#e5e7eb" />
              {piePaths}
            </svg>
            <div className="w-full flex flex-wrap justify-center gap-2 text-xs">
              {pieLegend}
            </div>
          </div>
          {/* Top Partners Summary */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Top Partners</h3>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm"><span>Tapri Store #001</span><span className="font-bold">45 returns</span></div>
              <div className="flex justify-between text-sm"><span>Thela Express</span><span className="font-bold">38 returns</span></div>
              <div className="flex justify-between text-sm"><span>CP Store Mumbai</span><span className="font-bold">29 returns</span></div>
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
  };

  // Main Render
  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'item-selection':
        return <ItemSelectionPage navigate={navigate} selectedItems={selectedItems} setSelectedItems={setSelectedItems} sampleOrders={sampleOrders} />;
      case 'open-ra':
        return <TurnifyOpenRA navigate={navigate} openRAForm={openRAForm} setOpenRAForm={setOpenRAForm} setSelectedItems={setSelectedItems} />;
      case 'return-details':
        return <TurnifyReturnDetails navigate={navigate} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />;
      case 'approval-check':
        return <TurnifyApprovalCheck selectedItems={selectedItems} returnQuantities={returnQuantities} returnReasons={returnReasons} returnComments={returnComments} returnsData={returnsData} addNewReturn={addNewReturn} navigate={navigate} />;
      case 'approval-pending':
        return <TurnifyApprovalPending navigate={navigate} />;
      case 'confirmation':
        return <TurnifyConfirmation navigate={navigate} selectedItems={selectedItems} />;
      case 'returns-list':
        return <TurnifyViewReturns searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} returnsData={returnsData} navigate={navigate} />;
      case 'admin-dashboard':
        return <TurnifyAdmin returnsData={returnsData} navigate={navigate} />;
      case 'return-details-view':
        return <TurnifyReturnDetailsView selectedReturn={selectedReturn} returnsData={returnsData} navigate={navigate} />;
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