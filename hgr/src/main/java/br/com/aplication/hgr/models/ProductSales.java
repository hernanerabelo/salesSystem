package br.com.aplication.hgr.models;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table( name = "HBR_PRODUCT_SALES")
@SuppressWarnings("unused")
public class ProductSales implements Serializable {
  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  private Long id;

  @Column(name = "COUNT")
  private Long count;

  @Column(name = "DISCOUNT")
  private BigDecimal discount;

  @Column(name = "TOTAL")
  private BigDecimal total;

  @Transient
  private Sales sales;

  @Transient
  private Product product;


  public Long getCount() {
    return count;
  }

  public void setCount(Long count) {
    this.count = count;
  }

  public BigDecimal getDiscount() {
    return discount;
  }

  public void setDiscount(BigDecimal discount) {
    this.discount = discount;
  }

  public Sales getSales() {
    return sales;
  }

  public void setSales(Sales sales) {
    this.sales = sales;
  }

  public BigDecimal getTotal() {
    return total;
  }

  public void setTotal(BigDecimal total) {
    this.total = total;
  }
}
