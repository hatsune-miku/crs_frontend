import * as TableFunctions from './table_base'

const Columns = [
    {field: "crn", headerName: "CRN"},
    {field: "name", width: 200, headerName: "Name"},
    {field: "isOpen", type: 'boolean', headerName: "Open?"},
    {field: "isElective", type: 'boolean', headerName: "Elective?"},
    {field: "credit", headerName: "Credit"},
    {field: "staffNumber", width: 200, headerName: "Staff Number",
        postProcessor: TableFunctions.filterInstructorWithName},
    {field: "startDate", width: 200, type: 'date', headerName: "From"},
    {field: "endDate", width: 200, type: 'date', headerName: "To"},
    {field: "location", width: 200, headerName: "Location"},
    {field: "weekday", headerName: "Weekdays"},
    {field: "time", width: 200, headerName: "Time"},
    {field: "capacity", type: 'number', headerName: "Capacity"},
    {field: "registeredCount", type: 'number', headerName: "Registered"},
    {field: "createdAt", type: 'date', width: 200, headerName: "Created At"},
    {field: "updatedAt", type: 'date', width: 200, headerName: "Updated At"},
];
export default Columns;
