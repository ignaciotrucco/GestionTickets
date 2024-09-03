using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionTicket.Migrations
{
    /// <inheritdoc />
    public partial class NuevasTablas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TipoTarea",
                table: "Tareas",
                newName: "TipoTareaID");

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Tareas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TipoSistemaID",
                table: "Tareas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "SubTareas",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "SubTareas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "TipoSistemas",
                columns: table => new
                {
                    TipoSistemaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Eliminado = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoSistemas", x => x.TipoSistemaID);
                });

            migrationBuilder.CreateTable(
                name: "TipoTareas",
                columns: table => new
                {
                    TipoTareaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Eliminado = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoTareas", x => x.TipoTareaID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tareas_TipoSistemaID",
                table: "Tareas",
                column: "TipoSistemaID");

            migrationBuilder.CreateIndex(
                name: "IX_Tareas_TipoTareaID",
                table: "Tareas",
                column: "TipoTareaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Tareas_TipoSistemas_TipoSistemaID",
                table: "Tareas",
                column: "TipoSistemaID",
                principalTable: "TipoSistemas",
                principalColumn: "TipoSistemaID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tareas_TipoTareas_TipoTareaID",
                table: "Tareas",
                column: "TipoTareaID",
                principalTable: "TipoTareas",
                principalColumn: "TipoTareaID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tareas_TipoSistemas_TipoSistemaID",
                table: "Tareas");

            migrationBuilder.DropForeignKey(
                name: "FK_Tareas_TipoTareas_TipoTareaID",
                table: "Tareas");

            migrationBuilder.DropTable(
                name: "TipoSistemas");

            migrationBuilder.DropTable(
                name: "TipoTareas");

            migrationBuilder.DropIndex(
                name: "IX_Tareas_TipoSistemaID",
                table: "Tareas");

            migrationBuilder.DropIndex(
                name: "IX_Tareas_TipoTareaID",
                table: "Tareas");

            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Tareas");

            migrationBuilder.DropColumn(
                name: "TipoSistemaID",
                table: "Tareas");

            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "SubTareas");

            migrationBuilder.RenameColumn(
                name: "TipoTareaID",
                table: "Tareas",
                newName: "TipoTarea");

            migrationBuilder.AlterColumn<int>(
                name: "Estado",
                table: "SubTareas",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
