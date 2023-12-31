package com.imatia.implatform.imatiaspd.ws.core.rest;

import com.imatia.implatform.imatiaspd.model.core.config.dbrouting.DatabaseContextHolder;
import com.imatia.implatform.imatiaspd.model.core.exception.DatabaseValidationException;
import com.imatia.implatform.imatiaspd.model.core.exception.IdNotExistentOnDBException;
import com.imatia.implatform.imatiaspd.model.core.exception.ValidationException;
import com.imatia.implatform.imatiaspd.model.core.service.CRUDService;
import com.imatia.implatform.imatiaspd.model.core.service.domain.h2.H2Entity;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public abstract class AbstractCRUDController<E extends H2Entity, S extends CRUDService<E>> {
	@Autowired
	protected S service;

	private static final Logger logger = LoggerFactory.getLogger(AbstractCRUDController.class);

	private static final String ERROR_NOT_SORTED = "Paged queries must have at least one sort field with the desired order";

	@PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity create(@RequestBody final E entity) {
		DatabaseContextHolder.set("miDB");
		E createdEntity;
		try {
			createdEntity = service.create("miDB", entity);
		} catch (ValidationException ex) {
			logger.debug(ex.getMessage());
			return new ResponseEntity<String>(validationProblemMessage(ex), HttpStatus.BAD_REQUEST);
		} finally {
			DatabaseContextHolder.clear();
		}

		return new ResponseEntity<E>(createdEntity, HttpStatus.OK);
	}


	@PutMapping(produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity update(@RequestBody final E entity) {
		DatabaseContextHolder.set("miDB");
		E updatedEntity;
		try {
			updatedEntity = service.update("miDB", entity);
		} catch (ValidationException ex) {
			logger.debug(ex.getMessage());
			return new ResponseEntity<String>(validationProblemMessage(ex), HttpStatus.BAD_REQUEST);
		} catch (IdNotExistentOnDBException ex) {
			logger.debug(ex.getMessage());
			return new ResponseEntity(HttpStatus.NOT_FOUND);
		} finally {
			DatabaseContextHolder.clear();
		}
		return new ResponseEntity<E>(updatedEntity, HttpStatus.OK);
	}

//	@DeleteMapping
//	public ResponseEntity bulkDelete(@RequestBody final List<Long> idList) {
//		return new ResponseEntity<Integer>(service.delete("miDB", idList), HttpStatus.OK);
//	}


	@DeleteMapping(path = "/{id}")
	public ResponseEntity delete(@PathVariable(name = "id", required = true) final Long entityId) {
		DatabaseContextHolder.set("miDB");
		try {
			service.delete("miDB", entityId);
		} catch (IdNotExistentOnDBException ex) {
			logger.debug(ex.getMessage());
			return new ResponseEntity<>(nonexistentEntityIdMessage(entityId), HttpStatus.NOT_FOUND);
		} finally {
			DatabaseContextHolder.clear();
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping(path = "/{id}")
	public ResponseEntity<E> read(@PathVariable(name = "id", required = true) final Long entityId) {
		DatabaseContextHolder.set("miDB");
		ResponseEntity<E> response = service.read("miDB", entityId).map(entity -> new ResponseEntity<E>(entity, HttpStatus.OK)).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
		DatabaseContextHolder.clear();
		return response;
	}

//	@GetMapping(path = "/search")
//	public ResponseEntity search(Pageable pageable, @RequestParam(value = "substr", required = false) String substring) {
//		return pageable.getSort().equals(Sort.unsorted()) ? new ResponseEntity<String>(ERROR_NOT_SORTED, HttpStatus.BAD_REQUEST) : new ResponseEntity<Page>(service.find("miDB", substring, pageable), HttpStatus.OK);
//	}

	private String nonexistentEntityIdMessage(Long entityId) {
		return "There is no data for the given id: " + entityId;
	}

	private String validationProblemMessage(ValidationException ex) {
		return "Bad Request. Error: " + ex.getMessage();
	}

	@ExceptionHandler({DatabaseValidationException.class})
	public ResponseEntity<String> databaseConstraintViolated(HttpServletRequest request, DatabaseValidationException ex) {
		return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
	}

}
