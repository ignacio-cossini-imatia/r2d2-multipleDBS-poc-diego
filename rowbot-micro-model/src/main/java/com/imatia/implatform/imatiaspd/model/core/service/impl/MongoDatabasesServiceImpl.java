package com.imatia.implatform.imatiaspd.model.core.service.impl;

import com.imatia.implatform.imatiaspd.model.core.config.ExternalDbsConfiguration;
import com.imatia.implatform.imatiaspd.model.core.service.DatasourceUtils;
import com.imatia.implatform.imatiaspd.model.core.service.MongoDatabasesService;
import com.mongodb.client.MongoDatabase;
import org.apache.commons.collections.IteratorUtils;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class MongoDatabasesServiceImpl implements MongoDatabasesService {
	@Autowired
	ExternalDbsConfiguration externalDbsConfiguration;

	private List<String> getCollectionNames(String dbName) throws SQLException{

		return IteratorUtils.toList(
				DatasourceUtils.buildMongoDb(dbName)
					.listCollectionNames()
					.iterator());
	}

	private List<Map<String, ?>> getDocuments(String dbName, String collectionName, int limit) throws SQLException {
		return IteratorUtils.toList(
				DatasourceUtils.buildMongoDb(dbName)
						.getCollection(collectionName)
						.find()
//						.map(Document::toBsonDocument)
//						.map(BsonDocument::toMa)
						.iterator()
		);

	}

	@PostConstruct
	private void testing() throws SQLException {
		String db = "db_mongo1";
		System.out.println("Colecciones encontradas en bbdd "+db);
		List<String> collectionNames=getCollectionNames(db);
		collectionNames.forEach(
				colName->{
						System.out.println(colName);
						System.out.println("Datos en esta coleccion: ");
					try {
						getDocuments(db, colName,0).forEach(
								System.out::println);
					} catch (SQLException e) {
						throw new RuntimeException(e);
					}

				}
		);
	}


}
