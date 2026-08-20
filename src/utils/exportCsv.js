export function exportToCsv(filename, rows, columns) {
  const headers = columns.map((c) => c.label).join(';');
  const lines = rows.map((row) =>
    columns.map((c) => {
      const value = row[c.key] ?? '';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    }).join(';')
  );
  const csv = '\uFEFF' + headers + '\n' + lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}