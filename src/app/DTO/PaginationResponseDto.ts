export interface PaginationResponseDto<T>{
    records:T[],
    pageSize:number,
    currentPage:number,
    totalRecords:number,
    totalPages:number,
    isLastPage:boolean,
    sortDirection:string,
    sortBy:string | null,
}