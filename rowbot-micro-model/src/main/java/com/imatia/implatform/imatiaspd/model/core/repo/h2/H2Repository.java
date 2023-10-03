package com.imatia.implatform.imatiaspd.model.core.repo.h2;

import com.imatia.implatform.imatiaspd.model.core.service.domain.h2.H2Entity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;


@NoRepositoryBean
public interface H2Repository<DBO extends H2Entity> extends JpaRepository<DBO, Long>{


}
