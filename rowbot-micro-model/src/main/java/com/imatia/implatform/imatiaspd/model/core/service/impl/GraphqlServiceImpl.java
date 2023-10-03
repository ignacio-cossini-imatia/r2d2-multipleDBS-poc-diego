package com.imatia.implatform.imatiaspd.model.core.service.impl;

import com.imatia.implatform.imatiaspd.model.core.service.GraphqlService;
import com.imatia.implatform.imatiaspd.model.core.service.domain.Address;
import com.imatia.implatform.imatiaspd.model.core.service.domain.Persona;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class GraphqlServiceImpl implements GraphqlService {

	private List<Persona> personas = new ArrayList<Persona>(List.of(
			Persona.builder().id(1L).name("Antonio").surname("A").addressId(1L).build(),
			Persona.builder().id(2L).name("Benito").surname("B").addressId(1L).build(),
			Persona.builder().id(3L).name("Carlos").surname("C").addressId(2L).build()
	));

	private List<Address> addresses = new ArrayList<Address>(List.of(
			Address.builder().id(1L).street("Calle Falsa").number(123).build(),
			Address.builder().id(2L).street("Calle Falsa").number(456).build()
	));
	private Stream<Persona> getPersonas(){
		return personas.stream();
	}

	private Stream<Address> getAddresses(){
		return addresses.stream();
	}

	@Override
	public Persona savePersona(Persona persona){
		Persona personaToSave = persona.toBuilder().id(personas.stream().map(Persona::getId).max(Long::compare).orElse(-1L) + 1).build();
		personas.add(personaToSave);
		return personaToSave;
	}
	@Override
	public Persona personaById(Long id) {
		return getPersonas().filter(persona->persona.getId().equals(id)).findFirst().orElse(null);
	}

	@Override
	public Address addressById(Long id) {
		return getAddresses().filter(address->address.getId().equals(id)).findFirst().orElse(null);
	}

	@Override
	public Address addressByPersona(Persona persona) {
		return getAddresses().filter(address->address.getId().equals(persona.getAddressId())).findFirst().orElse(null);
	}
}
