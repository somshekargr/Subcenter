import { LazyLoadEvent } from 'primeng/api';
import { SortOrder } from '../api/models';

export class AppUtils {
  public static getNavigationPropertyData(data: any, column: string): string {
    return [data].concat(column.split(".")).reduce(function (a, b) {
      return a[b];
    });
  }

  public static convertToLazyLoadArgs(event: LazyLoadEvent) {
    const retVal = {
      skipRows: event.first,
      noOfRows: event.rows,
      sortField: event.sortField,
      sortOrder: event.sortOrder === 1 ? SortOrder.Asc : SortOrder.Desc,
      searchString: event.globalFilter,
      multiSortMeta: null
    };

    if (event.multiSortMeta && event.multiSortMeta.length > 0) {
      event.multiSortMeta = [];

      for (const meta of event.multiSortMeta) {
        retVal.multiSortMeta.push({
          field: meta.field,
          order: meta.order === 1 ? SortOrder.Asc : SortOrder.Desc
        });
      }
    }

    return retVal;
  }

  public static dateDiff(
    dateStart: Date,
    dateEnd: Date | string = new Date,
    ...units: string[]
  ): {
    [key: string]: number
  } {
    if (typeof dateEnd === 'string')
      dateEnd = new Date();

    let delta: number = Math.abs(dateStart.getTime() - dateEnd.getTime());

    const dateDiffDef = {
      millenniums: 31536000000000,
      centuries: 3153600000000,
      decades: 315360000000,
      years: 31536000000,
      quarters: 7776000000,
      months: 2592000000,
      weeks: 604800000,
      days: 86400000,
      hours: 3600000,
      minutes: 60000,
      seconds: 1000,
      milliseconds: 1
    };

    return (units.length ? units : Object.keys(dateDiffDef))
      .reduce((res: object, key: string) => {
        if (!dateDiffDef.hasOwnProperty(key))
          throw new Error('Unknown unit in dateDiff: ' + key);
        res[key] = Math.floor(delta / dateDiffDef[key]);
        delta -= res[key] * dateDiffDef[key];
        return res;
      }, {});
  }


}
