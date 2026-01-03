using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FBIArchive.Migrations
{
    /// <inheritdoc />
    public partial class AddOrganizationAndDepartment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InvestigationDepartmentId",
                table: "Employees",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "Defendants",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InvestigationDepartments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DepartmentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EstablishedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestigationDepartments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Organizations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrganizationType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EstablishedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DisbandedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organizations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_InvestigationDepartmentId",
                table: "Employees",
                column: "InvestigationDepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Defendants_OrganizationId",
                table: "Defendants",
                column: "OrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Defendants_Organizations_OrganizationId",
                table: "Defendants",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_InvestigationDepartments_InvestigationDepartmentId",
                table: "Employees",
                column: "InvestigationDepartmentId",
                principalTable: "InvestigationDepartments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Defendants_Organizations_OrganizationId",
                table: "Defendants");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_InvestigationDepartments_InvestigationDepartmentId",
                table: "Employees");

            migrationBuilder.DropTable(
                name: "InvestigationDepartments");

            migrationBuilder.DropTable(
                name: "Organizations");

            migrationBuilder.DropIndex(
                name: "IX_Employees_InvestigationDepartmentId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Defendants_OrganizationId",
                table: "Defendants");

            migrationBuilder.DropColumn(
                name: "InvestigationDepartmentId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Defendants");
        }
    }
}
