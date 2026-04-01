package com.quizapp.backend.controllers;

import com.quizapp.backend.models.Quiz;
import com.quizapp.backend.models.QuizAttempt;
import com.quizapp.backend.models.User;
import com.quizapp.backend.repositories.AttemptAnswerRepository;
import com.quizapp.backend.repositories.QuizAttemptRepository;
import com.quizapp.backend.repositories.QuizRepository;
import com.quizapp.backend.repositories.UserRepository;
import com.quizapp.backend.security.UserDetailsImpl;
import com.quizapp.backend.repositories.BadgeRepository;
import com.quizapp.backend.models.Badge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {
    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private AttemptAnswerRepository answerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow();
    }

    @GetMapping("/quizzes")
    public ResponseEntity<List<Quiz>> getAvailableQuizzes() {
        return ResponseEntity.ok(quizRepository.findByIsPublishedTrue());
    }

    @PostMapping("/attempt")
    public ResponseEntity<?> submitAttempt(@RequestBody QuizAttempt attemptRequest) {
        User student = getCurrentUser();
        
        Optional<Quiz> quizOpt = quizRepository.findById(attemptRequest.getQuiz().getId());
        if(quizOpt.isEmpty()) return ResponseEntity.badRequest().body("Quiz not found");
        Quiz quiz = quizOpt.get();

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(student);
        attempt.setQuiz(quiz);
        attempt.setTotalQuestions(quiz.getQuestions().size());
        attempt.setStartTime(attemptRequest.getStartTime());
        attempt.setEndTime(LocalDateTime.now());
        
        int score = attemptRequest.getScore() != null ? attemptRequest.getScore() : 0;
        attempt.setScore(score);
        
        QuizAttempt savedAttempt = attemptRepository.save(attempt);
        
        // Gamification Logic
        student.setXp(student.getXp() + score);
        student.setLevel((student.getXp() / 100) + 1);
        
        LocalDate today = LocalDate.now();
        if (student.getLastActiveDate() == null || student.getLastActiveDate().isBefore(today.minusDays(1))) {
            student.setCurrentStreak(1);
        } else if (student.getLastActiveDate().equals(today.minusDays(1))) {
            student.setCurrentStreak(student.getCurrentStreak() + 1);
        }
        student.setLastActiveDate(today);

        // Badge: First Quiz
        if (student.getBadges().stream().noneMatch(b -> b.getName().equals("First Quiz"))) {
            Badge firstBadge = badgeRepository.findByName("First Quiz").orElseGet(() -> badgeRepository.save(new Badge("First Quiz", "Completed your very first quiz!", "🎯")));
            student.getBadges().add(firstBadge);
        }

        // Badge: Perfect Score (min 3 questions)
        if (score == quiz.getQuestions().size() && quiz.getQuestions().size() >= 3) {
            if (student.getBadges().stream().noneMatch(b -> b.getName().equals("Perfect Score"))) {
                Badge perfectBadge = badgeRepository.findByName("Perfect Score").orElseGet(() -> badgeRepository.save(new Badge("Perfect Score", "Got 100% on a quiz", "🏆")));
                student.getBadges().add(perfectBadge);
            }
        }

        // Badge: Streak Master
        if (student.getCurrentStreak() >= 3) {
            if (student.getBadges().stream().noneMatch(b -> b.getName().equals("Streak Master"))) {
                Badge streakBadge = badgeRepository.findByName("Streak Master").orElseGet(() -> badgeRepository.save(new Badge("Streak Master", "Maintained a 3-day streak", "🔥")));
                student.getBadges().add(streakBadge);
            }
        }

        userRepository.save(student);

        return ResponseEntity.ok(savedAttempt);
    }
    
    @GetMapping("/attempts")
    public ResponseEntity<List<QuizAttempt>> getMyAttempts() {
        User student = getCurrentUser();
        return ResponseEntity.ok(attemptRepository.findByUserId(student.getId()));
    }
}
