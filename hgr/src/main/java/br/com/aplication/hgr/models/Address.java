package br.com.aplication.hgr.models;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name="HBR_ADDRESS")
public class Address  implements Serializable {

  private static final long serialVersionUID = 1L;

  @EmbeddedId
  private ParentPK parentPK;

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

  public ParentPK getParentPK() {
    return parentPK;
  }

  public void setParentPK(ParentPK parentPK) {
    this.parentPK = parentPK;
  }

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

  @Override
  public String toString() {
    return "Address{" +
        "parentPK=" + parentPK +
        ", cep='" + cep + '\'' +
        ", street='" + street + '\'' +
        ", number='" + number + '\'' +
        ", complement='" + complement + '\'' +
        ", neighborhood='" + neighborhood + '\'' +
        ", city='" + city + '\'' +
        ", state='" + state + '\'' +
        '}';
  }
}
