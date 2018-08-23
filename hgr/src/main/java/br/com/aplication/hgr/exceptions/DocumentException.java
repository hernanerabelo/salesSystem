package br.com.aplication.hgr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DocumentException extends RuntimeException{
  public DocumentException(String msg){
    super(msg);
  }

  public DocumentException(String msg, Throwable err){
    super(msg, err);
  }
}
