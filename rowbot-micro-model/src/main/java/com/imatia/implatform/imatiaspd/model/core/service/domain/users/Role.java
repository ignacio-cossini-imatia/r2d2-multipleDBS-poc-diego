package com.imatia.implatform.imatiaspd.model.core.service.domain.users;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@AllArgsConstructor
@Getter
@Setter
public class Role {
	private Long id;

	private String name;

	private Set<Privilege> privileges;

}
