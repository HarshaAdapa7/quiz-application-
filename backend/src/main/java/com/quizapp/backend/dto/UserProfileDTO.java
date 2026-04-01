package com.quizapp.backend.dto;

import java.util.Map;
import java.util.List;
import com.quizapp.backend.models.Badge;

public class UserProfileDTO {
    private String username;
    private String email;
    private int totalQuizzesTaken;
    private int totalScore;
    private double averageAccuracy;
    private int level;
    private int currentStreak;
    private Map<String, Double> categoryAccuracy;
    private List<Badge> badges;
    private String avatarUrl;

    // Constructors, Getters, and Setters

    public UserProfileDTO() {}

    public UserProfileDTO(String username, String email, int totalQuizzesTaken, int totalScore, double averageAccuracy, int level, int currentStreak, Map<String, Double> categoryAccuracy, List<Badge> badges, String avatarUrl) {
        this.username = username;
        this.email = email;
        this.totalQuizzesTaken = totalQuizzesTaken;
        this.totalScore = totalScore;
        this.averageAccuracy = averageAccuracy;
        this.level = level;
        this.currentStreak = currentStreak;
        this.categoryAccuracy = categoryAccuracy;
        this.badges = badges;
        this.avatarUrl = avatarUrl;
    }


    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getTotalQuizzesTaken() { return totalQuizzesTaken; }
    public void setTotalQuizzesTaken(int totalQuizzesTaken) { this.totalQuizzesTaken = totalQuizzesTaken; }
    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
    public double getAverageAccuracy() { return averageAccuracy; }
    public void setAverageAccuracy(double averageAccuracy) { this.averageAccuracy = averageAccuracy; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
    public Map<String, Double> getCategoryAccuracy() { return categoryAccuracy; }
    public void setCategoryAccuracy(Map<String, Double> categoryAccuracy) { this.categoryAccuracy = categoryAccuracy; }
    public List<Badge> getBadges() { return badges; }
    public void setBadges(List<Badge> badges) { this.badges = badges; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}

