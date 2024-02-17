using System.Collections.Concurrent;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

namespace BOTAIML.VisionBot.Monitoring.Web.Utils
{
    public static class StringExtensions
    {
        private static ConcurrentDictionary<string, string> cache = new ConcurrentDictionary<string, string>();

        public static string ToPascalCase(this string s)
        {
            if (cache.TryGetValue(s, out var retVal))
                return retVal;

            var result = new StringBuilder();
            var nonWordChars = new Regex(@"[^a-zA-Z0-9]+");
            var tokens = nonWordChars.Split(s);
            foreach (var token in tokens)
            {
                result.Append(PascalCaseSingleWord(token));
            }

            retVal = result.ToString();

            cache.TryAdd(s, retVal);

            return retVal;
        }

        private static string PascalCaseSingleWord(string s)
        {
            var match = Regex.Match(s, @"^(?<word>\d+|^[a-z]+|[A-Z]+|[A-Z][a-z]+|\d[a-z]+)+$");
            var groups = match.Groups["word"];

            var textInfo = Thread.CurrentThread.CurrentCulture.TextInfo;
            var result = new StringBuilder();
            foreach (var capture in groups.Captures.Cast<Capture>())
            {
                result.Append(textInfo.ToTitleCase(capture.Value.ToLowerInvariant()));
            }
            return result.ToString();
        }

        public static char ToYesNo(this bool @this) => @this ? 'Y' : 'N';

        public static bool IsAadharNumber(this string s)
        {
            var pattern = @"^[\d]{12}$";

            return Regex.IsMatch(s, pattern);
        }
    }
}
