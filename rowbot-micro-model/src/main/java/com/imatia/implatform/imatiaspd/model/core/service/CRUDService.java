package com.imatia.implatform.imatiaspd.model.core.service;

import com.imatia.implatform.imatiaspd.model.core.repo.h2.H2Repository;
import com.imatia.implatform.imatiaspd.model.core.service.domain.DomainObject;
import com.imatia.implatform.imatiaspd.model.core.service.domain.h2.H2Entity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Generic interface for services able to do CRUD operations, its purpose is expose common functionalities across different services
 *
 * @param <E> the domain object type
 */
public interface CRUDService<E extends H2Entity> {
	E create(String dbId, E entity);

	Optional<E> read(String dbId, Long entityId);

//	Page<E> find(String dbId, String search, Pageable pageable);

	void delete(String dbId, Long entityId);

//	Integer delete(String dbId, List<Long> entityIds);

	E update(String dbId, E entity);
}
