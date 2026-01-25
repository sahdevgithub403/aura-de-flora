package com.restaurant.controller;

import com.restaurant.model.MenuItem;
import com.restaurant.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping
    public List<MenuItem> getAllAvailableMenuItems() {
        return menuItemRepository.findByAvailableTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public List<MenuItem> getMenuItemsByCategory(@PathVariable String category) {
        return menuItemRepository.findByCategoryAndAvailableTrue(category);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MenuItem createMenuItem(@Valid @RequestBody MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItem menuItemDetails) {
        return menuItemRepository.findById(id)
                .map(menuItem -> {
                    menuItem.setName(menuItemDetails.getName());
                    menuItem.setDescription(menuItemDetails.getDescription());
                    menuItem.setPrice(menuItemDetails.getPrice());
                    menuItem.setCategory(menuItemDetails.getCategory());
                    menuItem.setImageUrl(menuItemDetails.getImageUrl());
                    menuItem.setAvailable(menuItemDetails.getAvailable());
                    return ResponseEntity.ok(menuItemRepository.save(menuItem));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        return menuItemRepository.findById(id)
                .map(menuItem -> {
                    menuItemRepository.delete(menuItem);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}