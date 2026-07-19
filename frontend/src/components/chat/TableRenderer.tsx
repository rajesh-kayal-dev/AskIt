import React from 'react';

export const TableRenderer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-700/50 shadow-sm scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <table className="w-full text-left text-sm text-gray-300">
        {children}
      </table>
    </div>
  );
};

export const TableHeadRenderer = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-800/80 text-xs uppercase text-gray-400 sticky top-0 backdrop-blur-sm z-10">
    {children}
  </thead>
);

export const TableRowRenderer = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-gray-700/50 bg-[#212121] hover:bg-[#2a2a2a] transition-colors">
    {children}
  </tr>
);

export const TableHeaderCellRenderer = ({ children }: { children: React.ReactNode }) => (
  <th className="px-6 py-4 font-semibold whitespace-nowrap">
    {children}
  </th>
);

export const TableCellRenderer = ({ children }: { children: React.ReactNode }) => (
  <td className="px-6 py-4">
    {children}
  </td>
);
