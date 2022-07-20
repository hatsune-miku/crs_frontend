import Network from "../../util/network";
import {Course, Staff, Student} from "../../protocol/entities";

async function filterEmpty(s: any): Promise<any> {
    if (!s) {
        return "(Empty)";
    }
    return s;
}

async function filterStudentWithName(studentNumber: string): Promise<any> {
    return (await Network.getOne<Student>("student", studentNumber)).name;
}


async function filterInstructorWithName(staffNumber: string): Promise<any> {
    return (await Network.getOne<Staff>("staff", staffNumber)).name;
}

async function filterCrnWithName(crn: string): Promise<any> {
    return `${crn} (${(await Network.getOne<Course>("course", crn)).name})`;
}

export {
    filterEmpty,
    filterStudentWithName,
    filterInstructorWithName,
    filterCrnWithName
}
