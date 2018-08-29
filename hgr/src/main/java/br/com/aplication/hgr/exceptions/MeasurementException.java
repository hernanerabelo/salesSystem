package br.com.aplication.hgr.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@SuppressWarnings("unused")
public class MeasurementException  extends RuntimeException {
  public MeasurementException(String msg){
    super(msg);
  }

  public MeasurementException(String msg, Throwable err){
    super(msg, err);
  }
}
