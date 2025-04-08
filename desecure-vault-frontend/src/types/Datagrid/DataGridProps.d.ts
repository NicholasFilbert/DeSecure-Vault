interface DataGridColumns {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  hide?: 'mobile' | 'none';
  icon?: IconDefinition,
}

interface DataGridProps {
  columns?: DataGridColumns[];
  data?: any[];
  // onSort?: (column: string) => void;
  // onFilter?: () => void;
  fetchData?: (page: number) => Promise<any[]>;
  hasDetail?: boolean;
  detailContent?: any[];
  pageSize?: number;
  className?: string
}