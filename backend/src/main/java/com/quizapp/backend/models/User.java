package com.quizapp.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
import java.time.LocalDate;


@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "xp")
    private Integer xp = 0;

    @Column(name = "level")
    private Integer level = 1;

    @Column(name = "current_streak")
    private Integer currentStreak = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_badges",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "badge_id")
    )
    private Set<Badge> badges = new HashSet<>();

    public User() {}


    public User(String username, String email, String password, Role role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    
    public Integer getXp() { return xp != null ? xp : 0; }
    public void setXp(Integer xp) { this.xp = xp; }
    
    public Integer getLevel() { return level != null ? level : 1; }
    public void setLevel(Integer level) { this.level = level; }
    
    public Integer getCurrentStreak() { return currentStreak != null ? currentStreak : 0; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }
    
    public LocalDate getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(LocalDate lastActiveDate) { this.lastActiveDate = lastActiveDate; }
    
    public Set<Badge> getBadges() { return badges; }
    public void setBadges(Set<Badge> badges) { this.badges = badges; }
}

