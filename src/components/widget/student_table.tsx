import * as TableFunctions from './table_base'

const Columns = [
    {field: "studentNumber", width: 140, headerName: "Student#", postProcessor: TableFunctions.filterEmpty},
    {field: "name", width: 200, headerName: "Name"},
    {field: "email", headerName: "Email"},
    {field: "startYear", headerName: "Start Year"},
    {field: "majorName", headerName: "Major", width: 240},
    {field: "planName", headerName: "Plan"},
    {field: "createdAt", type: 'date', width: 200, headerName: "Created At"},
    {field: "updatedAt", type: 'date', width: 200, headerName: "Updated At"}
];

export default Columns;
