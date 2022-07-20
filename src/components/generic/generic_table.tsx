import React from "react";
import Network from "../../util/network";
import {PagedEntityList} from "../../protocol/response_types";
import {DataGrid} from "@mui/x-data-grid";
import {MuiCompatCssVarsProvider} from "../../joyui_ext/mui_compat";
import {GridEnrichedColDef} from "@mui/x-data-grid/models/colDef/gridColDef";
import {GridSelectionModel} from "@mui/x-data-grid/models/gridSelectionModel";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";


// 卧槽这都可以啊，帅啊
type ColumnType = GridEnrichedColDef & {
    postProcessor?: (value: any) => Promise<any>;
}

type GenericTableProps<T> = {
    entityName: string;
    columns: ColumnType[];
    onSelectionModelChanged?: (selectionModel: GridSelectionModel, details: GridCallbackDetails) => void;
    searchKeyword: string | null;
    setReference: (reference: any) => void | null;
    getRowIdFunction?: (row: T) => string;
}

type GenericTableState<T> = {
    currentPageIndex: number;
    data: T[];
    isLoading: boolean;
    totalCount: number;
}

const PAGE_SIZE: number = 20;

export type { ColumnType };

export default class GenericTable<T> extends React.Component<GenericTableProps<T>, GenericTableState<T>> {
    constructor(props: GenericTableProps<T>) {
        super(props);
        this.state = {
            currentPageIndex: 0,
            data: [],
            isLoading: true,
            totalCount: 0,
        };
        if (this.props.setReference) {
            this.props.setReference(this);
        }
    }

    public componentDidMount() {
        this.loadPage(this.state.currentPageIndex);
    }

    public getColumnsForCreation(): ColumnType[] {
        const ret: ColumnType[] = this.props.columns.filter(
            c => c.field !== 'id'
                && c.field !== 'createdAt'
                && c.field !== 'updatedAt'
        );

        // TODO:
        if (this.props.entityName === 'student'
            || this.props.entityName === 'staff') {
            ret.push({
                field: 'passwordMd5',
                headerName: 'Password',
            })
        }
        return ret;
    }

    async loadPage(pageIndex: number) {
        this.setState({isLoading: true});
        const entityList: PagedEntityList<T> = await Network.getPagedData(
            this.props.entityName,
            pageIndex,
            this.props.searchKeyword || "",
        );

        for (const entity of entityList.content) {
            for (const column of this.props.columns) {
                if (column.postProcessor) {
                    try {
                        // @ts-ignore
                        entity[column.field] = await column.postProcessor(entity[column.field]);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
        }

        this.setState({
            totalCount: entityList.totalElements,
            data: entityList.content,
            currentPageIndex: pageIndex,
            isLoading: false
        });
    }

    async handlePageChange(newPageIndex: number) {
        this.setState({currentPageIndex: newPageIndex});
        await this.loadPage(newPageIndex);
    }

    render(): React.ReactNode {
        const {entityName, ...props} = this.props;
        return (
            <MuiCompatCssVarsProvider>
                <DataGrid
                    columns={props.columns}
                    rows={this.state.data}
                    rowCount={this.state.totalCount}
                    pagination
                    paginationMode={'server'}
                    rowsPerPageOptions={[PAGE_SIZE]}
                    pageSize={PAGE_SIZE}
                    page={this.state.currentPageIndex}
                    onPageChange={this.handlePageChange.bind(this)}
                    loading={this.state.isLoading}
                    onSelectionModelChange={this.props.onSelectionModelChanged}
                    getRowId={this.props.getRowIdFunction}
                    checkboxSelection
                />
            </MuiCompatCssVarsProvider>
        );
    }
}
