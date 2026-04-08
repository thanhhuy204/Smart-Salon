package com.salon.module.appointment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "salon_working_hours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalonWorkingHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "day_of_week", nullable = false, unique = true)
    private Byte dayOfWeek; // 1=Mon, 7=Sun

    @Column(name = "open_time", nullable = false)
    private LocalTime openTime;

    @Column(name = "close_time", nullable = false)
    private LocalTime closeTime;

    @Column(name = "slot_duration_m", nullable = false)
    @Builder.Default
    private Short slotDurationM = 30;

    @Column(name = "is_open", nullable = false)
    @Builder.Default
    private Boolean isOpen = true;
}
