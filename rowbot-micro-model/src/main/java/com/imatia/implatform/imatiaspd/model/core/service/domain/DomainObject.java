package com.imatia.implatform.imatiaspd.model.core.service.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.experimental.SuperBuilder;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@NonFinal
@AllArgsConstructor
@NoArgsConstructor
@Getter
@SuperBuilder(toBuilder = true)
public abstract class DomainObject {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "")
	protected Long id;

	protected String dbId;

}
