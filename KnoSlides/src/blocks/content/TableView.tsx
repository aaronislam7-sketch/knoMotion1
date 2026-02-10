/**
 * TableView Block
 * 
 * Displays tabular data with optional highlighting.
 * Used for source data and result tables.
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { TableViewConfig } from '../../types/unified-schema';

export const TableView: React.FC<BlockComponentProps<TableViewConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { 
    columns, 
    rows, 
    emptyState = 'No data available', 
    title,
    highlightRows = [],
    highlightColumns = [],
  } = config;

  const columnHelper = createColumnHelper<Record<string, unknown>>();
  
  const tableColumns = useMemo(
    () => columns.map(col => 
      columnHelper.accessor(col.key, {
        header: col.label,
        cell: info => {
          const value = info.getValue();
          if (value === null || value === undefined) {
            return <span className="text-slate-400 italic">NULL</span>;
          }
          if (typeof value === 'boolean') {
            return value ? (
              <span className="text-emerald-600">true</span>
            ) : (
              <span className="text-red-600">false</span>
            );
          }
          return String(value);
        },
      })
    ),
    [columns]
  );

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isEmpty = rows.length === 0;

  return (
    <div
      id={id}
      className={`
        kno-panel overflow-hidden min-w-0
        ${stylePreset === 'compact' ? '' : ''}
        ${className}
      `}
    >
      {/* Header */}
      {title && (
        <div className="kno-panel-header">
          <h4 className="text-[13px] font-semibold uppercase tracking-wide text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            {title}
          </h4>
        </div>
      )}
      
      {/* Table content */}
      <div className="overflow-x-auto min-w-0">
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm text-slate-500">{emptyState}</p>
            </motion.div>
          ) : (
            <motion.table
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <thead className="bg-slate-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      const isHighlighted = highlightColumns.includes(header.column.id);
                      return (
                        <th
                          key={header.id}
                          className={`
                            px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider
                            ${isHighlighted ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600'}
                          `}
                          style={columns.find(c => c.key === header.column.id)?.width 
                            ? { width: columns.find(c => c.key === header.column.id)?.width } 
                            : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.getRowModel().rows.map((row, idx) => {
                  const isHighlighted = highlightRows.includes(idx);
                  return (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`
                        ${isHighlighted ? 'bg-indigo-50' : 'hover:bg-slate-50'}
                      `}
                    >
                      {row.getVisibleCells().map(cell => {
                        const isColHighlighted = highlightColumns.includes(cell.column.id);
                        return (
                          <td 
                            key={cell.id} 
                            className={`
                              px-4 py-3 text-[13px] leading-6
                              ${isColHighlighted || isHighlighted ? 'text-slate-900 font-medium' : 'text-slate-700'}
                            `}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </tbody>
            </motion.table>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer with row count */}
      {!isEmpty && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] font-medium text-slate-500">
          {rows.length} row{rows.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default TableView;
