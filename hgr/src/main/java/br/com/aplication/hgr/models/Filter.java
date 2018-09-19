package br.com.aplication.hgr.models;

import java.util.Date;
import java.util.HashMap;

public class Filter {

  private Date start;
  private Date finish;
  private String status;
  private String createdBy;
  private HashMap<String, String> column = new HashMap<>();

  public Date getStart() {
    return start;
  }

  public void setStart(Date start) {
    this.start = start;
  }

  public Date getFinish() {
    return finish;
  }

  public void setFinish(Date finish) {
    this.finish = finish;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public HashMap<String, String> getColumn() {
    return column;
  }

  public void setColumn(HashMap<String, String> column) {
    this.column = column;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }
}
