package com.imatia.implatform.imatiaspd.ws.core.rest;

import com.imatia.implatform.imatiaspd.model.core.service.ClientService;
import com.imatia.implatform.imatiaspd.model.core.service.domain.h2.Client;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/client")
public class ClientController extends AbstractCRUDController<Client, ClientService> {

}
