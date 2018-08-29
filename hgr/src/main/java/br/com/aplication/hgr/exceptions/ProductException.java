package br.com.aplication.hgr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@SuppressWarnings("unused")
public class ProductException extends RuntimeException  {

  public ProductException(String msg){
    super(msg);
  }

  public ProductException(String msg, Throwable err){
    super(msg, err);
  }

}
