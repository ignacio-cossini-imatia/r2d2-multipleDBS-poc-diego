package com.imatia.implatform.imatiaspd.model.core.repo.h2;

import com.imatia.implatform.imatiaspd.model.core.service.domain.h2.Client;
import com.imatia.implatform.imatiaspd.model.core.service.domain.h2.H2Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;


@Repository
public interface ClientRepository extends H2Repository<Client>{


}
