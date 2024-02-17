export class QueryParams {
  firstRowOffset: number;
  pageSize: number;
  sortField: string;
  sortOrder: number;
}

export function toParams(queryParams: QueryParams): {
  [param: string]: string | string[];
} {
  return {
    firstRowOffset: queryParams.firstRowOffset.toString(),
    pageSize: queryParams.pageSize.toString(),
    sortField: queryParams.sortField,
    sortOrder: queryParams.sortOrder.toString()
  };
}