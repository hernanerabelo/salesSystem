package br.com.aplication.hgr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@SuppressWarnings("unused")
public class CarrierException extends RuntimeException{

  public CarrierException(String message) {
    super(message);
  }

  public CarrierException(String message, Throwable cause) {
    super(message, cause);
  }
}
