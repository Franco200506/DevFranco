
alter PROCEDURE Beca.sp_Save_Estudiante
    @Id INT = 0,
    @Nombre NVARCHAR(100),
    @Apellido NVARCHAR(100),
    @Edad INT,
    @Correo NVARCHAR(150)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF @Id = 0
        BEGIN
            INSERT INTO Beca.Estudiante (Nombre, Apellido, Edad, Correo, Fecha_Registro, Estado)
            VALUES (RTRIM(LTRIM(@Nombre)), RTRIM(LTRIM(@Apellido)), @Edad, RTRIM(LTRIM(@Correo)), GETDATE(), 1);

            SELECT SCOPE_IDENTITY() AS NewId;
        END
        ELSE
        BEGIN
            UPDATE Beca.Estudiante
            SET
                Nombre = RTRIM(LTRIM(@Nombre)),
                Apellido = RTRIM(LTRIM(@Apellido)),
                Edad = @Edad,
                Correo = RTRIM(LTRIM(@Correo)),
                Fecha_Modificacion = GETDATE()
            WHERE Id = @Id;

            SELECT @Id AS  NewId;
        END
    END TRY
    BEGIN CATCH
        SELECT 
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_LINE() AS ErrorLine,
            ERROR_NUMBER() AS ErrorNumber;
    END CATCH
END
