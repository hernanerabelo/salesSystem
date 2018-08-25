package br.com.aplication.hgr.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="HBR_ADDRESS")
public class Address  implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  private Long id;

  @Column(name = "CEP")
  private String cep;

  @Column(name = "STREET")
  private String street;

  @Column(name = "NUMBER")
  private String number;

  @Column(name = "COMPLEMENT")
  private String complement;

  @Column(name = "NEIGHBORHOOD")
  private String neighborhood;

  @Column(name = "CITY")
  private String city;

  @Column(name = "STATE")
  private String state;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name="CUSTOMER_ID", nullable = true)
  @JsonIgnore
  private Customer customer;

  public String getCep() {
    return cep;
  }

  public void setCep(String cep) {
    this.cep = cep;
  }

  public String getStreet() {
    return street;
  }

  public void setStreet(String street) {
    this.street = street;
  }

  public String getNumber() {
    return number;
  }

  public void setNumber(String number) {
    this.number = number;
  }

  public String getComplement() {
    return complement;
  }

  public void setComplement(String complement) {
    this.complement = complement;
  }

  public String getNeighborhood() {
    return neighborhood;
  }

  public void setNeighborhood(String neighborhood) {
    this.neighborhood = neighborhood;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Customer getCustomer() {
    return customer;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  @Override
  public String toString() {
    return "Address{" +
        "id=" + id +
        ", cep='" + cep + '\'' +
        ", street='" + street + '\'' +
        ", number='" + number + '\'' +
        ", complement='" + complement + '\'' +
        ", neighborhood='" + neighborhood + '\'' +
        ", city='" + city + '\'' +
        ", state='" + state + '\'' +
        ", customer=" + customer +
        '}';
  }
}
