package com.imatia.implatform.imatiaspd.model.core.exception;

public class IdNotExistentOnDBException extends RuntimeException {
	public IdNotExistentOnDBException(String s) {
		super(s);
	}

	public IdNotExistentOnDBException(String s, Throwable t) {
		super(s, t);
	}

	public IdNotExistentOnDBException(String throwerName, Long id){
		this(throwerName, id, null);
	}
	public IdNotExistentOnDBException(String throwerName, Long id, Throwable t){
		super("There was an error at service: " + throwerName + ", there is no entity with the given id:" + id, t);
	}
}
