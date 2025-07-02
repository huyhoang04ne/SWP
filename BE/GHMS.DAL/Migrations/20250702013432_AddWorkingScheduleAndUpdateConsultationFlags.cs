using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GHMS.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkingScheduleAndUpdateConsultationFlags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConsultationSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CounselorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ScheduledDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TimeSlot = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    IsCanceled = table.Column<bool>(type: "bit", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsultationSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsultationSchedules_AspNetUsers_CounselorId",
                        column: x => x.CounselorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ConsultationSchedules_AspNetUsers_PatientId",
                        column: x => x.PatientId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WorkingSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CounselorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    WorkDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TimeSlot = table.Column<int>(type: "int", nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkingSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkingSchedules_AspNetUsers_CounselorId",
                        column: x => x.CounselorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationSchedules_CounselorId",
                table: "ConsultationSchedules",
                column: "CounselorId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsultationSchedules_PatientId",
                table: "ConsultationSchedules",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkingSchedules_CounselorId",
                table: "WorkingSchedules",
                column: "CounselorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConsultationSchedules");

            migrationBuilder.DropTable(
                name: "WorkingSchedules");
        }
    }
}
