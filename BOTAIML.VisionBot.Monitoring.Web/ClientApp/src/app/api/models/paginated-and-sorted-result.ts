/* tslint:disable */
/* eslint-disable */
import { SortMeta } from './sort-meta';
import { SortOrder } from './sort-order';
export interface PaginatedAndSortedResult {
  multiSortMeta?: null | Array<SortMeta>;
  noOfRows?: number;
  searchString?: null | string;
  skipRows?: number;
  sortField?: null | string;
  sortOrder?: SortOrder;
}
