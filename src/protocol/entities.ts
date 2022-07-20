interface Student {
    id: number,
    studentNumber: number,
    name: string,
    email: string,
    startYear: number,
    majorId: number,
    planId: number,
    createdAt: Date,
    updatedAt: Date
}

interface Major {
    id: number,
    name: string,
    createdAt: Date,
    updatedAt: Date
}

interface Plan {
    id: number,
    creditRequired: number,
    endYear: number,
    createdAt: Date,
    updatedAt: Date
}

interface Staff {
    id: number,
    staffNumber: number,
    name: string,
    email: string,
    majorId: number,
    createdAt: Date,
    updatedAt: Date
}

interface Course {
    id: number,
    crn: number,
    name: string,
    isOpen: boolean,
    isElective: boolean,
    credit: number,
    staffId: number,
    startDate: Date,
    endDate: Date,
    location: string,
    weekday: string,
    time: string,
    capacity: number,
    registeredCount: number,
    createdAt: Date,
    updatedAt: Date
}

interface Grade {
    id: number,
    registrationId: number,
    scoreEarned: number,
    scoreTotal: number,
    scorePassing: number,
    isPassed: boolean,
    note: string,
    createdAt: Date,
    updatedAt: Date
}

interface Registration {
    id: number,
    courseId: number,
    studentId: number,
    createdAt: Date,
    updatedAt: Date
}

export type { Student, Major, Plan, Staff, Course, Grade, Registration }

