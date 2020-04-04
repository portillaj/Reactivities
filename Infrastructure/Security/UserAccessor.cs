using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        public IHttpContextAccessor _httpContextAccessor { get; }
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentUsername()
        {
            var username = _httpContextAccessor.HttpContext.User?.Claims?.FirstOrDefault(
                x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            
            return username;
        }
    }
}