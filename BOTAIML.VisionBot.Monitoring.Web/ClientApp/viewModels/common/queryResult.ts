export class QueryResult<T> {
  totalItems: number;
  firstRowOffset: number;
  pageSize: number;
  items: T[];
}
