package com.imatia.implatform.imatiaspd.model.core.service;

import java.sql.SQLException;
import java.util.Map;

public interface DatabasesService {
	Map<Object, Object> getAllDBs();
	void addDB(String name) throws SQLException;

	void addDB(String name, String type) throws SQLException;

	Object getDB(String name);
	void removeDB(String name);
	void removeAll();
}
