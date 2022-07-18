type PagedEntityList<T> = {
    content: Array<T>,
    pageable: {
        sort: {
            empty: boolean,
            sorted: boolean,
            unsorted: boolean
        },
        offset: number,
        pageNumber: number,
        pageSize: number,
        paged: boolean,
        unpaged: boolean
    },
    last: boolean,
    totalPages: number,
    totalElements: number,
    first: boolean,
    size: number,
    number: number,
    sort: {
        empty: boolean,
        sorted: boolean,
        unsorted: boolean
    },
    numberOfElements: number,
    empty: boolean
}

type SessionInfo = {
    success: boolean,
    sessionId: string
}

export type { 
    PagedEntityList,
    SessionInfo
}

