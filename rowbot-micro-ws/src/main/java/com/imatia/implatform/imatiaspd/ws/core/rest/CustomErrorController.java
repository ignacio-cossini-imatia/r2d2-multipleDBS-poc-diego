package com.imatia.implatform.imatiaspd.ws.core.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ErrorProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Map;

@Controller
public class CustomErrorController extends AbstractErrorController {
	private final ErrorProperties errorProperties;
	private final BasicErrorController delegateController;

	@Autowired
	public CustomErrorController(ErrorAttributes errorAttributes){
		super(errorAttributes, Collections.<ErrorViewResolver>emptyList());
		this.errorProperties = new ErrorProperties();
		delegateController = new BasicErrorController(errorAttributes, errorProperties, Collections.emptyList());
	}

	@RequestMapping(value = PATH, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
		return delegateController.error(request);
	}

	private static final String PATH = "/error";

	@RequestMapping(value = PATH, produces = MediaType.TEXT_HTML_VALUE)
	public String error() {
		return "forward:/app/index.html";
	}

	public String getErrorPath() {
		return PATH;
	}

//	@ExceptionHandler({HttpMediaTypeNotAcceptableException.class})
//	public ResponseEntity<String> mediaTypeNotAcceptable(HttpServletRequest request) {
//		HttpStatus status = this.getStatus(request);
//		return ResponseEntity.status(status).build();
//	}

	protected ErrorProperties getErrorProperties() {
		return this.errorProperties;
	}
}
