package com.imatia.implatform.imatiaspd.model.core.config.dbrouting;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;

public class CurrentDBIdentifierResolver implements CurrentTenantIdentifierResolver {
	static String DEFAULT_TENANT = "DEFAULT";

	@Override
	public String resolveCurrentTenantIdentifier() {
		String currentTenant = DatabaseContextHolder.getClientDatabase();
		return currentTenant != null ? currentTenant : DEFAULT_TENANT;
	}

	@Override
	public boolean validateExistingCurrentSessions() {
		return true;
	}

}
