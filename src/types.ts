export interface ReturnItem {
  upc: string;
  title: string;
  qty: number;
  price?: number;
  available_return?: number;
  po_number?: string;
  return_qty?: number;
  reason?: string;
  isOpenRA?: boolean;
}

export interface ReturnData {
  id: number;
  rma_number: string;
  po_number: string;
  status: string;
  created_at: string;
  total_value: number;
  items: {
    upc: string;
    title: string;
    qty: number;
    reason: string;
    comment?: string;
  }[];
  approval_needed: boolean;
  approver?: string | null;
  tracking_number?: string | null;
} 