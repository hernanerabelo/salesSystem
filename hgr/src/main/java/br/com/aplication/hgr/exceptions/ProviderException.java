package br.com.aplication.hgr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@SuppressWarnings("unused")
public class ProviderException extends RuntimeException {

  public ProviderException(String msg){
    super(msg);
  }

  public ProviderException(String msg, Throwable err){
    super(msg, err);
  }

}
