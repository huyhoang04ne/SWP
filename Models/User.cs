using System;

namespace SWP391.Models
{
    public class User
    {
        public required string Id { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string FullName { get; set; }
        public required string Gender { get; set; }
        public required string Phone { get; set; }
        public required string Address { get; set; }
        public required string RoleId { get; set; }
        public required string? MedicalHistory { get; set; }
        public required string PrivacySettings { get; set; }

        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        public bool TwoFactorEnabled { get; set; }

        public bool IsActive { get; set; }
        public bool IsVerified { get; set; } = true;
    }

}
