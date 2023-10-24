package com.imatia.implatform.imatiaspd.model.core.service.impl;

import com.imatia.implatform.imatiaspd.model.core.service.domain.users.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private static final Role READ_FEW_ROLE= new Role(
			1L ,
			"USER",
			Set.of(
					CustomPrivileges.COL1_PRIV,
					CustomPrivileges.COL2_PRIV
	));
	private static final Role READ_MORE_ROLE= new Role(
			1L ,
			"ADMIN",
			Set.of(
					CustomPrivileges.COL1_PRIV,
					CustomPrivileges.COL2_PRIV,
					CustomPrivileges.COL3_PRIV,
					CustomPrivileges.COL4_PRIV,
					CustomPrivileges.SEE_HOMEPAGE_PRIV));
	private static final Map<String, User> userRepo = Map.<String, User>of(
			"user", new User(
					1L,
					"user", new BCryptPasswordEncoder().encode("pass"),
					Set.of(
							READ_FEW_ROLE
					),
					new Organization(1L, "org1")
			),
			"admin", new User(
					1L,
					"admin",
					new BCryptPasswordEncoder().encode("pass"),
					Set.of(
							READ_MORE_ROLE
					),
					new Organization(1L, "org1")
			));


	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user =userRepo.get(username);
		if (user == null) {
			throw new UsernameNotFoundException(username);
		}
		UserDetails details = new CustomUserDetails(user);
		System.out.println("User "+details.getUsername()+" succesfully logged. Current privileges:");
		details.getAuthorities().forEach(System.out::println);
		return details;
	}
}
