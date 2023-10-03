package com.imatia.implatform.imatiaspd.model.core.service.impl;

import com.imatia.implatform.imatiaspd.model.core.repo.h2.ClientRepository;
import com.imatia.implatform.imatiaspd.model.core.service.ClientService;
import com.imatia.implatform.imatiaspd.model.core.service.domain.h2.Client;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClientServiceImpl extends AbstractExternalDBsCRUDService<Client, ClientRepository> implements ClientService {

}
