import * as React from 'react';
import {CssVarsProvider} from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import IconButton from '@mui/joy/IconButton';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

// Icons import
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';

// custom
import teamTheme from './layout/theme';
import Menu from './layout/menu';
import Layout from './layout/layout';
import Session from "../util/session";
import {Navigate} from "react-router-dom";
import {Key, KeyRounded, LensRounded, Settings as MaterialSettings} from "@mui/icons-material";
import StudentTable from "./widget/student_table";
import MajorTable from "./widget/major_table";
import PlanTable from "./widget/plan_table";
import StaffTable from "./widget/staff_table";
import GradeTable from "./widget/grade_table";
import RegistrationTable from "./widget/registration_table";
import CourseTable from "./widget/course_table";
import About from "./widget/about";
import GenericTable, {ColumnType} from "./generic/generic_table";
import {MuiCompatCssVarsProvider} from "../joyui_ext/mui_compat";
import Alert, {AlertColor} from "@mui/material/Alert";
import {PromptAction, PromptBox} from "./widget/prompt";
import {Chip, Switch} from "@mui/joy";
import {OverridableStringUnion} from "@mui/types";
import {ColorPaletteProp} from "@mui/joy/styles/types";
import {ButtonPropsColorOverrides} from "@mui/joy/Button/ButtonProps";
import Network from "../util/network";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {TextField as MaterialTextField} from '@mui/material';
import {GridSelectionModel} from "@mui/x-data-grid/models/gridSelectionModel";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";
import Settings from "../util/settings";

const md5 = require('md5');


type GivenField = {
    fieldName: string;
    value: any;
};

type PageAdminProps = {
    role: string;

    /* Color scheme */
    setMode: (mode: any) => void;
};

type PageAdminState = {
    currentCategory: string;
    currentEntity: string;
    redirectTo: string | null;
    searchKeyword: string;
    dataTableReference: GenericTable<any> | null;
    indexItems: string[];

    /* Alerts */
    shouldShowAlert: boolean;
    alertText: string;
    alertSeverity: AlertColor;

    /* Prompts */
    shouldShowPrompt: boolean;
    promptCaption: string;
    promptText: string;
    promptSubject: string;
    promptChild: React.ReactNode,
    promptCancelButtonText: string | null;
    promptOkButtonText: string | null;
    promptOkButtonColor: OverridableStringUnion<ColorPaletteProp, ButtonPropsColorOverrides>;
    promptCancelButtonInvisible: boolean;
    promptBackgroundClickCancellable: boolean;
    promptNotDismissible: boolean;
    currentEditingModel: any;
};

const CommonlyGivenFields: GivenField[] = [
    {fieldName: 'registeredCount', value: 0},
];

export default class PageGeneric extends React.Component<PageAdminProps, PageAdminState> {
    constructor(props: PageAdminProps) {
        super(props);
        this.state = {
            currentCategory: 'student',
            currentEntity: 'student',
            redirectTo: null,
            searchKeyword: "",
            dataTableReference: null,
            indexItems: [],
            shouldShowAlert: false,
            alertText: "",
            alertSeverity: "info",
            promptCaption: "",
            promptText: "",
            shouldShowPrompt: false,
            promptSubject: "",
            promptChild: null,
            promptCancelButtonText: null,
            promptOkButtonText: null,
            promptOkButtonColor: "primary",
            promptCancelButtonInvisible: false,
            promptBackgroundClickCancellable: true,
            promptNotDismissible: false,
            currentEditingModel: {}
        };
    }

    componentDidMount() {
        this.changeColorScheme(Settings.getStoredColorScheme());
        this.checkSession();
    }

    forceRedrawMaterialComponents() {
        const currentEntityBackup = this.state.currentEntity;
        this.setState({
            currentEntity: '',
        }, () => {
            this.setState({
                currentEntity: currentEntityBackup
            })
        });
    }

    changeColorScheme(colorScheme: string) {
        Settings.setStoredColorScheme(colorScheme);
        this.props.setMode(colorScheme);
        this.forceRedrawMaterialComponents();
    }

