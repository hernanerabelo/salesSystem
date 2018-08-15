package br.com.aplication.hgr.models;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name="CUSTOMER")
public class Customer implements Serializable {
  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  private Long id;

  @Column(name = "LEGAL_NAME")
  private String legalName;

  @Column(name = "FANTASY_NAME")
  private String fantasyName;

  @Column(name = "DOCUMENT_NUMBER", nullable = false)
  private String documentNumber;

  @Column(name = "DOCUMENT_TYPE", nullable = false)
  private String documentType;

  @Column(name = "STATE_REGISTRATION")
  private String state_registration;

  @Column( name = "FOUNDATION_DATE")
  private Date foundationDate;

  @Column( name = "EMAIL")
  private String email;

  @Column(name = "CREATED_BY")
  private String createdBy;

  @Column(name = "CREATED_AT")
  private Date createdAt;

  @Column(name = "UPDATED_BY")
  private String updatedBy;

  @Column(name = "UPDATED_AT")
  private Date updatedAt;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getLegalName() {
    return legalName;
  }

  public void setLegalName(String legalName) {
    this.legalName = legalName;
  }

  public String getFantasyName() {
    return fantasyName;
  }

  public void setFantasyName(String fantasyName) {
    this.fantasyName = fantasyName;
  }

  public String getDocumentNumber() {
    return documentNumber;
  }

  public void setDocumentNumber(String documentNumber) {
    this.documentNumber = documentNumber;
  }

  public String getDocumentType() {
    return documentType;
  }

  public void setDocumentType(String documentType) {
    this.documentType = documentType;
  }

  public String getState_registration() {
    return state_registration;
  }

  public void setState_registration(String state_registration) {
    this.state_registration = state_registration;
  }

  public Date getFoundationDate() {
    return foundationDate;
  }

  public void setFoundationDate(Date foundationDate) {
    this.foundationDate = foundationDate;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Date createdAt) {
    this.createdAt = createdAt;
  }

  public String getUpdatedBy() {
    return updatedBy;
  }

  public void setUpdatedBy(String updatedBy) {
    this.updatedBy = updatedBy;
  }

  public Date getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Date updatedAt) {
    this.updatedAt = updatedAt;
  }

  @Override
  public String toString() {
    return "Customer{" +
        "id=" + id +
        ", legalName='" + legalName + '\'' +
        ", fantasyName='" + fantasyName + '\'' +
        ", documentNumber='" + documentNumber + '\'' +
        ", documentType='" + documentType + '\'' +
        ", state_registration='" + state_registration + '\'' +
        ", foundationDate=" + foundationDate +
        ", email='" + email + '\'' +
        ", createdBy='" + createdBy + '\'' +
        ", createdAt=" + createdAt +
        ", updatedBy='" + updatedBy + '\'' +
        ", updatedAt=" + updatedAt +
        '}';
  }
}
