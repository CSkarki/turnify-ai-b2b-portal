export interface ReturnItem {
  upc: string;
  title: string;
  qty: number;
  price?: number;
  available_return?: number;
  po_number?: string;
  return_qty?: number;
  reason?: string;  // Make this optional to match your usage
  comment?: string;
  isOpenRA?: boolean;
  sku?: string; // Add this line with optional modifier
}

export interface ReturnData {
  id: number;
  rma_number: string;
  po_number: string;
  status: string;
  created_at: string;
  total_value: number;
  items: ReturnItem[];  // ← Change this line
  approval_needed: boolean;
  approver?: string | null;
  tracking_number?: string | null;
}