    getRoleDescription(): string {
        switch (this.props.role) {
            case 'admin':
                return 'System Administrator';
            case 'staff':
                return 'Staff';
            case 'student':
                return 'Student';
            default:
                return 'Unknown Role';
        }
    }

    async checkSession() {
        if (!await Session.isCurrentSessionValid()) {
            this.setState({redirectTo: '/'});
        }
    }

    handleSwitchFunction(newCategory: string, newEntity: string) {
        this.setState({
            currentCategory: newCategory,
            currentEntity: newEntity,
            shouldShowAlert: false,
            indexItems: [],
            searchKeyword: "",
            currentEditingModel: {}
        });
    }

    handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
        this.setState({
            shouldShowPrompt: true,
            promptCaption: "Logout",
            promptText: "Are you sure you want to logout?",
            promptCancelButtonText: "Cancel",
            promptOkButtonText: "Logout",
            promptChild: <Chip variant="soft" startDecorator={<Key/>}>
                Current User: {Session.getStoredaccountNumber()}
            </Chip>,
            promptOkButtonColor: "primary",
            promptCancelButtonInvisible: false,
            promptSubject: "logout",
            promptNotDismissible: false,
            promptBackgroundClickCancellable: true
        });
    }

    handleSearchKeywordChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({searchKeyword: event.target.value});
    }

    handleSearchKeywordKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            // Trigger update.
            this.state.dataTableReference?.componentDidMount();
        }
    }

    handleSetDataTableReference(dataTableReference: GenericTable<any>) {
        this.setState({dataTableReference: dataTableReference});
    }

    handleIndexItemsChanged(
        selectionModel: GridSelectionModel,
        details: GridCallbackDetails
    ) {
        this.setState({
            indexItems: selectionModel.map(x => x.toString())
        });
    }

    handleAlertClose() {
        this.setState({shouldShowAlert: false});
    }

    handleClearFilters() {
        this.setState({searchKeyword: ""}, () => {
            this.state.dataTableReference?.componentDidMount();
        });
    }

    async handlePromptAction(subject: string, action: PromptAction) {
        this.setState({shouldShowPrompt: false});
        try {
            if (subject === 'logout' && action === 'ok') {
                // Perform logout.
                Session.clearStoredSessionId();
                Session.clearStoredaccountNumber();
                this.setState({redirectTo: '/'});

            } else if (subject === 'delete' && action === 'ok') {
                // Perform delete.
                this.setState({
                    shouldShowPrompt: true,
                    promptCaption: "Deleting",
                    promptText: "Process is running. Please wait.",
                    promptNotDismissible: true,
                    promptChild: null,
                })

                await this.performDelete();

                this.setState({
                    promptNotDismissible: false,
                    shouldShowPrompt: false,
                })
                this.state.dataTableReference?.componentDidMount();

            } else if (subject === 'add' && action === 'ok') {
                // Check if the model is valid.
                await this.performAdd();
                this.setState({
                    currentEditingModel: {},
                    shouldShowPrompt: false,
                });
                this.state.dataTableReference?.componentDidMount();

            }
        } catch (e: any) {
            this.setState({
                shouldShowAlert: true,
                alertText: Network.friendlyError(e,
                    `${subject} the ${this.state.currentEntity}`),
                alertSeverity: "error",
            });
        } finally {
            this.setState({shouldShowPrompt: false});
        }
    }

    async performDelete() {
        for (const indexItem of this.state.indexItems) {
            await Network.deleteOne(
                this.state.currentEntity,
                indexItem
            );
        }
    }

    async performAdd() {
        // TODO:
        // Process password md5.
        if (this.state.currentEditingModel.passwordMd5) {
            this.state.currentEditingModel.passwordMd5 =
                md5(this.state.currentEditingModel.passwordMd5)
            this.forceUpdate();
        }

        await Network.addOne(
            this.state.currentEntity,
            this.state.currentEditingModel
        );
    }

    handleDeleteSelected() {
        if (this.state.indexItems.length === 0) {
            return;
        }

        this.setState({
            shouldShowPrompt: true,
            promptCaption: "Delete",
            promptText: "Are you sure you want to delete the selected items?",
            promptCancelButtonText: "Cancel",
            promptOkButtonText: "Delete",
            promptOkButtonColor: "danger",
            promptCancelButtonInvisible: false,
            promptBackgroundClickCancellable: true,
            promptSubject: "delete",
            promptChild: null,
            promptNotDismissible: false,
        });
    }

    showCreateRecordDialog(columns: ColumnType[], givenFields: GivenField[]) {
        this.setState({
            currentEditingModel: {},
            shouldShowPrompt: false,
        }, () => {
            const setValueAndUpdate = (field: string, value: any) => {
                this.state.currentEditingModel[field] = value;
                this.forceUpdate();
            };

            // Assign given fields.
            for (const field of givenFields) {
                if (columns.find(c => c.field === field.fieldName)) {
                    setValueAndUpdate(field.fieldName, field.value);
                }
            }

            const labelFor = (column: any) => {
                return <Typography level="body3" key={column.field + "Label"}>
                    {column.headerName}
                </Typography>
            }

            const inputFor = (column: any) => {
                switch (column.type) {
                    case 'boolean':
                        return <Switch
                            disabled={givenFields.filter(f => f.fieldName === column.field).length > 0}
                            checked={this.state.currentEditingModel[column.field]}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setValueAndUpdate(column.field, event.target.checked);
                            }}
                        ></Switch>;

                    case 'date':
                        return <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MuiCompatCssVarsProvider>
                                <DatePicker
                                    views={['month', 'day', 'year']}
                                    minDate={new Date(1970, 1, 1)}
                                    maxDate={new Date(2099, 12, 31)}
                                    value={this.state.currentEditingModel[column.field]}
                                    onChange={(date: Date | null) => {
                                        setValueAndUpdate(column.field, date);
                                    }}
                                    renderInput={(params: any) =>
                                        <MaterialTextField {...params} />
                                    }
                                />
                            </MuiCompatCssVarsProvider>
                        </LocalizationProvider>;

                    default:
                        return <TextField
                            disabled={givenFields.filter(f => f.fieldName === column.field).length > 0}
                            placeholder={column.headerName}
                            value={this.state.currentEditingModel[column.field]}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setValueAndUpdate(column.field, event.target.value);
                            }}
                        />
                }
            }

            const form: React.ReactNode = <table style={{
                width: '100%', padding: '20px'
            }}>
                <tbody>
                {columns.map(column =>
                    <tr key={column.field + "Row"}>
                        <td style={{textAlign: 'right'}}>
                            {labelFor(column)}
                        </td>
                        <td>

                        </td>
                        <td>
                            <Box>
                                {inputFor(column)}
                            </Box>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>;

            this.setState({
                shouldShowPrompt: true,
                promptCaption: "Add New Record",
                promptText: `Please fill in the form to create a new ${this.state.currentEntity}.`,
                promptSubject: "add",
                promptOkButtonColor: "success",
                promptBackgroundClickCancellable: false,
                promptOkButtonText: "Create",
                promptChild: form,
                promptNotDismissible: false,
                promptCancelButtonInvisible: false,
            });
        });
    }

    handleAddNewRecord() {
        const columns = this.state.dataTableReference?.getColumnsForCreation();
        if (!columns) {
            return;
        }
        this.showCreateRecordDialog(columns, CommonlyGivenFields.concat([]));
    }

    handleStaffCreateCourse() {
        const columns = this.state.dataTableReference?.getColumnsForCreation();
        if (!columns) {
            return;
        }

        this.showCreateRecordDialog(columns, CommonlyGivenFields.concat([
            {fieldName: 'staffNumber', value: Session.getStoredaccountNumber()},
        ]));
    }


    handleStudentRegisterCourse() {
        const columns = this.state.dataTableReference?.getColumnsForCreation();
        if (!columns) {
            return;
        }

        this.showCreateRecordDialog(columns, CommonlyGivenFields.concat([
            {fieldName: 'studentNumber', value: Session.getStoredaccountNumber()},
        ]));
    }


    teamNav(): React.ReactNode {
        return (
            <List size="sm" sx={{'--List-item-radius': '8px'}}>
                <ListItem nested sx={{p: 0}}>
                    <Box
                        sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            id="nav-list-browse"
                            textColor="neutral.500"
                            fontWeight={700}
                            sx={{
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '.1rem',
                            }}
                        >
                            Management
                        </Typography>
                    </Box>
                    <List
                        aria-labelledby="nav-list-browse"
                        sx={{
                            '& .JoyListItemButton-root': {p: '8px'},
                        }}
                    >
                        {
                            [
                                {
                                    category: 'student',
                                    entity: 'student',
                                    label: "Student Management",
                                },
                                {
                                    category: 'staff',
                                    entity: 'staff',
                                    label: "Staff Management",
                                },
                                {
                                    category: 'major',
                                    entity: 'major',
                                    label: "Major Management",
                                },
                                {
                                    category: 'plan',
                                    entity: 'plan',
                                    label: "Plan Management",
                                },
                                {
                                    category: 'course',
                                    entity: 'course',
                                    label: "Course Management",
                                },
                                {
                                    category: 'registration',
                                    entity: 'registration',
                                    label: "Registration Management",
                                },
                                {
                                    category: 'grade',
                                    entity: 'grade',
                                    label: "Grade Management",
                                },
                            ].map(item => (
                                <ListItem key={item.category}>
                                    <ListItemButton
                                        variant={this.state.currentCategory === item.category ? 'soft' : 'plain'}
                                        onClick={this.handleSwitchFunction.bind(this, item.category, item.entity)}
                                        selected={this.state.currentCategory === item.category}>
                                        <ListItemDecorator>
                                            <LensRounded fontSize="small"/>
                                        </ListItemDecorator>
                                        <ListItemContent>{item.label}</ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                </ListItem>

                <ListDivider/>

                <ListItem nested sx={{p: 0, mt: 2}}>
                    <Box
                        sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            id="nav-list-browse"
                            textColor="neutral.500"
                            fontWeight={700}
                            sx={{
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '.1rem',
                            }}
                        >
                            Student's Group
                        </Typography>
                    </Box>
                    <List
                        aria-labelledby="nav-list-browse"
                        sx={{
                            '& .JoyListItemButton-root': {p: '8px'},
                        }}
                    >
                        {
                            [
                                {
                                    category: 'stu-view-course',
                                    entity: 'course',
                                    label: "Lookup Courses",
                                },
                                {
                                    category: 'stu-view-grade',
                                    entity: 'grade',
                                    label: "Lookup Grades",
                                },
                                {
                                    category: 'stu-add-reg',
                                    entity: 'registration',
                                    label: "Register for Courses",
                                },
                            ].map(item => (
                                <ListItem key={item.category}>
                                    <ListItemButton
                                        variant={this.state.currentCategory === item.category ? 'soft' : 'plain'}
                                        onClick={this.handleSwitchFunction.bind(this, item.category, item.entity)}
                                        selected={this.state.currentCategory === item.category}>
                                        <ListItemDecorator>
                                            <LensRounded fontSize="small"/>
                                        </ListItemDecorator>
                                        <ListItemContent>{item.label}</ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                </ListItem>

                <ListDivider/>

                <ListItem nested sx={{p: 0, mt: 2}}>
                    <Box
                        sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            id="nav-list-browse"
                            textColor="neutral.500"
                            fontWeight={700}
                            sx={{
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '.1rem',
                            }}
                        >
                            Staff's Group
                        </Typography>
                    </Box>
                    <List
                        aria-labelledby="nav-list-browse"
                        sx={{
                            '& .JoyListItemButton-root': {p: '8px'},
                        }}
                    >
                        {
                            [
                                {
                                    category: 'sta-view-course',
                                    entity: 'course',
                                    label: "Lookup Courses",
                                },
                                {
                                    category: 'sta-view-student',
                                    entity: 'student',
                                    label: "My Students",
                                },
                                {
                                    category: 'sta-view-my-course',
                                    entity: 'course',
                                    label: "My Courses",
                                },
                                {
                                    category: 'sta-view-registration',
                                    entity: 'registration',
                                    label: "View Course Registrations",
                                },
                            ].map(item => (
                                <ListItem key={item.category}>
                                    <ListItemButton
                                        variant={this.state.currentCategory === item.category ? 'soft' : 'plain'}
                                        onClick={this.handleSwitchFunction.bind(this, item.category, item.entity)}
                                        selected={this.state.currentCategory === item.category}>
                                        <ListItemDecorator>
                                            <LensRounded fontSize="small"/>
                                        </ListItemDecorator>
                                        <ListItemContent>{item.label}</ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                </ListItem>

                <ListDivider/>

                <ListItem nested sx={{p: 0, mt: 2}}>
                    <Box
                        sx={{
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            id="nav-list-browse"
                            textColor="neutral.500"
                            fontWeight={700}
                            sx={{
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '.1rem',
                            }}
                        >
                            Other
                        </Typography>
                    </Box>
                    <List
                        aria-labelledby="nav-list-browse"
                        sx={{
                            '& .JoyListItemButton-root': {p: '8px'},
                        }}
                    >
                        {
                            [
                                {
                                    category: 'engi',
                                    entity: 'engi',
                                    label: "ENGI-9874",
                                },
                                {
                                    category: 'about',
                                    entity: 'about',
                                    label: "About Group 9",
                                },
                            ].map(item => (
                                <ListItem key={item.category}>
                                    <ListItemButton
                                        variant={this.state.currentCategory === item.category ? 'soft' : 'plain'}
                                        onClick={() => this.setState({
                                            currentCategory: item.category,
                                            currentEntity: item.entity,
                                        })}
                                        selected={this.state.currentCategory === item.category}>
                                        <ListItemDecorator>
                                            <LensRounded fontSize="small"/>
                                        </ListItemDecorator>
                                        <ListItemContent>{item.label}</ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                            ))
                        }
                    </List>
                </ListItem>
            </List>
        );
    }

    table(): React.ReactNode {
        switch (this.state.currentEntity) {
            case 'student':
                return <GenericTable
                    key="student"
                    entityName={"student"}
                    columns={StudentTable}
                    searchKeyword={this.state.searchKeyword}
                    setReference={this.handleSetDataTableReference.bind(this)}
                    onSelectionModelChanged={this.handleIndexItemsChanged.bind(this)}
                    getRowIdFunction={(row: any) => row.studentNumber}
                />

            case 'major':
                return <GenericTable
                    key="major"
                    entityName={"major"}
                    columns={MajorTable}
                    searchKeyword={this.state.searchKeyword}
                    setReference={this.handleSetDataTableReference.bind(this)}
                    onSelectionModelChanged={this.handleIndexItemsChanged.bind(this)}
                    getRowIdFunction={(row: any) => row.name}
                />

            case 'plan':
                return <GenericTable
                    key="plan"
                    entityName={"plan"}
                    columns={PlanTable}
                    searchKeyword={this.state.searchKeyword}
                    setReference={this.handleSetDataTableReference.bind(this)}
                    onSelectionModelChanged={this.handleIndexItemsChanged.bind(this)}
                    getRowIdFunction={(row: any) => row.name}
                />

            case 'staff':
                return <GenericTable
                    key="staff"
                    entityName={"staff"}
                    columns={StaffTable}
                    searchKeyword={this.state.searchKeyword}
                    setReference={this.handleSetDataTableReference.bind(this)}
                    onSelectionModelChanged={this.handleIndexItemsChanged.bind(this)}
                    getRowIdFunction={(row: any) => row.staffNumber}
                />

            case 'grade':
                return <GenericTable
                    key="grade"
                    entityName={"grade"}
                    columns={GradeTable}
                    searchKeyword={this.state.searchKeyword}
                    setReference={this.handleSetDataTableReference.bind(this)}
                    onSelectionModelChanged={this.handleIndexItemsChanged.bind(this)}
                    getRowIdFunction={(row: any) => row.id}
                />

            case 'registration':
                return <GenericTable
                    key="registration"
                    entityName={"registration"}
                    columns={RegistrationTable}
                    searchKeyword={this.state.searchKeyword}
                    setReference={this.handleSetDataTableReference.bind(this)}
                    onSelectionModelChanged={this.handleIndexItemsChanged.bind(this)}
                    getRowIdFunction={(row: any) => row.id}
                />

            case 'course':
                return <GenericTable
                    key="course"
                    entityName={"course"}
                    columns={CourseTable}
                    searchKeyword={this.state.searchKeyword}
                    setReference={this.handleSetDataTableReference.bind(this)}
                    onSelectionModelChanged={this.handleIndexItemsChanged.bind(this)}
                    getRowIdFunction={(row: any) => row.crn}
                />

            case 'about':
                return <About/>;

            case 'engi':
                return <About/>;

            default:
                return <div>No table</div>;
        }
    }

    render() {
        if (this.state.redirectTo) {
            return <Navigate to={this.state.redirectTo}/>;
        }

        const sidePane = <Layout.SidePane>
            <Box
                sx={{
                    p: 2,
                    pb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    fontSize="xs2"
                    textColor="text.tertiary"
                    textTransform="uppercase"
                    letterSpacing="md"
                    fontWeight="lg"
                >
                    Filter by
                </Typography>
                <Button
                    size="sm"
                    variant="plain"
                    sx={{fontSize: 'xs', px: 1}}
                    onClick={this.handleClearFilters.bind(this)}
                >
                    Clear filters
                </Button>
            </Box>
            <Box sx={{p: 2}}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography level="body2" textColor="text.primary">
                        Input keyword to perform coarse search.
                        Confirm search by pressing Enter.
                    </Typography>
                </Box>
                <Box sx={{mt: 2}}>
                    <TextField
                        placeholder="Search by..."
                        value={this.state.searchKeyword}
                        onChange={this.handleSearchKeywordChange.bind(this)}
                        onKeyDown={this.handleSearchKeywordKeyDown.bind(this)}
                    />
                </Box>
            </Box>
            <ListDivider component="hr"/>
            <Box sx={{p: 2}}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography level="body2" textColor="text.primary">
                        Control Panel
                    </Typography>
                </Box>
                <Box sx={{mt: 2}}>
                    <Box sx={{mt: 3, display: 'inline', gap: 1}}>
                        {
                            // Student add registration
                            (
                                this.state.currentCategory === "stu-add-reg"
                                    ? (
                                        <Button
                                            size="sm"
                                            color="primary"
                                            fullWidth={true}
                                            onClick={this.handleStudentRegisterCourse.bind(this)}
                                        >
                                            Register New Course
                                        </Button>
                                    )
                                    : null
                            )
                        }

                        {
                            // Staff add course
                            (
                                this.state.currentCategory === "sta-view-my-course"
                                    ? (
                                        <Button
                                            size="sm"
                                            color="primary"
                                            fullWidth={true}
                                            onClick={this.handleStaffCreateCourse.bind(this)}
                                        >
                                            Create New Course
                                        </Button>
                                    )
                                    : null
                            )
                        }

                        {
                            // Admin add record
                            (
                                !this.state.currentCategory.includes("stu-")
                                && !this.state.currentCategory.includes("sta-")
                            ) ? (
                                <Button
                                    size="sm"
                                    color="primary"
                                    fullWidth={true}
                                    onClick={this.handleAddNewRecord.bind(this)}
                                >
                                    Add Record
                                </Button>
                            ) : null
                        }

                        {
                            // Admin remove record
                            (
                                (
                                    !this.state.currentCategory.includes("stu-")
                                    && !this.state.currentCategory.includes("sta-")
                                ) || (
                                    this.state.currentCategory === 'stu-add-reg'
                                    || this.state.currentCategory === 'sta-view-my-course'
                                )
                            ) ? (
                                <Button size="sm"
                                        color="danger"
                                        disabled={this.state.indexItems.length === 0}
                                        fullWidth={true}
                                        onClick={this.handleDeleteSelected.bind(this)}
                                        sx={{mt: 1}}
                                >
                                    {
                                        this.state.indexItems.length === 0
                                            ? "Remove Selected"
                                            : `Remove ${this.state.indexItems.length} Item(s)`
                                    }
                                </Button>
                            ) : null
                        }

                    </Box>
                </Box>

                {this.state.shouldShowAlert ? (
                    <MuiCompatCssVarsProvider>
                        <Alert
                            sx={{mt: 1}}
                            severity={this.state.alertSeverity}
                            onClose={this.handleAlertClose.bind(this)}
                        >
                            {this.state.alertText}
                        </Alert>
                    </MuiCompatCssVarsProvider>
                ) : null}
            </Box>

            <ListDivider component="hr"/>
        </Layout.SidePane>;

        return (
            <CssVarsProvider theme={teamTheme}>
                <Layout.Root>
                    <Layout.Header>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <IconButton
                                size="sm"
                                variant="solid"
                                sx={{display: {xs: 'none', sm: 'inline-flex'}}}
                            >
                                <GroupRoundedIcon/>
                            </IconButton>
                            <Typography component="h1" fontWeight="xl">
                                {Session.getStoredName()} - {this.getRoleDescription()} @ CRS
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1.5}}>
                            <Menu
                                id="app-selector"
                                control={
                                    <IconButton
                                        size="sm"
                                        variant="solid"
                                        color="neutral"
                                        aria-label="Apps"
                                    >
                                        <MaterialSettings/>
                                    </IconButton>
                                }
                                menus={[
                                    {
                                        label: 'Dark Mode',
                                        onClick: () => {
                                            this.changeColorScheme('dark')
                                        },
                                    },
                                    {
                                        label: 'Light Mode',
                                        onClick: () => {
                                            this.changeColorScheme('light')
                                        },
                                    },
                                    {
                                        label: 'Follow System',
                                        onClick: () => {
                                            this.changeColorScheme('system')
                                        },
                                    },
                                ]}
                            />
                            <Menu
                                id="app-selector"
                                control={
                                    <IconButton
                                        size="sm"
                                        variant="solid"
                                        color="primary"
                                        aria-label="Apps"
                                    >
                                        <KeyRounded/>
                                    </IconButton>
                                }
                                menus={[
                                    {
                                        label: 'Logout',
                                        onClick: this.handleLogout.bind(this),
                                    },
                                ]}
                            />
                        </Box>
                    </Layout.Header>

                    <Layout.SideNav>
                        {this.teamNav()}
                    </Layout.SideNav>

                    {
                        (this.state.currentCategory !== 'about'
                            && this.state.currentCategory !== 'engi')
                            ? sidePane
                            : null
                    }

                    <Layout.Main>
                        {this.table()}
                    </Layout.Main>

                </Layout.Root>

                {
                    this.state.shouldShowPrompt
                        ? <PromptBox
                            onAction={this.handlePromptAction.bind(this)}
                            caption={this.state.promptCaption}
                            message={this.state.promptText}
                            child={this.state.promptChild}
                            subject={this.state.promptSubject}
                            cancelButtonText={this.state.promptCancelButtonText}
                            okButtonText={this.state.promptOkButtonText}
                            okButtonColor={this.state.promptOkButtonColor}
                            cancelButtonInvisible={this.state.promptCancelButtonInvisible}
                            backgroundClickCancellable={this.state.promptBackgroundClickCancellable}
                            notDismissible={this.state.promptNotDismissible}
                        />
                        : null
                }

            </CssVarsProvider>
        );
    }
}
