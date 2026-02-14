package com.restaurant.controller;

import com.restaurant.model.Reservation;
import com.restaurant.model.User;
import com.restaurant.repository.ReservationRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @GetMapping("/my")
    public List<Reservation> getMyReservations(Authentication authentication) {
        User user = userRepository.findByUsernameOrEmail(authentication.getName(), authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reservationRepository.findByUser(user);
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation, Authentication authentication) {
        User user = userRepository.findByUsernameOrEmail(authentication.getName(), authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        reservation.setUser(user);

        Reservation savedReservation = reservationRepository.save(reservation);

        // Notify admin of new reservation
        messagingTemplate.convertAndSend("/topic/reservations", savedReservation);

        return savedReservation;
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Reservation> updateStatus(@PathVariable Long id,
            @RequestBody Reservation.ReservationStatus status) {
        return reservationRepository.findById(id)
                .map(reservation -> {
                    reservation.setStatus(status);
                    Reservation updatedReservation = reservationRepository.save(reservation);

                    // Notify user specifically
                    messagingTemplate.convertAndSend("/topic/reservation-updates/" + reservation.getUser().getId(),
                            updatedReservation);

                    // Notify admins to update list
                    messagingTemplate.convertAndSend("/topic/reservations", updatedReservation);

                    return ResponseEntity.ok(updatedReservation);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
