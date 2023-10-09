package com.imatia.implatform.imatiaspd.model.core.service;

import com.mysql.cj.jdbc.MysqlDataSource;
import org.postgresql.ds.PGSimpleDataSource;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import javax.sql.DataSource;
import java.sql.SQLException;

public abstract class DatasourceUtils {
	public static DataSource buildDS(String dbName) throws SQLException {
		return buildDS(dbName, null);
	}

	public static DataSource buildDS(String dbName, String databaseType) throws SQLException{
		if (databaseType==null){
			return buildH2Datasource(dbName);
		}
		switch (databaseType) {//TODO: esto tiene que ser un enumerado
			case "MySQL":
				return buildMySQLDatasource(dbName);
			case "Postgres":
				return buildPostgresDatasource(dbName);
			case "H2": default://TODO: probablemente lo mejor sea que default=> exception
				return buildH2Datasource(dbName);

		}
	}
	//TODO: esto deberá aceptar un objeto que contenga toda la info necesaria para la conexión con una bbdd de su tipo
	//mismo comentario para todos los métodos similares
	//Podría ser una buena opción crear una suerte de DatasourceBuilder abstracto, cuyas implementaciones serían de tipos de bbdd
	//concretos ie: MySQLDatasourceBuilder y tendrían la lógica concreta para cada tipo(o tipo+versión en algunos casos)
	private static DataSource buildH2Datasource(String dbName){
			return new EmbeddedDatabaseBuilder()
					.setType(EmbeddedDatabaseType.H2)
					.setName(dbName)
					.addScript("schema.sql")
					.build();
	}

	private static DataSource buildPostgresDatasource(String dbName){
		PGSimpleDataSource datasource = new PGSimpleDataSource();
		datasource.setServerName("localhost");
		datasource.setPortNumber(5432);
		datasource.setUser("postgres");
		datasource.setPassword("postgres_pass");
		datasource.setDatabaseName(dbName);
		return datasource;
	}
	private static DataSource buildMySQLDatasource(String dbName) throws SQLException {
		MysqlDataSource dataSource = new MysqlDataSource();
		dataSource.setDatabaseName(dbName);
		dataSource.setServerName("localhost");
		dataSource.setPort(3306);
		dataSource.setUser("root");
		dataSource.setPassword("mysql_pass");
		dataSource.setServerTimezone("UTC");

		return dataSource;
	}

}
