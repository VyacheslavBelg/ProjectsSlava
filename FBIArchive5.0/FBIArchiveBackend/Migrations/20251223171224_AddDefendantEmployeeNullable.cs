using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FBIArchive.Migrations
{
    /// <inheritdoc />
    public partial class AddDefendantEmployeeNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DefendantId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmployeeId",
                table: "Cases",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Defendants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Surname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Alias = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeathDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Defendants", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Badge = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Surname = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeathDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Post = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cases_DefendantId",
                table: "Cases",
                column: "DefendantId");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_EmployeeId",
                table: "Cases",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cases_Defendants_DefendantId",
                table: "Cases",
                column: "DefendantId",
                principalTable: "Defendants",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Cases_Employees_EmployeeId",
                table: "Cases",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cases_Defendants_DefendantId",
                table: "Cases");

            migrationBuilder.DropForeignKey(
                name: "FK_Cases_Employees_EmployeeId",
                table: "Cases");

            migrationBuilder.DropTable(
                name: "Defendants");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Cases_DefendantId",
                table: "Cases");

            migrationBuilder.DropIndex(
                name: "IX_Cases_EmployeeId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "DefendantId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "Cases");
        }
    }
}
