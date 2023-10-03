package com.imatia.implatform.imatiaspd.model.core.config.dbrouting;

import com.imatia.implatform.imatiaspd.model.core.config.ExternalDbsConfiguration;
import org.hibernate.engine.jdbc.connections.spi.AbstractDataSourceBasedMultiTenantConnectionProviderImpl;
import org.springframework.beans.factory.annotation.Autowired;

import javax.sql.DataSource;

public class DataSourceBasedMultiTenantConnectionProviderImpl extends AbstractDataSourceBasedMultiTenantConnectionProviderImpl {
	private static final long serialVersionUID = 1L;

	@Autowired
	private ExternalDbsConfiguration externalDbsConfiguration;

	@Override
	protected DataSource selectAnyDataSource() {
		//TODO: buscar una forma que no sea casteando
		return ((DataSource)externalDbsConfiguration.getDataSources().values().iterator().next());
	}

	@Override
	protected DataSource selectDataSource(String dsId) {
		return ((DataSource)externalDbsConfiguration.getDataSources().get(dsId));
	}

}
