import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";


const Table = (props) => {
  const data = props.data;
  const columns = props.columns;

  const [columnFilters, setColumnFilters] = React.useState([]);

  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });
  if (props.rowspan) {
    return (
      <div className="card">
        <table className="table table-sm table-hover App-card1">
          <thead className="thead-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup}>
                {headerGroup.headers.map((header, i) => {
                  return (
                    <th key={"header-th-"+i} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div style={{ cursor: "pointer" }}
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              style: header.column.getCanSort()
                                ? { cursor: "pointer" }
                                : {},
                            }}
                          >
                            {header.column.getCanFilter() ? (
                              <div className="d-flex flex-column">
                                <Filter column={header.column} table={table} />
                              </div>
                            ) : <div className="d-flex flex-column"><span
                              style={{ fontWeight: "bold", fontSize: "1rem" }}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted()] || ""}
                              {header.column.id.charAt(0).toUpperCase()
                                + header.column.id.slice(1)}
                            </span>
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Sizing example input"
                                style={{ visibility: "hidden" }}
                              />
                            </div>}
                          </div>
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          {Object.entries(table.getRowModel().rowsById).map((row, i) => {
            let handletd = row[1].getAllCells()[0];
            let valuestd = row[1].getAllCells()[1];
            let extratds = [];
            return (
              <tbody key={"tbody-"+i}>
                <tr key={"tbody-tr-"+i} className="border-bottom">
                  <td key={"tbody-tr-td-rowspan"+i} rowSpan={valuestd.getValue().length}>
                    <div className="p-2">
                      <span className="d-block font-weight-bold">
                        <span>{handletd.getValue()}</span>
                      </span>
                    </div>
                  </td>
                  <td key={"tbody-tr-td-key"+i}>
                    <div className="p-2">
                      <span className="d-block font-weight-bold">
                        <span>{valuestd.getValue()[0].type}</span>
                      </span>
                    </div>
                  </td>
                  <td key={"tbody-tr-td-value"+i}>
                    <div className="p-2">
                      <span className="d-block font-weight-bold">
                        <span>{valuestd.getValue()[0].value}</span>
                      </span>
                    </div>
                  </td>
                </tr>
                {
                  valuestd.getValue().slice(1).forEach((val, i) => {
                    extratds.push(
                      <tr key={"tbody-tr-"+i}>
                        <td key={"tbody-tr-td-key"+i}>{val.type}</td>
                        <td key={"tbody-tr-td-value"+i}>{val.value}</td>
                      </tr>
                    )
                  })
                }
                {extratds}
              </tbody>
            );
          })}
        </table>
      </div>
    );
  }
  else {
    return (
      <div className="card">
        <table className="table table-sm table-hover App-card1">
          <thead className="thead-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div style={{ cursor: "pointer" }}
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              style: header.column.getCanSort()
                                ? { cursor: "pointer" }
                                : {},
                            }}
                          >
                            {header.column.getCanFilter() ? (
                              <div className="d-flex flex-column">
                                <Filter column={header.column} table={table} />
                              </div>
                            ) : <div className="d-flex flex-column"><span
                              style={{ fontWeight: "bold", fontSize: "1rem" }}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted()] || ""}
                              {header.column.id.charAt(0).toUpperCase()
                                + header.column.id.slice(1)}
                            </span>
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Sizing example input"
                                style={{ visibility: "hidden" }}
                              />
                            </div>}
                          </div>
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="border-bottom">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        <div className="p-2">
                          <span className="d-block font-weight-bold">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

function Filter({ column, table }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <span
        style={{ fontWeight: "bold", fontSize: "1rem" }}
        onClick={column.getToggleSortingHandler()}
      >
        {{
          asc: " 🔼",
          desc: " 🔽",
        }[column.getIsSorted()] || ""}
        {column.id.charAt(0).toUpperCase()
          + column.id.slice(1)}
      </span>
      <DebouncedInput
        type="text"
        value={columnFilterValue || ""}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search...`}
        list={column.id + "list"}
      />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 100,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      type="text"
      className="form-control border"
      aria-label="Sizing example input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Table;
