package com.imatia.implatform.imatiaspd.model.core.service.impl;

import com.imatia.implatform.imatiaspd.model.core.service.domain.users.Privilege;

public abstract class CustomPrivileges {
	public final static Privilege COL1_PRIV=  new Privilege(1L, "org1:ds1:table1:col1_READ_PRIVILEGE");
	public final static Privilege COL2_PRIV=  new Privilege(2L, "org1:ds1:table1:col2_READ_PRIVILEGE");
	public final static Privilege COL3_PRIV=  new Privilege(3L, "org1:ds1:table1:col3_READ_PRIVILEGE");
	public final static Privilege COL4_PRIV=  new Privilege(4L, "org1:ds1:table1:col4_READ_PRIVILEGE");
	public final static Privilege SEE_HOMEPAGE_PRIV=  new Privilege(5L, "HOMEPAGE_READ_PRIVILEGE");




}
