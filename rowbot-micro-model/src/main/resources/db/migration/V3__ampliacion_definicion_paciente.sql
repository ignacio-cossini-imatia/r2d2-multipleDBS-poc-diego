-- JIRA: IP-48 --
CREATE TABLE Direccion (
    id serial NOT NULL,
    calle varchar(200),
    portal varchar(100),
    piso varchar(100),
    codigoPostal varchar(20),
    ciudad varchar(100),
    activo BOOLEAN,
    CONSTRAINT Direccion_PK PRIMARY KEY(id) );

DELETE FROM Paciente;

ALTER TABLE Paciente
ADD COLUMN dni varchar(20) NOT NULL,
ADD COLUMN sexo varchar(20),
ADD COLUMN email varchar(200),
ADD COLUMN telefono varchar(20),
ADD COLUMN idDireccion INTEGER,
ADD COLUMN fechaNacimiento DATE,
ADD COLUMN notas varchar(2000),
ADD CONSTRAINT Paciente_FK_Direccion FOREIGN KEY (idDireccion) REFERENCES direccion(id),
ADD CONSTRAINT Paciente_UNIQUE_dni UNIQUE (dni);

