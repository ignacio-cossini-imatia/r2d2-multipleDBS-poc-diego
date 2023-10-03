package com.imatia.implatform.imatiaspd.model.core.service.domain;

import lombok.EqualsAndHashCode;
import lombok.Value;
import lombok.experimental.SuperBuilder;

@Value
@EqualsAndHashCode
@SuperBuilder(toBuilder = true)
public class Address {
	Long id;
	String street;
	Integer number;
}
