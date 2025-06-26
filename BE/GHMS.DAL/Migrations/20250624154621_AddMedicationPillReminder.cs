using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GHMS.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddMedicationPillReminder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicationReminders_AspNetUsers_UserId",
                table: "MedicationReminders");

            migrationBuilder.DropIndex(
                name: "IX_MedicationReminders_UserId",
                table: "MedicationReminders");

            migrationBuilder.DropColumn(
                name: "MedicationName",
                table: "MedicationReminders");

            migrationBuilder.DropColumn(
                name: "PillCount",
                table: "MedicationReminders");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "MedicationReminders");

            migrationBuilder.AddColumn<string>(
                name: "ScheduleId",
                table: "MedicationReminders",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "MedicationSchedules",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PillType = table.Column<int>(type: "int", nullable: false),
                    ReminderHour = table.Column<int>(type: "int", nullable: false),
                    ReminderMinute = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AppUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationSchedules_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MedicationSchedules_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicationReminders_ScheduleId",
                table: "MedicationReminders",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationSchedules_AppUserId",
                table: "MedicationSchedules",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationSchedules_UserId",
                table: "MedicationSchedules",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicationReminders_MedicationSchedules_ScheduleId",
                table: "MedicationReminders",
                column: "ScheduleId",
                principalTable: "MedicationSchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicationReminders_MedicationSchedules_ScheduleId",
                table: "MedicationReminders");

            migrationBuilder.DropTable(
                name: "MedicationSchedules");

            migrationBuilder.DropIndex(
                name: "IX_MedicationReminders_ScheduleId",
                table: "MedicationReminders");

            migrationBuilder.DropColumn(
                name: "ScheduleId",
                table: "MedicationReminders");

            migrationBuilder.AddColumn<string>(
                name: "MedicationName",
                table: "MedicationReminders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PillCount",
                table: "MedicationReminders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "MedicationReminders",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicationReminders_UserId",
                table: "MedicationReminders",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicationReminders_AspNetUsers_UserId",
                table: "MedicationReminders",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
