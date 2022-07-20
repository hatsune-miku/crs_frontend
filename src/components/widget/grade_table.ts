const Columns = [
    {field: "id", headerName: "#"},
    {field: "registrationId", width: 110, headerName: "Registration#"},
    {field: "scoreEarned", width: 120, headerName: "Earned Score"},
    {field: "scoreTotal", width: 120, headerName: "Full Score"},
    {field: "scorePassing", width: 120, headerName: "Passing Score"},
    {field: "isPassed",  headerName: "Passed?"},
    {field: "note",  width: 300, headerName: "Note"},
    {field: "createdAt", type: 'date', width: 200, headerName: "Created At"},
    {field: "updatedAt", type: 'date', width: 200, headerName: "Updated At"},
];
export default Columns;
