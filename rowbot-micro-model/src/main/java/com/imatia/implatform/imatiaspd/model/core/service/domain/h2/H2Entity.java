package com.imatia.implatform.imatiaspd.model.core.service.domain.h2;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class H2Entity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "")
	@EqualsAndHashCode.Include
	protected Long id;

}
