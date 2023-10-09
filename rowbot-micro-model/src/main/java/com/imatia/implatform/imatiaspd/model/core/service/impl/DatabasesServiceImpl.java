package com.imatia.implatform.imatiaspd.model.core.service.impl;

import com.imatia.implatform.imatiaspd.model.core.config.ExternalDbsConfiguration;
import com.imatia.implatform.imatiaspd.model.core.service.DatabasesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class DatabasesServiceImpl implements DatabasesService {
	@Autowired
	ExternalDbsConfiguration externalDbsConfiguration;

	@Override
	public Map<Object, Object> getAllDBs() {
		return externalDbsConfiguration.getDataSources();
	}

	@Override
	public void addDB(String name) throws SQLException {
		externalDbsConfiguration.addDB(name);
	}
	@Override
	public void addDB(String name, String type) throws SQLException {
		externalDbsConfiguration.addDB(name, type);
	}

	@Override
	public DataSource getDB(String name) {
		return (DataSource) externalDbsConfiguration.getDataSources().get(name);
	}

	@Override
	public void removeDB(String name) {
		//TODO (debería desreferenciar, no cargarse la bbdd)

	}

	@Override
	public void removeAll() {
		//TODO (debería desreferenciar, no cargarse las bbdds)

	}
	private List<String> getTableTypes(String dbName) throws SQLException{
		List<String> tableTypeNames = new ArrayList<>();
		try(ResultSet tableTypeResultSet = getDB(dbName).getConnection()
				.getMetaData()
				.getTableTypes()) {
			while (tableTypeResultSet.next()) {
				tableTypeNames.add(tableTypeResultSet.getString("TABLE_TYPE"));
			}
		}
		return tableTypeNames;
	}
	private List<String> getTableNames(String dbName) throws SQLException{
		List<String> tableNames = new ArrayList<>();
		String[] types = {"TABLE"};
		try(ResultSet tablasResultSet = getDB(dbName).getConnection()
				.getMetaData()
				.getTables(null, null, "%", types)) {
			while (tablasResultSet.next()) {
				//Este "TABLE_NAME" sale de: https://docs.oracle.com/javase%2F7%2Fdocs%2Fapi%2F%2F/java/sql/DatabaseMetaData.html#getTables(java.lang.String,%20java.lang.String,%20java.lang.String,%20java.lang.String[])
				tableNames.add(tablasResultSet.getString("TABLE_NAME"));
			}
		}
		return tableNames;
	}

	private List<String> getColumns(String dbName, String tableName) throws SQLException{
		List<String> columnNames = new ArrayList<>();
		try(ResultSet tablasResultSet = getDB(dbName).getConnection()
				.getMetaData()
				.getColumns(null, null, tableName, null)) {
			while (tablasResultSet.next()) {
				//Este 3 sale de: https://docs.oracle.com/javase%2F7%2Fdocs%2Fapi%2F%2F/java/sql/DatabaseMetaData.html#getTables(java.lang.String,%20java.lang.String,%20java.lang.String,%20java.lang.String[])
				columnNames.add(tablasResultSet.getString("COLUMN_NAME"));
			}
		}
		return columnNames;
	}

	private List<Map<String, ?>> getRows(String dbName, String tableName, int limit) throws SQLException {
		//TODO usar el limit. Estudiar si el limit se puede setear de forma estandar
		//o alternativamente, estudiar si es buena idea (o no) incorporar el limit a la condición de continuación del while
		//quizás ciertos motores de bbdds traten de devolver todo aunque la conexión se haya cerrado => problemas
		//Probablemente lo mejor sea un mecanismo de paginación, que ya de por si valdría para el limit y más ¿¿offset+limit podría valer??
		try(Statement statement =getDB(dbName).getConnection().createStatement();
				ResultSet rs = statement.executeQuery("SELECT * FROM "+tableName)){
			ResultSetMetaData md = rs.getMetaData();
			List<Map<String, ?>> results = new ArrayList<Map<String, ?>>();
			while (rs.next()) {
				Map<String, Object> row = IntStream.rangeClosed(1, md.getColumnCount())
						.mapToObj(colIndex-> getMapFromRow(rs, md, colIndex))
						.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
				results.add(row);
			}
			return results;
		}
	}

	private AbstractMap.SimpleEntry<String, Object> getMapFromRow(ResultSet rs, ResultSetMetaData md, int colIndex) {
		try {
			return new AbstractMap.SimpleEntry<String, Object>(md.getColumnLabel(colIndex), rs.getObject(colIndex));
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}

	public void exploreDBToConsoleOutput(String dbName) throws SQLException{
		System.out.println("Trying to connect to database "+ dbName);
		System.out.println("Connected, this DB has the following table types:");
		getTableTypes(dbName).forEach(System.out::println);
		System.out.println("Tables of type Table of this DB:");
		List<String> tableNames =getTableNames(dbName);
		tableNames.forEach(System.out::println);
		tableNames
				.forEach(tableName-> {
					System.out.println("################# TABLE: "+tableName+" #################");
					System.out.println("Columns of table: "+tableName);
					try {
						getColumns(dbName, tableName).forEach(System.out::println);
					} catch (SQLException e) {
						throw new RuntimeException(e);
					}
					System.out.println("Data of table "+tableName);
					try {
						System.out.println(getRows(dbName, tableName, 0));
					} catch (SQLException e) {
						throw new RuntimeException(e);
					}
				});
	}

	@PostConstruct
	private void testing() throws SQLException {
		final String DBName = "postgres";
		addDB(DBName, "Postgres");
		exploreDBToConsoleOutput("postgres");
	}


}
