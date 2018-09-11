package br.com.aplication.hgr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@SuppressWarnings("unused")
public class ContactException extends RuntimeException {

  public ContactException(String msg){
    super(msg);
  }

  public ContactException(String msg, Throwable err){
    super(msg, err);
  }

}
