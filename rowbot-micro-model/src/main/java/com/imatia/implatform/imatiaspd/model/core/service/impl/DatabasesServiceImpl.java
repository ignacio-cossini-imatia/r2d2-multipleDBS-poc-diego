package com.imatia.implatform.imatiaspd.model.core.service.impl;

import com.imatia.implatform.imatiaspd.model.core.config.ExternalDbsConfiguration;
import com.imatia.implatform.imatiaspd.model.core.service.DatabasesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

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

	//TODO: eliminar y montar un controlador para hacer esto de forma más normal
	@PostConstruct
	private void testing() throws SQLException {
		System.out.println("me conecto a la DB de prueba:");
		addDB("prueba1","MySQL");
		System.out.println("Conectado, buscando tablas:");
		String[] types = {"TABLE"};
		ResultSet tablasResultSet = getDB("prueba1").getConnection()
				.getMetaData()
				.getTables("prueba1", null, "%", types);
		while(tablasResultSet.next()){
			System.out.println(tablasResultSet.getString(3));
		}
		addDB("miDB");
	}


}
