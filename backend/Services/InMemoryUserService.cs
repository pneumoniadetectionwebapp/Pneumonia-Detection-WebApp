using isteodev.Models;
using System.Security.Cryptography;
using System.Text;

namespace isteodev.Services
{
    public class InMemoryUserService
    {
        private static List<User> _users = new();
        private static int _id = 1;

        public User Register(string name, string email, string password)
        {
            if (_users.Any(u => u.Email == email))
                throw new Exception("Bu email zaten kayıtlı.");

            var hash = HashPassword(password);

            var user = new User
            {
                Id = _id++,
                Name = name,
                Email = email,
                PasswordHash = hash
            };

            _users.Add(user);
            return user;
        }

        public User? Login(string email, string password)
        {
            var hash = HashPassword(password);
            return _users.FirstOrDefault(u => u.Email == email && u.PasswordHash == hash);
        }

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
