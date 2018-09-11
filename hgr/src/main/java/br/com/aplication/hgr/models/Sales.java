package br.com.aplication.hgr.models;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table( name = "HBR_SALES" )
@SuppressWarnings("unused")
public class Sales implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  private Long id;

  @Column(name = "TYPE")
  private String type;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "CARRIER_ID", updatable=false)
  private Carrier carrier;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "CUSTOMER_ID", updatable=false)
  private Customer customer;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "PROVIDER_ID", updatable=false)
  private Provider provider;

  @OneToOne(fetch = FetchType.LAZY,
      mappedBy = "sales",
      cascade = CascadeType.ALL)
  private Address address;

  @OneToMany(cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY,
      mappedBy = "sales")
  private List<Contact> contacts = new ArrayList<>();

  @OneToMany(cascade = CascadeType.ALL,
    fetch = FetchType.LAZY,
    mappedBy = "sales")
  private List<ProductSales> productSales = new ArrayList<>();

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

  public Carrier getCarrier() {
    return carrier;
  }

  public void setCarrier(Carrier carrier) {
    this.carrier = carrier;
  }

  public Customer getCustomer() {
    return customer;
  }

  public Provider getProvider() {
    return provider;
  }

  public void setProvider(Provider provider) {
    this.provider = provider;
  }

  public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public List getContacts() {
    return contacts;
  }

  public void setContacts(List<Contact> contacts) {
    this.contacts = contacts;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public List<ProductSales> getProductSales() {
    return productSales;
  }

  public void setProductSales(List<ProductSales> productSales) {
    this.productSales = productSales;
  }
}
