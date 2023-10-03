CREATE TABLE usr_role (
	rol_id serial NOT NULL,
	rol_name varchar(100) NOT NULL,
	rol_xml_client_permission text NOT NULL,
	rol_notes text NULL,
	CONSTRAINT usr_role_pk PRIMARY KEY (rol_id),
	CONSTRAINT usr_role_un UNIQUE (rol_name)
);

CREATE TABLE usr_server_permission (
	srp_id serial NOT NULL,
	srp_name varchar(400) NOT NULL,
	CONSTRAINT usr_server_permission_pk PRIMARY KEY (srp_id),
	CONSTRAINT usr_server_permission_un UNIQUE (srp_name)
);

CREATE TABLE usr_role_server_permission (
	rsp_id serial NOT NULL,
	rol_id int4 NOT NULL,
	srp_id int4 NOT NULL,
	CONSTRAINT usr_role_server_permiss_pk PRIMARY KEY (rsp_id)
);
ALTER TABLE usr_role_server_permission ADD CONSTRAINT usr_role_server_permiss_fk FOREIGN KEY (rol_id) REFERENCES usr_role(rol_id);
ALTER TABLE usr_role_server_permission ADD CONSTRAINT usr_role_server_permiss_fk_1 FOREIGN KEY (srp_id) REFERENCES usr_server_permission(srp_id);

INSERT INTO usr_role (rol_id, rol_name, rol_xml_client_permission, rol_notes) VALUES(1, 'ADMIN', '<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?> <Security>  <!-- <MENU>  <ELEMENT attr="managerIO">      <Enabled restricted="yes"/>      <Visible restricted="yes"/>   </ELEMENT>  <ELEMENT attr="managerEntryPointControl">      <Enabled restricted="yes"/>      <Visible restricted="yes"/>   </ELEMENT>  </MENU>   <FORM archive="formRegistryManagement.form">  <ELEMENT attr="remove">   <Enabled restricted="yes"/>   <Visible restricted="yes"/>  </ELEMENT> </FORM>  <FORM archive="formRegistry.form">  <ELEMENT attr="IOR_INPUT_WEIGHT">   <Enabled restricted="yes"/>   <Visible restricted="yes"/>  </ELEMENT> </FORM> --> </Security>', 'Usuario administrador');
