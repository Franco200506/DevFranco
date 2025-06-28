/*
CREATE SCHEMA Beca;
GO
*/


/*
CREATE TABLE Beca.Estudiante (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100) NOT NULL,
    Edad INT NOT NULL,
    Correo NVARCHAR(150) NOT NULL,
    Fecha_Registro DATETIME DEFAULT GETDATE(),
    Fecha_Modificacion DATETIME

);
*/


execute Beca.sp_Save_Estudiante 
	@Id = 1,
    @Nombre='Mario',
    @Apellido='Bross',
    @Edad =20,
    @Correo ='bross@email.com'

select * from Beca.Estudiante 



