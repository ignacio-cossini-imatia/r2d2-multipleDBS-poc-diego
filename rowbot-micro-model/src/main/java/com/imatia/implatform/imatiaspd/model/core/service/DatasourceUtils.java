package com.imatia.implatform.imatiaspd.model.core.service;

import com.mysql.cj.jdbc.MysqlDataSource;
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
		switch (databaseType) {
			case "MySQL":
				return buildMySQLDatasource(dbName);
			case "H2":  default:
				return buildH2Datasource(dbName);

		}
	}

	private static DataSource buildH2Datasource(String dbName){
			return new EmbeddedDatabaseBuilder()
					.setType(EmbeddedDatabaseType.H2)
					.setName(dbName)
					.addScript("schema.sql")
					.build();
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
