import Skeleton from "./Skeleton";

interface TableSkeletonProps {
  columns: { width?: string | number; maxWidth?: string | number }[];
  rows?: number;
}

export default function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="skeleton-table">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ width: col.width, maxWidth: col.maxWidth }}>
                <Skeleton height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx} style={{ maxWidth: col.maxWidth }}>
                  <Skeleton height="20px" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
