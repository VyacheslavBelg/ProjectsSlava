namespace FBIArchive.Models
{
	public class User
	{
		public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
		public string HashPassword { get; set; } = "";
		public DateTime RegistrationDate { get; set; }
		public string Role { get; set; } = "";
	}

	public class UserRegistrationDto
	{
        public string Email { get; set; } = "";
        public string Name { get; set; } = "";
		public string Password { get; set; } = "";
    }

}