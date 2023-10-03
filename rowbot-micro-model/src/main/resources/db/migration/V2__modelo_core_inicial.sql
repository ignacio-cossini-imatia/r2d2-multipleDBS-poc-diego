CREATE TABLE MaestroFraccion (
    id serial NOT NULL,
    denominador INTEGER NOT NULL,
    activo BOOLEAN,
    CONSTRAINT MaestroFraccion_PK PRIMARY KEY(id) );

CREATE TABLE MaestroMomentoDia (
    id serial NOT NULL,
    idioma VARCHAR(10) NOT NULL,
    activo BOOLEAN,
    descripcion varchar(500),
    CONSTRAINT MaestroMomentoDia_PK PRIMARY KEY(id) );

CREATE TABLE Paciente (
    id serial NOT NULL,
    nombre varchar(100) NOT NULL,
    apellidos varchar(100) NOT NULL,
    activo BOOLEAN,
    CONSTRAINT Paciente_PK PRIMARY KEY(id) );

CREATE TABLE Medicamento (
    id serial NOT NULL,
    nombre varchar(100) NOT NULL,
    activo BOOLEAN,
    CONSTRAINT Medicamento_PK PRIMARY KEY(id) );

CREATE TABLE Info_Medicamento (
	id INTEGER NOT NULL,
	CONSTRAINT Info_Medicamento_PK PRIMARY KEY(id),
	CONSTRAINT Info_Medicamento_FK_Medicamento FOREIGN KEY(id) REFERENCES Medicamento(id));

CREATE TABLE Tratamiento (
    id serial NOT NULL,
    idMedicamento INTEGER NOT NULL,
    idPaciente INTEGER NOT NULL,
    inicioVentas DATE,
    finVentas DATE,
    emblistable BOOLEAN,
    activo BOOLEAN,
    CONSTRAINT Tratamiento_PK PRIMARY KEY(id) ,
    CONSTRAINT Tratamiento_FK_Medicamento FOREIGN KEY(idMedicamento) REFERENCES Medicamento(id) ,
    CONSTRAINT Tratamiento_FK_Paciente FOREIGN KEY(idPaciente) REFERENCES Paciente(id) );

CREATE TABLE Posologia (
    id serial NOT NULL,
    idTratamiento INTEGER NOT NULL, --Posología 0..N - 1 Tratamiento
    inicio DATE,
    fin DATE,
    siPrecisa BOOLEAN,
    activo BOOLEAN,
    CONSTRAINT Posologia_PK PRIMARY KEY(id),
    CONSTRAINT Posologia_FK_Tratamiento FOREIGN KEY(idTratamiento) REFERENCES Tratamiento(id) );

--Cómo montarlo con anotaciones Hibernate: https://www.geeksforgeeks.org/hibernate-table-per-subclass-using-annotation/?ref=rp
CREATE TABLE Toma (
    id serial NOT NULL,
    idPosologia INTEGER NOT NULL,    --Toma 0..N - 1 Posologia
    cantidad INTEGER NOT NULL,
    idFraccion INTEGER NOT NULL,
    CONSTRAINT Toma_PK PRIMARY KEY(id) ,
    CONSTRAINT Toma_FK_Posologia FOREIGN KEY(idPosologia) REFERENCES Posologia(id),
    CONSTRAINT Toma_FK_Fraccion FOREIGN KEY(idFraccion) REFERENCES MaestroFraccion(id));

CREATE TABLE Toma_Semanal (
    id INTEGER NOT NULL,
    diaSemana INTEGER NOT NULL,
    idMomentoDia INTEGER NOT NULL,
    CONSTRAINT Toma_Semanal_PK PRIMARY KEY(id) ,
    CONSTRAINT Toma_Semanal_FK_Toma FOREIGN KEY(id) REFERENCES Toma(id) ,
    CONSTRAINT Toma_FK_MomentoDia FOREIGN KEY(idMomentoDia) REFERENCES MaestroMomentoDia(id) );

CREATE TABLE Toma_Semanal_Plus (
    id INTEGER NOT NULL,
    diaSemana INTEGER NOT NULL,
    hora INTEGER NOT NULL,
    minuto INTEGER NOT NULL,
    CONSTRAINT Toma_Semanal_Plus_PK PRIMARY KEY(id) ,
    CONSTRAINT Toma_Semanal_Plus_FK_Toma FOREIGN KEY(id) REFERENCES Toma(id) );

CREATE TABLE Toma_Especifica (
    id INTEGER NOT NULL,
    fechaInicio DATE,
    fechaFin DATE,
    hora INTEGER NOT NULL,
    minuto INTEGER NOT NULL,
    duracion INTEGER NOT NULL,
    descanso INTEGER NOT NULL,
    repeticiones INTEGER NOT NULL,
    CONSTRAINT Toma_Especifica_PK PRIMARY KEY(id) ,
    CONSTRAINT Toma_Especifica_FK_Toma FOREIGN KEY(id) REFERENCES Toma(id)) ;

CREATE TABLE Toma_mensual (
    id INTEGER NOT NULL,
    fechaInicio DATE,
    fechaFin DATE,
    finalMes BOOLEAN,
    descanso INTEGER NOT NULL,
    duracion INTEGER NOT NULL,
    hora INTEGER NOT NULL,
    minuto INTEGER NOT NULL,
    repeticiones INTEGER NOT NULL,
    CONSTRAINT Toma_mensual_PK PRIMARY KEY(id) ,
    CONSTRAINT Toma_mensual_FK_Toma FOREIGN KEY(id) REFERENCES Toma(id) );