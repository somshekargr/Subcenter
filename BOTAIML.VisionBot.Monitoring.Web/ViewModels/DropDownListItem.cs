using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.ViewModels
{
    public class DropDownListItem
    {
        public string Label { get; set; }

        public string Value { get; set; }

        private static DropDownListItem EmptyItem = new DropDownListItem { Value = string.Empty, Label = "-- select --" };

        public static IEnumerable<DropDownListItem> ForEnum<TEnum>(bool generateEmptyItem = true)
        {
            var retVal = new List<DropDownListItem>();

            if (generateEmptyItem)
                retVal.Add(EmptyItem);

            var items = Enum.GetValues(typeof(TEnum))
                            .Cast<TEnum>()
                            .Select(t => new DropDownListItem { Value = t.ToString(), Label = t.ToString() });

            retVal.AddRange(items);

            return retVal;
        }

        public static IEnumerable<DropDownListItem> ForModel<TModel>(
           IEnumerable<TModel> items,
           Func<TModel, DropDownListItem> selectorFn,
           bool generateEmptyItem = true) where TModel : new()
        {
            var retVal = new List<DropDownListItem>();

            if (generateEmptyItem)
                retVal.Add(EmptyItem);

            var ddlItems = items.Select(t => selectorFn(t));

            retVal.AddRange(ddlItems);

            return retVal;
        }

    }
}
