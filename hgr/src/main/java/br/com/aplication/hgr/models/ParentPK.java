package br.com.aplication.hgr.models;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class ParentPK implements Serializable {
  private static final long serialVersionUID = 1L;

  @Column(name = "PARENT_ID")
  private Long parentId;

  @Column( name = "PARENT_TYPE" )
  private String parentType;

  public ParentPK(){}

  public ParentPK(Long parentId, String parentType) {
    this.parentId = parentId;
    this.parentType = parentType;
  }

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  public String getParentType() {
    return parentType;
  }

  public void setParentType(String parentType) {
    this.parentType = parentType;
  }

  @Override
  public String toString() {
    return "ParentPK{" +
        "parentId=" + parentId +
        ", parentType='" + parentType + '\'' +
        '}';
  }
}
