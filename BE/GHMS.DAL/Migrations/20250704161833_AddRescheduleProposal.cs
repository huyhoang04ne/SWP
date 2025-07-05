using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GHMS.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddRescheduleProposal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProposedSlot",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TimeSlot = table.Column<int>(type: "int", nullable: false),
                    RescheduleProposalId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProposedSlot", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RescheduleProposals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OldBookingId = table.Column<int>(type: "int", nullable: false),
                    CounselorId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PatientAccepted = table.Column<bool>(type: "bit", nullable: true),
                    SelectedSlotId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RescheduleProposals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RescheduleProposals_ProposedSlot_SelectedSlotId",
                        column: x => x.SelectedSlotId,
                        principalTable: "ProposedSlot",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProposedSlot_RescheduleProposalId",
                table: "ProposedSlot",
                column: "RescheduleProposalId");

            migrationBuilder.CreateIndex(
                name: "IX_RescheduleProposals_SelectedSlotId",
                table: "RescheduleProposals",
                column: "SelectedSlotId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProposedSlot_RescheduleProposals_RescheduleProposalId",
                table: "ProposedSlot",
                column: "RescheduleProposalId",
                principalTable: "RescheduleProposals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProposedSlot_RescheduleProposals_RescheduleProposalId",
                table: "ProposedSlot");

            migrationBuilder.DropTable(
                name: "RescheduleProposals");

            migrationBuilder.DropTable(
                name: "ProposedSlot");
        }
    }
}
