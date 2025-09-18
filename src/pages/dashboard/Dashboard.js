import React, { useState, useEffect } from "react";
import { generatePetInsights } from "../../utils/analytics";

const Dashboard = () => {
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedCheckin, setHasCompletedCheckin] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [todaysCheckinData, setTodaysCheckinData] = useState(null); // NEW - store today's existing data
  const [savingCheckin, setSavingCheckin] = useState(false); // NEW - loading state
  const [funFacts] = useState([
    "One tablespoon of peanut butter for dogs is like a human eating 2½ hamburgers! Use sparingly as treats.",
    "Dogs can burn 300-400 calories per hour during active play - similar to a human jogging!",
    "Cats sleep 12-16 hours a day to conserve energy for hunting, even indoor cats maintain this pattern.",
    "A dog's sense of smell is 10,000 to 100,000 times stronger than humans - that's why they love sniffing everything!",
    "Proper hydration is key: dogs need about 1 ounce of water per pound of body weight daily.",
  ]);
  const [currentFactIndex] = useState(Math.floor(Math.random() * 5));
  const [insights, setInsights] = useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Check-in form data
  const [checkinData, setCheckinData] = useState({
    meals: [],
    snacks: [],
    elimination: {
      poos: 0,
      pees: 0,
      vomit: false,
      diarrhea: false,
      blood: false,
      other: "",
    },
    exercise: 2,
    mood: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Food search states
  const [foodSearch, setFoodSearch] = useState("");
  const [snackSearch, setSnackSearch] = useState("");

  // Sample data (would come from your database)
  const [recentFoods] = useState([
    "Royal Canin Adult Dry Food",
    "Blue Buffalo Chicken",
    "Hill's Science Diet",
    "Wellness Core",
    "Purina Pro Plan",
  ]);

  const [recentSnacks] = useState([
    "Dental Chews",
    "Training Treats",
    "Bully Stick",
    "Peanut Butter Kong",
    "Fish Oil Supplement",
  ]);

  // Modal configuration
  const sections = [
    { id: "meals", title: "Meals", icon: "🍽️" },
    { id: "snacks", title: "Snacks & Supplements", icon: "🦴" },
    { id: "elimination", title: "Elimination", icon: "💩" },
    { id: "exercise", title: "Exercise", icon: "🏃" },
    { id: "mood", title: "Mood", icon: "😊" },
  ];

  const exerciseLabels = [
    "Not at all",
    "Light",
    "Moderate",
    "Active",
    "Above Average",
  ];
  const moodOptions = [
    { id: "happy", label: "Happy", emoji: "😊" },
    { id: "content", label: "Content", emoji: "😌" },
    { id: "anxious", label: "Anxious", emoji: "😰" },
    { id: "lethargic", label: "Lethargic", emoji: "😴" },
    { id: "playful", label: "Playful", emoji: "🤗" },
    { id: "irritable", label: "Irritable", emoji: "😤" },
  ];

  useEffect(() => {
    loadPetData();
    checkTodaysCheckin();
  }, []);

  const loadPetData = async () => {
    try {
      const petId = localStorage.getItem("currentPetId");
      if (!petId) {
        window.location.href = "/";
        return;
      }

      const { db } = await import("../../firebase");
      const { doc, getDoc } = await import("firebase/firestore");

      const docRef = doc(db, "pets", petId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPetData(docSnap.data());
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error loading pet data:", error);
    } finally {
      setLoading(false);
    }
  };

  // NEW - Updated to check Firestore for today's check-in
  const checkTodaysCheckin = async () => {
    try {
      const petId = localStorage.getItem("currentPetId");
      if (!petId) return;

      const today = new Date().toISOString().split("T")[0];

      const { db } = await import("../../firebase");
      const { collection, query, where, getDocs, orderBy, limit } =
        await import("firebase/firestore");

      // Query for today's check-in
      const q = query(
        collection(db, "checkins"),
        where("petId", "==", petId),
        where("date", "==", today),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Found today's check-in
        const checkinDoc = querySnapshot.docs[0];
        const existingData = checkinDoc.data();

        setHasCompletedCheckin(true);
        setTodaysCheckinData({ id: checkinDoc.id, ...existingData });

        // Pre-populate form with existing data if user wants to edit
        setCheckinData({
          meals: existingData.meals || [],
          snacks: existingData.snacks || [],
          elimination: existingData.elimination || {
            poos: 0,
            pees: 0,
            vomit: false,
            diarrhea: false,
            blood: false,
            other: "",
          },
          exercise: existingData.exercise || 2,
          mood: existingData.mood || "",
          notes: existingData.notes || "",
          date: today,
        });
      } else {
        setHasCompletedCheckin(false);
        setTodaysCheckinData(null);
      }
    } catch (error) {
      console.error("Error checking today's check-in:", error);
      // Fallback to not completed if there's an error
      setHasCompletedCheckin(false);
    }
  };

  const handleOpenCheckin = () => {
    setShowCheckin(true);
    setCurrentSection(0);
  };

  const handleLogActivity = (type) => {
    alert(`Logging ${type} - Feature coming soon!`);
  };

  // Food/snack management functions
  const addFood = (foodName, isSnack = false) => {
    const newItem = {
      id: Date.now(),
      name: foodName,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: "1 cup",
    };

    if (isSnack) {
      setCheckinData((prev) => ({
        ...prev,
        snacks: [...prev.snacks, newItem],
      }));
      setSnackSearch("");
    } else {
      setCheckinData((prev) => ({
        ...prev,
        meals: [...prev.meals, newItem],
      }));
      setFoodSearch("");
    }
  };

  const removeFood = (id, isSnack = false) => {
    if (isSnack) {
      setCheckinData((prev) => ({
        ...prev,
        snacks: prev.snacks.filter((item) => item.id !== id),
      }));
    } else {
      setCheckinData((prev) => ({
        ...prev,
        meals: prev.meals.filter((item) => item.id !== id),
      }));
    }
  };

  // Elimination management
  const updateElimination = (type, increment) => {
    setCheckinData((prev) => ({
      ...prev,
      elimination: {
        ...prev.elimination,
        [type]: Math.max(0, prev.elimination[type] + increment),
      },
    }));
  };

  const toggleSpecialElimination = (type) => {
    setCheckinData((prev) => ({
      ...prev,
      elimination: {
        ...prev.elimination,
        [type]: !prev.elimination[type],
      },
    }));
  };

  // NEW - Updated save function with real Firestore integration
  const saveCheckin = async () => {
    try {
      setSavingCheckin(true);
      const petId = localStorage.getItem("currentPetId");
      if (!petId) {
        throw new Error("No pet ID found");
      }

      const { db } = await import("../../firebase");
      const { collection, addDoc, doc, updateDoc } = await import(
        "firebase/firestore"
      );

      const checkinToSave = {
        petId,
        ...checkinData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (todaysCheckinData?.id) {
        // Update existing check-in
        const docRef = doc(db, "checkins", todaysCheckinData.id);
        await updateDoc(docRef, {
          ...checkinToSave,
          createdAt: todaysCheckinData.createdAt, // Keep original creation time
        });
        console.log("Updated existing check-in:", todaysCheckinData.id);
      } else {
        // Create new check-in
        const docRef = await addDoc(collection(db, "checkins"), checkinToSave);
        console.log("Created new check-in:", docRef.id);
      }

      setHasCompletedCheckin(true);
      setShowCheckin(false);
      setCurrentSection(0);

      // Refresh today's data
      await checkTodaysCheckin();

      alert("Daily check-in saved successfully! 🎉");
    } catch (error) {
      console.error("Error saving check-in:", error);
      alert("Error saving check-in. Please try again.");
    } finally {
      setSavingCheckin(false);
    }
  };

  const loadInsights = async () => {
    try {
      setLoadingInsights(true);
      const petId = localStorage.getItem("currentPetId");
      if (!petId) return;

      const generatedInsights = await generatePetInsights(petId);
      setInsights(generatedInsights);
      setShowInsights(true);
      console.log("Generated insights:", generatedInsights); // For debugging
    } catch (error) {
      console.error("Error loading insights:", error);
      alert("Error loading insights: " + error.message);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Daily Check-in Button Component
  const DailyCheckinButton = () => {
    if (hasCompletedCheckin) {
      return (
        <div
          style={{
            background: "#d1fae5",
            border: "1px solid #a7f3d0",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "#10b981",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                }}
              >
                <span style={{ color: "white", fontSize: "18px" }}>✓</span>
              </div>
              <div>
                <div style={{ fontWeight: "600", color: "#047857" }}>
                  Check-in Complete!
                </div>
                <div style={{ fontSize: "14px", color: "#065f46" }}>
                  {todaysCheckinData?.createdAt
                    ? `Completed at ${new Date(
                        todaysCheckinData.createdAt.toDate()
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "Great job tracking today"}
                </div>
              </div>
            </div>
            <button
              onClick={handleOpenCheckin}
              style={{
                color: "#059669",
                fontSize: "14px",
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View/Edit
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={handleOpenCheckin}
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0px)";
          e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "24px", marginRight: "12px" }}>📅</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "600", fontSize: "16px" }}>
                Daily Check-in
              </div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                Track your pet's day
              </div>
            </div>
          </div>
          <span style={{ fontSize: "24px" }}>📝</span>
        </div>
      </button>
    );
  };

  const InsightsButton = () => {
    return (
      <button
        onClick={loadInsights}
        disabled={loadingInsights}
        style={{
          width: "100%",
          background: loadingInsights
            ? "#9ca3af"
            : "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          cursor: loadingInsights ? "not-allowed" : "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={(e) => {
          if (!loadingInsights) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
          }
        }}
        onMouseOut={(e) => {
          if (!loadingInsights) {
            e.target.style.transform = "translateY(0px)";
            e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "24px", marginRight: "12px" }}>🧠</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "600", fontSize: "16px" }}>
                {loadingInsights ? "Loading..." : "View Insights"}
              </div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                {loadingInsights
                  ? "Analyzing data..."
                  : "See personalized analytics"}
              </div>
            </div>
          </div>
          <span style={{ fontSize: "24px" }}>📊</span>
        </div>
      </button>
    );
  };

  const InsightsModal = () => {
    if (!showInsights) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1f2937",
                  }}
                >
                  🧠 Pet Insights
                </h2>
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                  Personalized analytics for {petData?.name}
                </p>
              </div>
              <button
                onClick={() => setShowInsights(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: "24px",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {insights.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6b7280" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📈</div>
                <p>
                  No insights available yet. Complete more daily check-ins to
                  unlock personalized analytics!
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      border: "2px solid",
                      borderColor:
                        insight.priority === "urgent"
                          ? "#ef4444"
                          : insight.priority === "high"
                          ? "#f59e0b"
                          : insight.priority === "medium"
                          ? "#3b82f6"
                          : insight.priority === "positive"
                          ? "#10b981"
                          : "#6b7280",
                      borderRadius: "12px",
                      padding: "16px",
                      background:
                        insight.priority === "urgent"
                          ? "#fef2f2"
                          : insight.priority === "high"
                          ? "#fffbeb"
                          : insight.priority === "medium"
                          ? "#eff6ff"
                          : insight.priority === "positive"
                          ? "#f0fdf4"
                          : "#f9fafb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div style={{ fontSize: "24px", flexShrink: 0 }}>
                        {insight.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: "600",
                            marginBottom: "4px",
                            color: "#1f2937",
                          }}
                        >
                          {insight.title}
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "#4b5563",
                            marginBottom: "8px",
                            lineHeight: "1.4",
                          }}
                        >
                          {insight.message}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6b7280",
                            fontStyle: "italic",
                            lineHeight: "1.4",
                          }}
                        >
                          💡 {insight.recommendation}
                        </div>
                        {insight.dataPoints && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#9ca3af",
                              marginTop: "8px",
                            }}
                          >
                            Based on {insight.dataPoints} days of data
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: "24px", borderTop: "1px solid #e5e7eb" }}>
            <button
              onClick={() => setShowInsights(false)}
              style={{
                width: "100%",
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Food Section Component
  const FoodSection = ({ isSnack = false }) => {
    const searchValue = isSnack ? snackSearch : foodSearch;
    const setSearchValue = isSnack ? setSnackSearch : setFoodSearch;
    const items = isSnack ? checkinData.snacks : checkinData.meals;
    const recentItems = isSnack ? recentSnacks : recentFoods;

    return (
      <div style={{ marginBottom: "20px" }}>
        {/* Search Bar */}
        <div style={{ position: "relative", marginBottom: "15px" }}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 45px 12px 40px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
            placeholder={`Search ${isSnack ? "treats/supplements" : "food"}...`}
          />
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
              fontSize: "18px",
            }}
          >
            🔍
          </span>
          <button
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            📱
          </button>
        </div>

        {/* Add Button */}
        {searchValue && (
          <button
            onClick={() => addFood(searchValue, isSnack)}
            style={{
              width: "100%",
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              cursor: "pointer",
            }}
          >
            Add "{searchValue}"
          </button>
        )}

        {/* Recent Items */}
        <div style={{ marginBottom: "15px" }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>
            Recent {isSnack ? "Treats" : "Foods"}
          </h4>
          <div style={{ display: "grid", gap: "8px" }}>
            {recentItems.map((item, index) => (
              <button
                key={index}
                onClick={() => addFood(item, isSnack)}
                style={{
                  textAlign: "left",
                  padding: "10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Added Items */}
        {items.length > 0 && (
          <div>
            <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>
              Today's {isSnack ? "Treats" : "Meals"}
            </h4>
            <div style={{ display: "grid", gap: "8px" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f9fafb",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "500" }}>{item.name}</div>
                    <div style={{ fontSize: "14px", color: "#6b7280" }}>
                      {item.time} • {item.amount}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFood(item.id, isSnack)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
        }}
      >
        Loading your pet's profile...
      </div>
    );
  }

  if (!petData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
        }}
      >
        Pet not found. Redirecting...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF6B6B, #4ECDC4)",
          color: "white",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
          🐾 PawTracker
        </h1>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Pet Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            borderRadius: "16px",
            padding: "20px",
            color: "white",
            marginBottom: "20px",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "700", marginBottom: "5px" }}
          >
            {petData.petType === "dog" ? "🐕" : "🐱"} {petData.name}
          </div>
          <div style={{ opacity: 0.9, fontSize: "14px" }}>
            {petData.breed} • {petData.age} • {petData.weight}
          </div>
        </div>

        {/* Daily Check-in Button */}
        <DailyCheckinButton />

        {/* Insights Button */}
        <InsightsButton />

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "15px",
            margin: "20px 0",
          }}
        >
          <button
            onClick={() => handleLogActivity("food")}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0px)")}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🍽️</div>
            <div>Log Food</div>
          </button>

          <button
            onClick={() => handleLogActivity("activity")}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0px)")}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🏃</div>
            <div>{petData.petType === "dog" ? "Log Walk" : "Log Play"}</div>
          </button>

          <button
            onClick={() => handleLogActivity("water")}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0px)")}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>💧</div>
            <div>Log Water</div>
          </button>

          <button
            onClick={() => handleLogActivity("bathroom")}
            style={{
              background: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0px)")}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🚽</div>
            <div>
              {petData.petType === "dog" ? "Bathroom Log" : "Litter Box"}
            </div>
          </button>
        </div>

        {/* Fun Fact Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFB74D, #FF8A65)",
            borderRadius: "16px",
            padding: "20px",
            color: "white",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "16px",
              marginBottom: "10px",
            }}
          >
            💡 Did You Know?
          </div>
          <div style={{ lineHeight: 1.4 }}>{funFacts[currentFactIndex]}</div>
        </div>

        {/* Today's Summary */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#333" }}>Today's Summary</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>Meals</span>
            <span style={{ fontWeight: "600", color: "#4ECDC4" }}>
              {todaysCheckinData?.meals?.length || 0}/2
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span>{petData.petType === "dog" ? "Exercise" : "Playtime"}</span>
            <span style={{ fontWeight: "600", color: "#4ECDC4" }}>
              {todaysCheckinData?.exercise
                ? exerciseLabels[todaysCheckinData.exercise]
                : "Not logged"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
            }}
          >
            <span>Mood</span>
            <span style={{ fontWeight: "600", color: "#4ECDC4" }}>
              {todaysCheckinData?.mood
                ? moodOptions.find((m) => m.id === todaysCheckinData.mood)
                    ?.emoji +
                  " " +
                  moodOptions.find((m) => m.id === todaysCheckinData.mood)
                    ?.label
                : "Not logged"}
            </span>
          </div>
        </div>

        {/* New Pet Button */}
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            background: "transparent",
            color: "#666",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "12px 24px",
            fontSize: "14px",
            cursor: "pointer",
            width: "100%",
            marginTop: "20px",
          }}
        >
          + Add Another Pet
        </button>
      </div>

      {/* Complete Check-in Modal */}
      {showCheckin && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "#dbeafe",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "12px",
                    }}
                  >
                    {petData.petType === "dog" ? "🐕" : "🐱"}
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#1f2937",
                      }}
                    >
                      {hasCompletedCheckin ? "Edit Check-in" : "Daily Check-in"}
                    </h2>
                    <p
                      style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}
                    >
                      {hasCompletedCheckin
                        ? "Update your pet's information"
                        : "Track your pet's day"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckin(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: "24px",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Section Tabs */}
              <div
                style={{
                  display: "flex",
                  background: "#f3f4f6",
                  borderRadius: "8px",
                  padding: "4px",
                  marginTop: "16px",
                  gap: "2px",
                }}
              >
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "8px 4px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "500",
                      border: "none",
                      cursor: "pointer",
                      background:
                        currentSection === index ? "white" : "transparent",
                      color: currentSection === index ? "#3b82f6" : "#6b7280",
                      boxShadow:
                        currentSection === index
                          ? "0 1px 2px rgba(0,0,0,0.05)"
                          : "none",
                    }}
                  >
                    <div style={{ fontSize: "16px" }}>{section.icon}</div>
                    <div
                      style={{
                        display: window.innerWidth > 640 ? "block" : "none",
                        marginTop: "2px",
                      }}
                    >
                      {section.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              {/* Meals Section */}
              {currentSection === 0 && (
                <div>
                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    🍽️ Meals
                  </h3>
                  <FoodSection />
                </div>
              )}

              {/* Snacks Section */}
              {currentSection === 1 && (
                <div>
                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    🦴 Snacks & Supplements
                  </h3>
                  <FoodSection isSnack={true} />
                </div>
              )}

              {/* Elimination Section */}
              {currentSection === 2 && (
                <div>
                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    💩 Elimination
                  </h3>

                  {/* Counters */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        background: "#f9fafb",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                        💩
                      </div>
                      <div
                        style={{
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "12px",
                        }}
                      >
                        Poos
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "16px",
                        }}
                      >
                        <button
                          onClick={() => updateElimination("poos", -1)}
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            minWidth: "32px",
                          }}
                        >
                          {checkinData.elimination.poos}
                        </span>
                        <button
                          onClick={() => updateElimination("poos", 1)}
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "#dcfce7",
                            color: "#16a34a",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#f9fafb",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                        💧
                      </div>
                      <div
                        style={{
                          fontWeight: "500",
                          color: "#374151",
                          marginBottom: "12px",
                        }}
                      >
                        Pees
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "16px",
                        }}
                      >
                        <button
                          onClick={() => updateElimination("pees", -1)}
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            minWidth: "32px",
                          }}
                        >
                          {checkinData.elimination.pees}
                        </span>
                        <button
                          onClick={() => updateElimination("pees", 1)}
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "#dcfce7",
                            color: "#16a34a",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Special Conditions */}
                  <div>
                    <h4
                      style={{
                        margin: "0 0 12px 0",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Any concerns today?
                    </h4>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {[
                        { key: "vomit", label: "Vomiting", emoji: "🤮" },
                        { key: "diarrhea", label: "Diarrhea", emoji: "💩" },
                        {
                          key: "blood",
                          label: "Blood in stool/urine",
                          emoji: "🩸",
                        },
                      ].map((condition) => (
                        <label
                          key={condition.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                            padding: "8px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checkinData.elimination[condition.key]}
                            onChange={() =>
                              toggleSpecialElimination(condition.key)
                            }
                            style={{ width: "20px", height: "20px" }}
                          />
                          <span style={{ fontSize: "20px" }}>
                            {condition.emoji}
                          </span>
                          <span style={{ fontWeight: "500" }}>
                            {condition.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Exercise Section */}
              {currentSection === 3 && (
                <div>
                  <h3
                    style={{
                      margin: "0 0 24px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    🏃 Exercise
                  </h3>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "8px",
                      }}
                    >
                      <span>Not at all</span>
                      <span>Above Average</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      value={checkinData.exercise}
                      onChange={(e) =>
                        setCheckinData((prev) => ({
                          ...prev,
                          exercise: parseInt(e.target.value),
                        }))
                      }
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "#e5e7eb",
                        borderRadius: "4px",
                        outline: "none",
                        marginBottom: "12px",
                      }}
                    />
                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#3b82f6",
                        }}
                      >
                        {exerciseLabels[checkinData.exercise]}
                      </span>
                    </div>

                    <div
                      style={{
                        background: "#eff6ff",
                        borderRadius: "8px",
                        padding: "16px",
                      }}
                    >
                      <div style={{ fontSize: "14px", color: "#1e40af" }}>
                        {checkinData.exercise === 0 &&
                          "No exercise today - just rest and indoor activities"}
                        {checkinData.exercise === 1 &&
                          "Light activity - short walk or gentle play"}
                        {checkinData.exercise === 2 &&
                          "Moderate exercise - regular walk and some play"}
                        {checkinData.exercise === 3 &&
                          "Active day - long walk, fetch, or vigorous play"}
                        {checkinData.exercise === 4 &&
                          "Above average - hiking, running, or intense exercise"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mood Section */}
              {currentSection === 4 && (
                <div>
                  <h3
                    style={{
                      margin: "0 0 24px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    😊 Mood
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() =>
                          setCheckinData((prev) => ({ ...prev, mood: mood.id }))
                        }
                        style={{
                          padding: "16px",
                          borderRadius: "12px",
                          border: "2px solid",
                          borderColor:
                            checkinData.mood === mood.id
                              ? "#3b82f6"
                              : "#e5e7eb",
                          background:
                            checkinData.mood === mood.id ? "#eff6ff" : "white",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                          {mood.emoji}
                        </div>
                        <div style={{ fontWeight: "500" }}>{mood.label}</div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Additional notes (optional)
                    </label>
                    <textarea
                      value={checkinData.notes}
                      onChange={(e) =>
                        setCheckinData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        resize: "vertical",
                        minHeight: "80px",
                        boxSizing: "border-box",
                      }}
                      placeholder="Any other observations about your pet today?"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "24px", borderTop: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                {currentSection > 0 && (
                  <button
                    onClick={() => setCurrentSection(currentSection - 1)}
                    style={{
                      padding: "8px 16px",
                      border: "1px solid #d1d5db",
                      color: "#6b7280",
                      background: "white",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Previous
                  </button>
                )}
                {currentSection < sections.length - 1 ? (
                  <button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    style={{
                      flex: 1,
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={saveCheckin}
                    disabled={savingCheckin}
                    style={{
                      flex: 1,
                      background: savingCheckin ? "#9ca3af" : "#10b981",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: savingCheckin ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {savingCheckin ? (
                      <>
                        <span>⏳</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span>✓</span>
                        {hasCompletedCheckin
                          ? "Update Check-in"
                          : "Complete Check-in"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Modal */}
      <InsightsModal />
    </div>
  );
};

export default Dashboard;
