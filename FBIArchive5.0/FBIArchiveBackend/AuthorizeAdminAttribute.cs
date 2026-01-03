using Microsoft.AspNetCore.Authorization;

namespace FBIArchive.Attributes
{
    public class AuthorizeAdminAttribute : AuthorizeAttribute
    {
        public AuthorizeAdminAttribute()
        {
            Roles = "Admin";
        }
    }
}