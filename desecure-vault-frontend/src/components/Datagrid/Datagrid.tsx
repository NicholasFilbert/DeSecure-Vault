'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faFile, faEllipsisV, IconDefinition, faHome } from '@fortawesome/free-solid-svg-icons';
import MoreOptions from './MoreOptions';

type SortOrder = "asc" | "desc" | null;

const Datagrid: React.FC<DataGridProps> = ({
  columns = [],
  data = [],
  // onFilter,
  fetchData = () => { return [] },
  hasDetail = false,
  detailContent = [],
  pageSize = 10,
  className = ''
}) => {
  const [content, setContent] = useState(data)
  const [originalContent, setOriginalContent] = useState(data)
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLTableRowElement | null>(null)
  const hasLoadedOnce = useRef(false);
  const hasUserScrolled = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      hasUserScrolled.current = true;
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const loadItems = async () => {
      const newItems = await fetchData(page);
      const updatedContent = [...content, ...newItems]
      setContent(updatedContent)
      setOriginalContent(updatedContent)
      if (newItems.length < pageSize) setHasMore(false)
      hasLoadedOnce.current = true;
    }
    loadItems()
  }, [page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && hasLoadedOnce.current && hasUserScrolled.current) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore]);

  function onSort(key: string) {
    let newOrder: SortOrder;

    if (sortKey !== key) {
      newOrder = "asc";
    } else if (sortOrder === "asc") {
      newOrder = "desc";
    } else if (sortOrder === "desc") {
      newOrder = null;
    } else {
      newOrder = "asc";
    }

    setSortKey(newOrder ? key : null);
    setSortOrder(newOrder);

    if (newOrder === null) {
      setContent(originalContent);
      return;
    }

    const sorted = [...content].sort((a, b) => {
      let valA = a?.[key];
      let valB = b?.[key];

      if (valA == null && valB == null) return 0;
      if (valA == null) return newOrder === "asc" ? 1 : -1;
      if (valB == null) return newOrder === "asc" ? -1 : 1;

      const isNumeric = (v: any) => !isNaN(parseFloat(v)) && isFinite(v);
      const isDateLike = (val: any) =>
        val instanceof Date || (typeof val === "string" && !isNaN(Date.parse(val)));

      if (isDateLike(valA) && isDateLike(valB)) {
        valA = new Date(valA);
        valB = new Date(valB);
        return newOrder === "asc"
          ? valA.getTime() - valB.getTime()
          : valB.getTime() - valA.getTime();
      }

      if (typeof valA === "boolean" && typeof valB === "boolean") {
        return newOrder === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      if (isNumeric(valA) && isNumeric(valB)) {
        return newOrder === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return newOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return 0;
    });

    setContent(sorted);
  }

  return (
    <div className={`w-full overflow-x-auto rounded-md shadow-sm ${className?.trim() === '' ? 'h-full' : className}`}>
      <table className="table-auto w-full">
        <thead className="">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`sticky top-0 bg-background z-10 h-[50px] border-b border-border text-left px-4 font-medium bg-card hover:bg-hover cursor-pointer ${column.hide === 'mobile' ? 'hidden sm:table-cell' : ''
                  } ${column.width ? column.width : ''}`}
                onClick={() => column.sortable && onSort(column.key)}
              >
                <button
                  className="flex items-center focus:outline-none cursor-pointer"
                >
                  <span>{column.label}</span>
                  {column.sortable && (
                    <FontAwesomeIcon
                      icon={faSort}
                      className="ml-2 text-xs text-gray-400"
                    />
                  )}
                </button>
              </th>
            ))}
            {hasDetail && (
              <th className="sticky top-0 bg-background z-10 h-[50px] border-b border-border px-4 w-[50px] bg-card">
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {content.map((row, index) => {
            const isLast = index === content.length - 1
            return (
              <tr
                key={row.id}
                className="h-[50px] border-b border-border cursor-pointer hover:bg-primary-dark/15 transition-colors duration-200"
                onClick={row.onClick}
              >
                {columns.map((column) => (
                  <td key={row.id + '-' + column.key} className="px-4">
                    <div className="flex items-center">
                      {column.icon && (
                        <FontAwesomeIcon
                          icon={column.icon}
                          className="mr-3 text-gray-500"
                          size="sm"
                        />
                      )}
                      <span className="truncate">{row[column.key]}</span>
                    </div>
                  </td>
                ))}

                {hasDetail && (
                  <td key={row.id + '-' + 'more'} className="px-4 w-[50px]">
                    <MoreOptions id={row.id} detailContent={detailContent} />
                  </td>
                )}
              </tr>
            )

          }
          )}

          {hasMore && (
            <tr>
              <td colSpan={columns.length + (hasDetail ? 1 : 0)} className="text-center py-4 text-gray-400">
                <div ref={loaderRef}>Loading more...</div>
              </td>
            </tr>
          )}

          {!hasMore && (
            <tr>
              <td colSpan={columns.length + (hasDetail ? 1 : 0)} className="text-center py-4 text-green-500">
                🎉 No more items!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Datagrid;