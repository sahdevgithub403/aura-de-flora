package com.restaurant.util;

import com.restaurant.model.MenuItem;
import com.restaurant.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

        @Autowired
        private MenuItemRepository menuItemRepository;

        @Override
        public void run(String... args) throws Exception {
                if (menuItemRepository.count() == 0) {
                        seedMenuItems();
                }
        }

        private void seedMenuItems() {
                MenuItem[] items = {
                                new MenuItem("Saffron & Sage Risotto",
                                                "Arborio rice infused with premium saffron and crispy sage butter.",
                                                new BigDecimal("850"), "Mains"),
                                new MenuItem("Wild Mushroom Pappardelle",
                                                "Hand-cut pasta with foraged mushrooms and truffle cream.",
                                                new BigDecimal("720"), "Mains"),
                                new MenuItem("Herb-Crusted Sea Bass",
                                                "Fresh sea bass with a citrus herb crust and roasted asparagus.",
                                                new BigDecimal("1200"), "Mains"),
                                new MenuItem("Truffle Infused Burrata",
                                                "Creamy burrata served with heritage tomatoes and truffle balsamic.",
                                                new BigDecimal("550"), "Starters"),
                                new MenuItem("Smoked Duck Salad",
                                                "Maple-smoked duck breast with micro-greens and pomegranate.",
                                                new BigDecimal("650"), "Starters"),
                                new MenuItem("Artisanal Bread Basket",
                                                "Selection of sourdough and rye with house-churned sea salt butter.",
                                                new BigDecimal("250"), "Starters"),
                                new MenuItem("Dark Chocolate Fondant",
                                                "70% cocoa lava cake with Madagascar vanilla bean gelato.",
                                                new BigDecimal("450"), "Desserts"),
                                new MenuItem("Rosemary & honey Panna Cotta",
                                                "Silky cream infused with local rosemary and wild honey.",
                                                new BigDecimal("380"), "Desserts"),
                                new MenuItem("Elderflower Lemonade",
                                                "Sparkling house-made lemonade with delicate elderflower notes.",
                                                new BigDecimal("220"), "Beverages"),
                                new MenuItem("Smoked Old Fashioned",
                                                "Classic bourbon cocktail smoked with cherry wood chips.",
                                                new BigDecimal("650"), "Beverages")
                };

                // Set images for some
                items[0].setImageUrl(
                                "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80");
                items[1].setImageUrl(
                                "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80");
                items[2].setImageUrl(
                                "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80");
                items[3].setImageUrl(
                                "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80");
                items[6].setImageUrl(
                                "https://images.unsplash.com/photo-1541992224050-70bc16388439?auto=format&fit=crop&w=800&q=80");

                menuItemRepository.saveAll(Arrays.asList(items));
                System.out.println("Seeded database with Harvest & Hearth artisanal menu items.");
        }
}
