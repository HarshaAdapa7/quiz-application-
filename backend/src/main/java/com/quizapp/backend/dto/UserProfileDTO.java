package com.quizapp.backend.dto;

import com.quizapp.backend.models.Category;
import java.util.Map;

public class UserProfileDTO {
    private String username;
    private String email;
    private int totalQuizzesTaken;
    private int totalScore;
    private double averageAccuracy;
    private int level;
    private int currentStreak;
    private Map<Category, Double> categoryAccuracy;

    // Constructors, Getters, and Setters

    public UserProfileDTO() {}

    public UserProfileDTO(String username, String email, int totalQuizzesTaken, int totalScore, double averageAccuracy, int level, int currentStreak, Map<Category, Double> categoryAccuracy) {
        this.username = username;
        this.email = email;
        this.totalQuizzesTaken = totalQuizzesTaken;
        this.totalScore = totalScore;
        this.averageAccuracy = averageAccuracy;
        this.level = level;
        this.currentStreak = currentStreak;
        this.categoryAccuracy = categoryAccuracy;
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
    public Map<Category, Double> getCategoryAccuracy() { return categoryAccuracy; }
    public void setCategoryAccuracy(Map<Category, Double> categoryAccuracy) { this.categoryAccuracy = categoryAccuracy; }
}

