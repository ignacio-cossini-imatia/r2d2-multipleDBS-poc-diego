package com.imatia.implatform.imatiaspd.model.core.config.dbrouting;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

public class DataSourceRouter
		extends AbstractRoutingDataSource {

	@Override
	protected Object determineCurrentLookupKey() {
		return DatabaseContextHolder.getClientDatabase();
	}


}
