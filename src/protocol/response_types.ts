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

type LoginResponse = {
    success: boolean,
    reason: string,
    sessionId: string,
    isAdmin: boolean,
    name: string
}

export type { 
    PagedEntityList,
    LoginResponse
}

