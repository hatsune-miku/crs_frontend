import * as TableFunctions from './table_base'

const Column = [
    {field: "staffNumber", headerName: "Staff#"},
    {field: "name", headerName: "Name", postProcessor: TableFunctions.filterEmpty},
    {field: "email", headerName: "Email", postProcessor: TableFunctions.filterEmpty},
    {field: "majorName", headerName: "Major" },
    {field: "createdAt", type: 'date', headerName: "Created At"},
    {field: "updatedAt", type: 'date', headerName: "Updated At"},
];

export default Column;
