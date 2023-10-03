package com.imatia.implatform.imatiaspd.model.core.service;

import com.imatia.implatform.imatiaspd.model.core.service.domain.Address;
import com.imatia.implatform.imatiaspd.model.core.service.domain.Persona;

public interface GraphqlService {
	Persona personaById(Long id);
	Address addressById(Long id);

	Address addressByPersona(Persona persona);

	Persona savePersona(Persona persona);
}
