package com.imatia.implatform.imatiaspd.model.core.service.domain.h2;

import lombok.*;
import lombok.experimental.SuperBuilder;

import jakarta.persistence.Entity;


@Entity(name = "client")
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@SuperBuilder(toBuilder = true)
@Getter
@Setter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PUBLIC)

public class Client extends H2Entity {
	String name;

}
