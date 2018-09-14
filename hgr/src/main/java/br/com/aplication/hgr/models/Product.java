package br.com.aplication.hgr.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table( name = "HBR_PRODUCT")
@SuppressWarnings("unused")
public class Product implements Serializable {
  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  private Long id;

  @Column(name = "DESCRIPTION")
  private String description;

  @Column(name = "VALUE")
  private BigDecimal value;

  @Column(name = "CODE")
  private String code;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "MEASUREMENT_ID")
  private Measurement measurement;

  @Column(name = "CREATED_BY")
  private String createdBy;

  @Column(name = "CREATED_AT")
  private Date createdAt;

  @Column(name = "UPDATED_BY")
  private String updatedBy;

  @Column(name = "UPDATED_AT")
  private Date updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "PROVIDER_ID")
  private Provider provider;

  @OneToMany(cascade = CascadeType.ALL,
    fetch = FetchType.LAZY,
    mappedBy = "sales")
  private List<ProductSales> productSales = new ArrayList<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public BigDecimal getValue() {
    return value;
  }

  public void setValue(BigDecimal value) {
    this.value = value;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public Measurement getMeasurement() {
    return measurement;
  }

  public void setMeasurement(Measurement measurement) {
    this.measurement = measurement;
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

  public Provider getProvider() {
    return provider;
  }

  public void setProvider(Provider provider) {
    this.provider = provider;
  }

  @JsonIgnore
  public List<ProductSales> getProductSales() {
    return productSales;
  }

  public void setProductSales(List<ProductSales> productSales) {
    this.productSales = productSales;
  }

  @Override
  public String toString() {
    return "Product{" +
        "id=" + id +
        ", description='" + description + '\'' +
        ", value=" + value +
        ", code='" + code + '\'' +
        ", Measurement=" + measurement +
        ", createdBy='" + createdBy + '\'' +
        ", createdAt=" + createdAt +
        ", updatedBy='" + updatedBy + '\'' +
        ", updatedAt=" + updatedAt +
        '}';
  }
}
