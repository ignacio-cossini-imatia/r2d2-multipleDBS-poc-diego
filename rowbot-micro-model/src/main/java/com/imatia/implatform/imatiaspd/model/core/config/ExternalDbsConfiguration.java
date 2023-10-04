package com.imatia.implatform.imatiaspd.model.core.config;

import com.imatia.implatform.imatiaspd.model.core.config.dbrouting.DataSourceBasedMultiTenantConnectionProviderImpl;
import com.imatia.implatform.imatiaspd.model.core.config.dbrouting.DataSourceRouter;
import com.imatia.implatform.imatiaspd.model.core.config.dbrouting.CurrentDBIdentifierResolver;
import com.imatia.implatform.imatiaspd.model.core.service.DatasourceUtils;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.cfg.Environment;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@EnableJpaRepositories(
		entityManagerFactoryRef = "externalDbsEntityManager",
		transactionManagerRef = "externalDbsTransactionManager",
		basePackages = {"com.imatia.implatform.imatiaspd.model.core.repo.h2"}
)
public class ExternalDbsConfiguration {
	//TODO: darle una vuelta para simplificar lo que se pueda
	private final String MAIN_DB = "MAIN_DB";
	private final DataSource mainDBDatasource;

	{
		try {
			mainDBDatasource = DatasourceUtils.buildDS(MAIN_DB);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}

	private Map<Object, Object> targetDataSources = initTargetDataSources();


	private Map<Object, Object> initTargetDataSources(){
		Map<Object, Object> targetDataSources = new ConcurrentHashMap<>();
		targetDataSources.put(MAIN_DB, mainDBDatasource);
		return targetDataSources;
	}


	private AbstractRoutingDataSource multipleDbDatasource;

	@Bean
	public MultiTenantConnectionProvider multiTenantConnectionProvider(){
		return new DataSourceBasedMultiTenantConnectionProviderImpl();
	}
	@Bean
	public CurrentTenantIdentifierResolver currentTenantIdentifierResolver(){
		return new CurrentDBIdentifierResolver();
	}

	@Bean(name = "externalDbsEntityManager")
	public LocalContainerEntityManagerFactoryBean buildExternalDbsEntityManager(EntityManagerFactoryBuilder builder
			, @Qualifier("externalDbsDatasource") DataSource domainsDataSource,
			MultiTenantConnectionProvider multiTenantConnectionProvider,
			CurrentTenantIdentifierResolver currentTenantIdentifierResolver){

		return builder
				.dataSource(domainsDataSource)
				.packages("com.imatia.implatform.imatiaspd.model.core.service.domain.h2")
				//.persistenceUnit(MAIN_DB)
				.properties(additionalJpaProperties(multiTenantConnectionProvider, currentTenantIdentifierResolver))
				.build();


	}

	private Map<String,?> additionalJpaProperties(MultiTenantConnectionProvider multiTenantConnectionProvider,
												  CurrentTenantIdentifierResolver currentTenantIdentifierResolver){
		Map<String,Object> map = new HashMap<>();
		map.put(Environment.MULTI_TENANT_CONNECTION_PROVIDER, multiTenantConnectionProvider);
		map.put(Environment.MULTI_TENANT_IDENTIFIER_RESOLVER, currentTenantIdentifierResolver);
		map.put("hibernate.hbm2ddl.auto", "create");
		map.put("hibernate.show_sql", "true");

		return map;
	}


	@Bean(name = "externalDbsDatasource")
	public DataSource clientDatasource() {
		multipleDbDatasource = new DataSourceRouter();
		try {
			multipleDbDatasource.setDefaultTargetDataSource(DatasourceUtils.buildDS(MAIN_DB));
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
		multipleDbDatasource.setTargetDataSources(targetDataSources);
		multipleDbDatasource.afterPropertiesSet();
		return multipleDbDatasource;
	}

	@Bean(name = "externalDbsTransactionManager")
	public JpaTransactionManager transactionManager(@Qualifier("externalDbsEntityManager") EntityManagerFactory domainsEntityManager){
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setEntityManagerFactory(domainsEntityManager);

		return transactionManager;
	}

	public void addDB(String name) throws SQLException {
		DataSource dataSource = DatasourceUtils.buildDS(name);

		try(Connection c = dataSource.getConnection()) {
			targetDataSources.put(name, dataSource);
			multipleDbDatasource.afterPropertiesSet();
		}
	}
	public void addDB(String name, String type) throws SQLException {
		DataSource dataSource = DatasourceUtils.buildDS(name, type);

		try(Connection c = dataSource.getConnection()) {
			targetDataSources.put(name, dataSource);
			multipleDbDatasource.afterPropertiesSet();
		}
	}
	public Map<Object, Object> getDataSources(){
		return targetDataSources;
	}
}
