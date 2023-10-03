package com.imatia.implatform.imatiaspd.ws.core.rest;

import com.imatia.implatform.imatiaspd.model.core.service.GraphqlService;
import com.imatia.implatform.imatiaspd.model.core.service.domain.Address;
import com.imatia.implatform.imatiaspd.model.core.service.domain.Persona;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/graphqltuto")
public class TutorialGraphqlController {
	@Autowired
	GraphqlService graphqlService;

	@QueryMapping
	public Persona personaById(@Argument Long id) {
		return graphqlService.personaById(id);
	}

	@SchemaMapping(typeName = "Persona")
	public Address address(Persona persona) {
		return graphqlService.addressByPersona(persona);
	}

	@MutationMapping
	public Persona createPersona(@Argument String name, @Argument String surname, @Argument Optional<Long> addressId) {

		Persona newPersona = Persona.builder().name(name).surname(surname).addressId(addressId.orElse(null)).build();
		return graphqlService.savePersona(newPersona);

	}

}