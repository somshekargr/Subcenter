using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace BOTAIML.VisionBot.Monitoring.Web.Utils
{
    public static class HashingUtils
    {
        private static HashAlgorithm HashAlgorithm = CryptoProviderFactory.Default.CreateHashAlgorithm(HashAlgorithmName.SHA512);

        public static string Hash<TSalt>(string data, TSalt salt)
        {
            var dataToHash = GetDataToHash(data, salt);

            var buffer = Encoding.ASCII.GetBytes(dataToHash);

            var hashBuffer = HashAlgorithm.ComputeHash(buffer);

            var hashBase64 = Convert.ToBase64String(hashBuffer);

            return hashBase64;
        }

        public static bool IsStringEqualToHash<TSalt>(string hash, TSalt salt, string dataToCompare)
        {
            var hashed = Hash(dataToCompare, salt);

            return hashed == hash;
        }

        private static string GetDataToHash<TSalt>(string data, TSalt salt)
        {
            return $"{salt}-{data}-{salt}";
        }
    }
}
