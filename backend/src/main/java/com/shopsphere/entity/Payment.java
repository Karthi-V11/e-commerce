package com.shopsphere.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false, length = 30)
    private String method;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "transaction_ref", length = 100)
    private String transactionRef;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}
