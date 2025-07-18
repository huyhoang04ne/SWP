﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Models
{
    public class WorkingSchedule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CounselorId { get; set; }

        [ForeignKey("CounselorId")]
        public AppUser Counselor { get; set; }

        [Required]
        public DateTime WorkDate { get; set; }

        [Required]
        public TimeSlot TimeSlot { get; set; }

        // Giờ bắt đầu và kết thúc của ca làm việc
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public bool IsAvailable { get; set; } = true;

        public string? Notes { get; set; }

        public string? AssignedBy { get; set; } // Id của Manager (nếu có)
        public bool IsAutoAssigned { get; set; } = false; // true: counselor tự đăng ký, false: manager gán

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
