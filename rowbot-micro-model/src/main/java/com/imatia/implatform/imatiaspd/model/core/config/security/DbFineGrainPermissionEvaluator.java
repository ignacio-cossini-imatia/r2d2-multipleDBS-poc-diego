package com.imatia.implatform.imatiaspd.model.core.config.security;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;
import java.util.List;

public class DbFineGrainPermissionEvaluator implements PermissionEvaluator {
	final static String PERMISSION_SEPARATOR=":";

	@Override
	public boolean hasPermission(
			Authentication auth, Object targetDomainObject, Object permission) {
		if ((auth == null) || (targetDomainObject == null) || !(permission instanceof String)){
			return false;
		}
		String targetType = targetDomainObject.getClass().getSimpleName().toUpperCase();

		return hasPrivilege(auth, targetType, permission.toString().toUpperCase());
	}

	public boolean hasPermission(Authentication auth, Object targetDomainObject, String organization, String dsName, String table, String column) {
		return hasPermission(auth, targetDomainObject, buildPermission(organization, dsName, table, column));
	}


	//NOTE: targetId is unused by now, it needs to be there to fill the interface method declaration
	//it could be used at future to fine grain more what a user can or cannot do
	@Override
	public boolean hasPermission(Authentication auth, Serializable targetId, String targetType, Object permission) {
		if ((auth == null) || (targetType == null) || !(permission instanceof String)) {
			return false;
		}
		return hasPrivilege(auth, targetType.toUpperCase(),
				permission.toString().toUpperCase());
	}

	public boolean hasPrivilege(Authentication auth, String targetType, String permission) {
		for (GrantedAuthority grantedAuth : auth.getAuthorities()) {
			//TODO: adaptar a org:ds:table:col_READ_PRIVILEGE y buscar otra vía que no sea .contains
			//organization_WRITE_PRIVILEGE
			//Para admins podríamos tener algo cómo org:EVERYTHING_READ_PRIVILEGE
			if (grantedAuth.getAuthority().startsWith(targetType) &&
					grantedAuth.getAuthority().contains(permission)) {
				return true;
			}
		}
		return false;
	}

	public boolean hasPrivilege(Authentication auth, String targetType, String organization, String dsName, String table, String column){
		return hasPrivilege(auth, targetType, buildPermission(organization, dsName, table, column));
	}

	private String buildPermission(String organization, String dsName, String table, String column){
		return String.join(PERMISSION_SEPARATOR, List.of(organization, dsName, table, column));
	}

}
