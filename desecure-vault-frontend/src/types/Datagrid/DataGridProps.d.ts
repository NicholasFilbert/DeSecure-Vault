interface DataGridColumns {
  key: string;
  label: string;
  defaultValue?: string;
  sortable?: boolean;
  width?: string;
  maxWidth?: string;
  hide?: 'mobile' | 'none';
  icon?: IconDefinition;
}

interface DataGridProps {
  columns?: DataGridColumns[];
  data?: any[];
  // onSort?: (column: string) => void;
  // onFilter?: () => void;
  fetchData?: (...args: any) => Promise<any[]>;
  hasDetail?: boolean;
  detailContent?: any[];
  pageSize?: number;
  className?: string;
  refresh?: boolean;
}