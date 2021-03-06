package br.com.aplication.hgr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@SuppressWarnings("unused")
public class CustomerException extends RuntimeException {

  public CustomerException(String msg){
    super(msg);
  }

  public CustomerException(String msg, Throwable err){
    super(msg, err);
  }

}
