package com.imatia.implatform.imatiaspd.model.core.config.dbrouting;

import org.springframework.util.Assert;

public class DatabaseContextHolder {
	//	TODO: estudiar implementar closable/autocloseable, con try-with-resources podríamos llamar al .clear() al cerrarse, eliminando código meh
	// Si se opta por interceptores podría no tener sentido(o quizá sí, revisarlo)

	private static ThreadLocal<String> CONTEXT
			= new ThreadLocal<>();

	public static void set(String clientDatabase) {
		Assert.notNull(clientDatabase, "clientDatabase cannot be null");
		CONTEXT.set(clientDatabase);
	}

	public static String getClientDatabase() {
		return CONTEXT.get();
	}

	public static void clear() {
		CONTEXT.remove();
	}

}
