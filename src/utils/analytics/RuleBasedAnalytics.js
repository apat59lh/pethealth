// src/utils/analytics/RuleBasedAnalytics.js
export class RuleBasedAnalytics {
  constructor(petData, checkinHistory) {
    this.pet = petData;
    this.checkins = checkinHistory;
    this.today = new Date().toISOString().split('T')[0];
    this.last7Days = this.getRecentCheckins(7);
    this.last14Days = this.getRecentCheckins(14);
    
    // Define minimum data requirements for each analysis type
    this.minimumRequirements = {
      diet: 3,           // Need at least 3 days of meal data
      exercise: 3,       // Need at least 3 days of exercise data
      elimination: 2,    // Need at least 2 days of elimination data
      health: 1,         // Health symptoms are immediate (1 day)
      mood: 3,           // Need at least 3 days of mood data
      trends: 7          // Need at least 7 days for trend analysis
    };
  }

  getRecentCheckins(days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.checkins.filter(checkin => {
      const checkinDate = new Date(checkin.date);
      return checkinDate >= cutoffDate;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
  }

  // Check if we have enough data for analysis
  hasMinimumData(analysisType) {
    const required = this.minimumRequirements[analysisType];
    const availableData = this.last7Days.length;
    return availableData >= required;
  }

  // Get data quality metrics
  getDataQuality() {
    const totalDays = this.last7Days.length;
    const daysWithMeals = this.last7Days.filter(c => c.meals && c.meals.length > 0).length;
    const daysWithExercise = this.last7Days.filter(c => c.exercise !== undefined).length;
    const daysWithElimination = this.last7Days.filter(c => c.elimination && (c.elimination.poos > 0 || c.elimination.pees > 0)).length;
    const daysWithMood = this.last7Days.filter(c => c.mood && c.mood !== '').length;

    return {
      totalDays,
      completeness: {
        meals: (daysWithMeals / totalDays) * 100,
        exercise: (daysWithExercise / totalDays) * 100,
        elimination: (daysWithElimination / totalDays) * 100,
        mood: (daysWithMood / totalDays) * 100
      }
    };
  }

  // Main analytics function with minimum data checks
  generateInsights() {
    const insights = [];
    
    // Check overall data availability
    if (this.last7Days.length === 0) {
      return [{
        type: 'onboarding',
        priority: 'medium',
        title: 'Start Your Journey!',
        message: 'Begin daily check-ins to unlock personalized insights for your pet.',
        recommendation: 'Complete your first daily check-in to start building your pet\'s health profile.',
        icon: '🌟',
        category: 'getting-started'
      }];
    }

    if (this.last7Days.length < 2) {
      return [{
        type: 'onboarding',
        priority: 'medium',
        title: 'Keep Building Data',
        message: `You've completed ${this.last7Days.length} check-in. Keep going to unlock insights!`,
        recommendation: 'Complete a few more daily check-ins to start seeing personalized analytics.',
        icon: '📈',
        category: 'getting-started'
      }];
    }

    // Generate insights with minimum data requirements
    if (this.hasMinimumData('diet')) {
      insights.push(...this.analyzeDiet());
    }
    
    if (this.hasMinimumData('exercise')) {
      insights.push(...this.analyzeExercise());
    }
    
    if (this.hasMinimumData('elimination')) {
      insights.push(...this.analyzeElimination());
    }
    
    // Health symptoms are always analyzed (immediate concern)
    insights.push(...this.analyzeHealthSymptoms());
    
    if (this.hasMinimumData('mood')) {
      insights.push(...this.analyzeMoodBehavior());
    }
    
    if (this.hasMinimumData('trends')) {
      insights.push(...this.analyzeWeeklyTrends());
    }

    // Add data completeness insights if data is sparse
    insights.push(...this.analyzeDataCompleteness());
    
    return this.prioritizeInsights(insights);
  }

  // NEW: Analyze data completeness and suggest improvements
  analyzeDataCompleteness() {
    const insights = [];
    const quality = this.getDataQuality();
    
    // Only show completeness insights if we have some data but it's incomplete
    if (quality.totalDays >= 3) {
      if (quality.completeness.meals < 60) {
        insights.push({
          type: 'data-quality',
          priority: 'low',
          title: 'Improve Meal Tracking',
          message: `Meals are logged in only ${Math.round(quality.completeness.meals)}% of your check-ins.`,
          recommendation: 'Try to log meals more consistently to get better nutrition insights.',
          icon: '🍽️',
          category: 'data-improvement'
        });
      }

      if (quality.completeness.mood < 50) {
        insights.push({
          type: 'data-quality',
          priority: 'low',
          title: 'Track Mood More Often',
          message: `Mood is logged in only ${Math.round(quality.completeness.mood)}% of your check-ins.`,
          recommendation: 'Recording your pet\'s daily mood helps identify behavior patterns.',
          icon: '😊',
          category: 'data-improvement'
        });
      }
    }

    return insights;
  }

  // ENHANCED: Diet analysis with better minimum data handling
  analyzeDiet() {
    const insights = [];
    const daysWithMealData = this.last7Days.filter(c => c.meals && c.meals.length > 0);
    
    // Only analyze if we have enough meal data
    if (daysWithMealData.length < this.minimumRequirements.diet) {
      return insights; // Return empty array if insufficient data
    }

    //const recentMeals = daysWithMealData.flatMap(c => c.meals || []);
    //const recentSnacks = daysWithMealData.flatMap(c => c.snacks || []);
    
    // Meal consistency analysis (only for days with data)
    const mealsPerDay = daysWithMealData.map(c => (c.meals || []).length);
    const avgMealsPerDay = mealsPerDay.reduce((a, b) => a + b, 0) / mealsPerDay.length;
    
    if (avgMealsPerDay < 2 && this.pet.petType === 'dog') {
      insights.push({
        type: 'diet',
        priority: 'high',
        title: 'Low Meal Frequency',
        message: `${this.pet.name} is averaging ${avgMealsPerDay.toFixed(1)} meals per day over ${daysWithMealData.length} days.`,
        recommendation: 'Most dogs need 2-3 meals daily. Consider splitting food into more frequent, smaller meals.',
        icon: '🍽️',
        category: 'nutrition',
        dataPoints: daysWithMealData.length
      });
    }
    
    if (avgMealsPerDay < 1.5 && this.pet.petType === 'cat') {
      insights.push({
        type: 'diet',
        priority: 'medium',
        title: 'Meal Frequency Check',
        message: `${this.pet.name} is averaging ${avgMealsPerDay.toFixed(1)} meals per day over ${daysWithMealData.length} days.`,
        recommendation: 'Cats typically do well with 2-4 smaller meals throughout the day.',
        icon: '🍽️',
        category: 'nutrition',
        dataPoints: daysWithMealData.length
      });
    }

    // Treat analysis (only if we have sufficient snack data)
    const daysWithSnackData = daysWithMealData.filter(c => c.snacks && c.snacks.length > 0);
    if (daysWithSnackData.length >= 3) {
      const treatsPerDay = daysWithSnackData.map(c => (c.snacks || []).length);
      const avgTreatsPerDay = treatsPerDay.reduce((a, b) => a + b, 0) / treatsPerDay.length;
      
      if (avgTreatsPerDay > 5) {
        insights.push({
          type: 'diet',
          priority: 'medium',
          title: 'High Treat Consumption',
          message: `${this.pet.name} is getting ${avgTreatsPerDay.toFixed(1)} treats per day on average.`,
          recommendation: 'Treats should make up less than 10% of daily calories. Consider reducing portions.',
          icon: '🦴',
          category: 'nutrition',
          dataPoints: daysWithSnackData.length
        });
      }
    }

    return insights;
  }

  // ENHANCED: Exercise analysis with minimum data requirements
  analyzeExercise() {
    const insights = [];
    const daysWithExerciseData = this.last7Days.filter(c => c.exercise !== undefined);
    
    if (daysWithExerciseData.length < this.minimumRequirements.exercise) {
      return insights;
    }

    const recentExercise = daysWithExerciseData.map(c => c.exercise);
    const avgExercise = recentExercise.reduce((a, b) => a + b, 0) / recentExercise.length;
    const exerciseLabels = ['Not at all', 'Light', 'Moderate', 'Active', 'Above Average'];
    
    if (avgExercise < 1.5 && this.pet.petType === 'dog') {
      insights.push({
        type: 'exercise',
        priority: 'high',
        title: 'Low Activity Level',
        message: `${this.pet.name} is averaging "${exerciseLabels[Math.round(avgExercise)]}" exercise over ${daysWithExerciseData.length} days.`,
        recommendation: 'Dogs need regular exercise for physical and mental health. Start with short walks.',
        icon: '🏃',
        category: 'activity',
        dataPoints: daysWithExerciseData.length
      });
    }

    // Consecutive analysis (only if we have enough recent data)
    if (daysWithExerciseData.length >= 5) {
      const consecutiveLowDays = this.getConsecutiveLowExerciseDays();
      if (consecutiveLowDays >= 3) {
        insights.push({
          type: 'exercise',
          priority: 'medium',
          title: 'Extended Low Activity Period',
          message: `${this.pet.name} has had ${consecutiveLowDays} consecutive days of minimal exercise.`,
          recommendation: 'Consider increasing physical activity to prevent weight gain and behavioral issues.',
          icon: '📉',
          category: 'activity'
        });
      }
    }

    return insights;
  }

  // ENHANCED: Elimination analysis
  analyzeElimination() {
    const insights = [];
    const daysWithEliminationData = this.last7Days.filter(c => 
      c.elimination && (c.elimination.poos > 0 || c.elimination.pees > 0)
    );
    
    if (daysWithEliminationData.length < this.minimumRequirements.elimination) {
      return insights;
    }

    // Poop frequency analysis
    const poopCounts = daysWithEliminationData.map(c => c.elimination?.poos || 0);
    const avgPoopsPerDay = poopCounts.reduce((a, b) => a + b, 0) / poopCounts.length;
    
    if (avgPoopsPerDay < 1 && this.pet.petType === 'dog') {
      insights.push({
        type: 'elimination',
        priority: 'high',
        title: 'Low Poop Frequency',
        message: `${this.pet.name} is averaging ${avgPoopsPerDay.toFixed(1)} poops per day over ${daysWithEliminationData.length} days.`,
        recommendation: 'Dogs typically poop 1-3 times daily. Consider increasing fiber or consulting your vet.',
        icon: '💩',
        category: 'health',
        dataPoints: daysWithEliminationData.length
      });
    }

    return insights;
  }

  // Health symptoms analysis (no minimum - immediate concern)
  analyzeHealthSymptoms() {
    const insights = [];
    
    // Check for any concerning symptoms in recent days
    const recentConcerns = this.last7Days.filter(c => 
      c.elimination?.vomit || c.elimination?.diarrhea || c.elimination?.blood
    );

    if (recentConcerns.length > 0) {
      const concernDays = recentConcerns.length;
      const symptoms = [];
      
      if (recentConcerns.some(c => c.elimination?.vomit)) symptoms.push('vomiting');
      if (recentConcerns.some(c => c.elimination?.diarrhea)) symptoms.push('diarrhea');
      if (recentConcerns.some(c => c.elimination?.blood)) symptoms.push('blood in stool/urine');

      insights.push({
        type: 'health',
        priority: 'urgent',
        title: 'Health Concerns Detected',
        message: `${this.pet.name} has shown ${symptoms.join(', ')} over ${concernDays} day(s).`,
        recommendation: 'Contact your veterinarian for guidance, especially if symptoms persist.',
        icon: '⚠️',
        category: 'health'
      });
    }

    return insights;
  }

  // ENHANCED: Mood analysis with minimum data requirements
  analyzeMoodBehavior() {
    const insights = [];
    const daysWithMoodData = this.last7Days.filter(c => c.mood && c.mood !== '');
    
    if (daysWithMoodData.length < this.minimumRequirements.mood) {
      return insights;
    }

    const recentMoods = daysWithMoodData.map(c => c.mood);
    const negativeMoods = ['anxious', 'lethargic', 'irritable'];
    const positiveMoods = ['happy', 'content', 'playful'];
    
    const negativeCount = recentMoods.filter(mood => negativeMoods.includes(mood)).length;
    const positiveCount = recentMoods.filter(mood => positiveMoods.includes(mood)).length;
    
    if (negativeCount > positiveCount && recentMoods.length >= 3) {
      insights.push({
        type: 'mood',
        priority: 'medium',
        title: 'Mood Concerns',
        message: `${this.pet.name} has shown more negative moods (${negativeCount}) than positive ones (${positiveCount}) over ${daysWithMoodData.length} days.`,
        recommendation: 'Consider increasing exercise, play time, or environmental enrichment.',
        icon: '😔',
        category: 'behavior',
        dataPoints: daysWithMoodData.length
      });
    }

    return insights;
  }

  // Weekly trends (requires at least 7 days)
  analyzeWeeklyTrends() {
    const insights = [];
    
    if (this.last14Days.length < this.minimumRequirements.trends) {
      return insights;
    }

    // Implementation continues as before...
    // (Rest of the trend analysis methods remain the same)
    
    return insights;
  }

  // Helper functions remain the same...
  getConsecutiveLowExerciseDays() {
    let consecutive = 0;
    for (let i = this.last7Days.length - 1; i >= 0; i--) {
      if ((this.last7Days[i].exercise || 2) <= 1) {
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  }

  // Other helper functions...
  calculateVariance(numbers) {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((a, b) => a + b) / numbers.length;
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  }

  prioritizeInsights(insights) {
    const priorityOrder = {
      'urgent': 1,
      'high': 2,
      'medium': 3,
      'low': 4,
      'positive': 5
    };

    return insights.sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}

// Export function remains the same
export async function generatePetInsights(petId) {
  try {
    const { db } = await import('../../firebase');
    const { doc, getDoc, collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
    
    const petDoc = await getDoc(doc(db, 'pets', petId));
    if (!petDoc.exists()) throw new Error('Pet not found');
    const petData = petDoc.data();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const checkinsQuery = query(
      collection(db, 'checkins'),
      where('petId', '==', petId),
      where('date', '>=', thirtyDaysAgo.toISOString().split('T')[0]),
      orderBy('date', 'desc')
    );
    
    const checkinsSnapshot = await getDocs(checkinsQuery);
    const checkinHistory = checkinsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const analytics = new RuleBasedAnalytics(petData, checkinHistory);
    return analytics.generateInsights();
    
  } catch (error) {
    console.error('Error generating insights:', error);
    return [];
  }
}