package br.com.aplication.hgr.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="HBR_PROVIDER", indexes = {
    @Index(columnList = "DOCUMENT_NUMBER", name = "IDX_DOCUMENT_NUMBER")
})
@SuppressWarnings("unused")
public class Provider implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  private Long id;

  @Column(name = "LEGAL_NAME")
  private String legalName;

  @Column(name = "FANTASY_NAME")
  private String fantasyName;

  @Column(name = "DOCUMENT_NUMBER", nullable = false, unique = true, length = 20)
  private String documentNumber;

  @Column(name = "DOCUMENT_TYPE", nullable = false, length = 10)
  private String documentType;

  @Column(name = "STATE_REGISTRATION")
  private String stateRegistration;

  @Column(name = "CITY_REGISTRATION")
  private String cityRegistration;

  @Column( name = "FOUNDATION_DATE")
  private Date foundationDate;

  @OneToMany(cascade = CascadeType.ALL,
      fetch = FetchType.LAZY,
      mappedBy = "provider")
  private List<Sales> sales = new ArrayList<>();

  @Column(name = "CREATED_BY")
  private String createdBy;

  @Column(name = "CREATED_AT")
  private Date createdAt;

  @Column(name = "UPDATED_BY")
  private String updatedBy;

  @Column(name = "UPDATED_AT")
  private Date updatedAt;

  @OneToOne(fetch = FetchType.LAZY,
      mappedBy = "provider",
      cascade = CascadeType.ALL)
  private Address address;

  @OneToMany(cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY,
      mappedBy = "provider")
  private List<Contact> contacts = new ArrayList<>();

  @OneToMany(cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY,
      mappedBy = "provider")
  private List<Product> products = new ArrayList<>();

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

  public String getStateRegistration() {
    return stateRegistration;
  }

  public void setStateRegistration(String stateRegistration) {
    this.stateRegistration = stateRegistration;
  }

  public String getCityRegistration() {
    return cityRegistration;
  }

  public void setCityRegistration(String cityRegistration) {
    this.cityRegistration = cityRegistration;
  }

  public Date getFoundationDate() {
    return foundationDate;
  }

  public void setFoundationDate(Date foundationDate) {
    this.foundationDate = foundationDate;
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

  public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }

  public List<Contact> getContacts() {
    return contacts;
  }

  public void setContacts(List<Contact> contacts) {
    this.contacts = contacts;
  }

  @JsonIgnore
  public List<Product> getProducts() {
    return products;
  }

  public void setProducts(List<Product> products) {
    this.products = products;
  }

  @JsonIgnore
  public List<Sales> getSales() {
    return sales;
  }

  public void setSales(List<Sales> sales) {
    this.sales = sales;
  }

  @Override
  public String toString() {
    return "Provider{" +
        "id=" + id +
        ", legalName='" + legalName + '\'' +
        ", fantasyName='" + fantasyName + '\'' +
        ", documentNumber='" + documentNumber + '\'' +
        ", documentType='" + documentType + '\'' +
        ", stateRegistration='" + stateRegistration + '\'' +
        ", cityRegistration='" + cityRegistration + '\'' +
        ", foundationDate=" + foundationDate +
        ", createdBy='" + createdBy + '\'' +
        ", createdAt=" + createdAt +
        ", updatedBy='" + updatedBy + '\'' +
        ", updatedAt=" + updatedAt +
        ", address=" + address +
        ", contacts=" + contacts +
        '}';
  }
}
