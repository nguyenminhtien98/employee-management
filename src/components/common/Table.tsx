/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";

export type SortOrder = "asc" | "desc";

export interface TableColumn<T> {
  key: keyof T | string;
  title: ReactNode;
  sortable?: boolean;
  width?: string | number;
  maxWidth?: string | number;
  truncate?: boolean;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  sortKey?: string;
  sortOrder?: SortOrder;
  onChangeSort?: (key: string) => void;
  rowKey?: (row: T, index: number) => string | number;
}

export default function Table<T extends object>({
  columns,
  data,
  sortKey,
  sortOrder,
  onChangeSort,
  rowKey,
}: TableProps<T>) {
  const headerCell = (col: TableColumn<T>) => {
    const clickable = col.sortable && onChangeSort;
    const isActive = clickable && String(col.key) === sortKey;
    const caret = isActive ? (sortOrder === "asc" ? "▲" : "▼") : "▲";

    const style: React.CSSProperties = {
      width: col.width,
      maxWidth: col.maxWidth,
    };

    return (
      <th
        key={String(col.key)}
        style={style}
        className={clickable ? "sortable" : ""}
        onClick={clickable ? () => onChangeSort!(String(col.key)) : undefined}
      >
        {clickable ? (
          <div className="sort-header">
            {col.title}
            <span className={`sort-icon ${isActive ? "active" : "inactive"}`}>
              {caret}
            </span>
          </div>
        ) : (
          col.title
        )}
      </th>
    );
  };

  const renderCell = (col: TableColumn<T>, row: T) => {
    const content = col.render
      ? col.render(row)
      : ((row as any)[String(col.key)] as ReactNode);

    if (col.truncate && typeof content === "string") {
      const style: React.CSSProperties = {
        maxWidth: col.maxWidth || "300px",
      };
      return (
        <div className="table-cell-truncate" style={style} title={content}>
          {content}
        </div>
      );
    }

    if (col.maxWidth) {
      return (
        <div style={{ maxWidth: col.maxWidth, overflow: "hidden" }}>
          {content}
        </div>
      );
    }

    return content;
  };

  const tdStyle = (col: TableColumn<T>): React.CSSProperties => ({
    maxWidth: col.maxWidth,
  });

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>{columns.map(headerCell)}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={rowKey ? rowKey(row, idx) : idx}>
                {columns.map((col) => (
                  <td key={String(col.key)} style={tdStyle(col)}>
                    {renderCell(col, row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
