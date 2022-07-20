import React from "react";

type PageStudentProps = {};
type PageStudentState = {
}

export default class PageStudent extends React.Component<PageStudentProps, PageStudentState> {
    constructor(props: PageStudentProps) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div>
                <h1>Page Student</h1>
            </div>
        );
    }
}
