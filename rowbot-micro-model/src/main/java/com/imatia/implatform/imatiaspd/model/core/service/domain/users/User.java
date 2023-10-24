package com.imatia.implatform.imatiaspd.model.core.service.domain.users;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@AllArgsConstructor
@Getter
@Setter
public class User{
	private Long id;

	private String username;

	private String password;

	private Set<Role> roles;

	private Organization organization;

}
