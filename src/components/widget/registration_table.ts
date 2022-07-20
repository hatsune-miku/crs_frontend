import * as TF from './table_base';

const Columns = [
    {field: "id", headerName: "#"},
    {field: "courseCrn", width: 200, headerName: "Course CRN", postProcessor: TF.filterCrnWithName},
    {field: "studentNumber", width: 200, headerName: "Student Number"},
    {field: "createdAt", type: 'date', width: 200, headerName: "Created At"},
    {field: "updatedAt", type: 'date', width: 200, headerName: "Updated At"},
];

export default Columns;
