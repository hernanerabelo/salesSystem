package br.com.aplication.hgr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AddressException extends RuntimeException {
  public AddressException(String message) {
    super(message);
  }

  public AddressException(String message, Throwable cause) {
    super(message, cause);
  }
}
