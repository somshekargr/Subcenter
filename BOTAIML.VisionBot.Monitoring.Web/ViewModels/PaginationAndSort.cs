using BOTAIML.VisionBot.Monitoring.Web.Utils;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class PaginatedAndSortedResult
    {

        public int SkipRows { get; set; }

        public int NoOfRows { get; set; }

        public string SortField { get; set; }

        public SortOrder SortOrder { get; set; }

        public IEnumerable<SortMeta> MultiSortMeta { get; set; }

        //public Filters Filters { get; set; }

        public string SearchString { get; set; }
    }

    public class SortMeta
    {
        public string FieldName { get; set; }

        public SortOrder SortOrder { get; set; }
    }

    public enum SortOrder : int
    {
        ASC = 1,
        DESC = -1
    }
    public static class PaginationAndSortExtensions
    {
        public static async Task<PaginatedAndSortedResult<TModel>> Apply<TModel>(this PaginatedAndSortedResult _params, IQueryable<TModel> data,
            Expression<Func<TModel, bool>> globalFilter = null,
            Expression<Func<TModel, object>> keySelector = null) where TModel : new()
        {
            if (_params == null || data == null)
                return null;

            var retVal = data;

            if (!string.IsNullOrWhiteSpace(_params.SearchString) && globalFilter != null)
            {
                retVal = retVal.Where(globalFilter);
            }

            // We take the totalRows count AFTER applying search filters, but BEFORE applying pagination
            var totalRows = await retVal.CountAsync();

            if (!string.IsNullOrWhiteSpace(_params.SortField))
                retVal = retVal.ApplySort(_params.SortField, _params.SortOrder, keySelector);

            if (_params.MultiSortMeta != null && _params.MultiSortMeta.Any())
            {
                foreach (var sortMeta in _params.MultiSortMeta)
                {
                    retVal = retVal.ApplySort(sortMeta.FieldName, sortMeta.SortOrder, keySelector);
                }
            }

            if (_params.SkipRows > 0)
                retVal = retVal.Skip(_params.SkipRows);

            retVal = retVal.Take(_params.NoOfRows);

            var rows = await retVal.ToArrayAsync();

            return new PaginatedAndSortedResult<TModel>(rows, totalRows);
        }

        private static IOrderedQueryable<TModel> ApplySort<TModel>(this IQueryable<TModel> queryable, string propertyName, SortOrder sortOrder, Expression<Func<TModel, object>> keySelector = null)
        {
            if (sortOrder == SortOrder.ASC)
                return keySelector != null ? queryable.OrderBy(keySelector) : queryable.OrderBy(e => EF.Property<object>(e, propertyName.ToPascalCase()));

            return keySelector != null ? queryable.OrderByDescending(keySelector) : queryable.OrderByDescending(e => EF.Property<object>(e, propertyName.ToPascalCase()));
        }
    }

    public class PaginatedAndSortedResult<TModel> where TModel : new()
    {
        public PaginatedAndSortedResult(TModel[] rows, int totalRows)
        {
            Rows = rows;
            TotalRows = totalRows;
        }

        public TModel[] Rows { get; set; }

        public int TotalRows { get; set; }
    }
}
