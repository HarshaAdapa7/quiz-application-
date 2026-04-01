package com.quizapp.backend.dto;

import java.util.Map;

public class TeacherAnalyticsDTO {
    private int totalQuizzes;
    private int activeStudents;
    private double averageScore;
    private Map<String, Double> categoryAccuracy;

    public TeacherAnalyticsDTO() {}

    public TeacherAnalyticsDTO(int totalQuizzes, int activeStudents, double averageScore, Map<String, Double> categoryAccuracy) {
        this.totalQuizzes = totalQuizzes;
        this.activeStudents = activeStudents;
        this.averageScore = averageScore;
        this.categoryAccuracy = categoryAccuracy;
    }

    public int getTotalQuizzes() { return totalQuizzes; }
    public void setTotalQuizzes(int totalQuizzes) { this.totalQuizzes = totalQuizzes; }
    
    public int getActiveStudents() { return activeStudents; }
    public void setActiveStudents(int activeStudents) { this.activeStudents = activeStudents; }
    
    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }
    
    public Map<String, Double> getCategoryAccuracy() { return categoryAccuracy; }
    public void setCategoryAccuracy(Map<String, Double> categoryAccuracy) { this.categoryAccuracy = categoryAccuracy; }
}
