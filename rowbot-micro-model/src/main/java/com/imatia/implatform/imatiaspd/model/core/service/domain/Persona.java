package com.imatia.implatform.imatiaspd.model.core.service.domain;

import lombok.EqualsAndHashCode;
import lombok.Value;
import lombok.experimental.SuperBuilder;

@Value
@EqualsAndHashCode
@SuperBuilder(toBuilder = true)
public class Persona {
	Long id;
	String name;
	String surname;
	Long addressId;
}
