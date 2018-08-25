package br.com.aplication.hgr.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table( name = "HBR_CONTACT")
public class Contact implements Serializable {
  public static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  private Long id;

  @Column(name = "NAME")
  private String name;

  @Column(name = "PHONE")
  private String phone;

  @Column(name = "EMAIL")
  private String email;

  @Column(name = "OBSERVATION", length = 4000)
  private String observation;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "CUSTOMER_ID", nullable = true)
  @JsonIgnore
  private Customer customer;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getObservation() {
    return observation;
  }

  public void setObservation(String observation) {
    this.observation = observation;
  }

  public Customer getCustomer() {
    return customer;
  }

  public void setCustomer(Customer customer) {
    this.customer = customer;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Override
  public String toString() {
    return "Contact{" +
        "id=" + id +
        ", name='" + name + '\'' +
        ", phone='" + phone + '\'' +
        ", email='" + email + '\'' +
        ", observation='" + observation + '\'' +
        '}';
  }
}
