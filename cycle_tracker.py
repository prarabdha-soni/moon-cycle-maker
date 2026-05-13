"""
Cycle & Pregnancy Tracker Engine
--------------------------------
Features:
1. Conceive (Clue-like): 
   - Base fertility/ovulation on Cycle Dates only.
   - Advanced fertility/ovulation on BBT + LH + Cervical Mucus.
2. Pregnant (Flo-like):
   - Day-by-day content for 280 days (Week/Day cards, baby size, symptoms, tips).
   - Starts from Last Menstrual Period (LMP).
"""

from datetime import date, timedelta
from typing import List, Dict, Optional, Tuple
import math

# ==============================================================================
# PART 1: CONCEIVE ENGINE (Fertility & Ovulation)
# ==============================================================================

class ConceiveEngine:
    def __init__(self, cycle_lengths: List[int]):
        """
        Initialize with a list of past cycle lengths (e.g., [28, 30, 29, 28]).
        """
        if not cycle_lengths or len(cycle_lengths) < 1:
            raise ValueError("At least one cycle length is required.")
        self.cycle_lengths = cycle_lengths
        self.avg_cycle = sum(cycle_lengths) / len(cycle_lengths)
        self.std_dev = self._calculate_std_dev()

    def _calculate_std_dev(self) -> float:
        if len(self.cycle_lengths) < 2:
            return 0.0
        mean = self.avg_cycle
        variance = sum((x - mean) ** 2 for x in self.cycle_lengths) / len(self.cycle_lengths)
        return math.sqrt(variance)

    def get_calendar_based_prediction(self, last_lmp: date) -> Dict:
        """
        Predicts ovulation and fertile window based SOLELY on historical cycle dates.
        Logic: Ovulation ~ 14 days before next expected period.
        Fertile Window: 5 days before ovulation + 1 day after.
        """
        # Expected next period
        expected_next_period = last_lmp + timedelta(days=int(round(self.avg_cycle)))
        
        # Estimated Ovulation Day (EOD) = Next Period - 14 days
        estimated_ovulation = expected_next_period - timedelta(days=14)
        
        # Fertile Window: Sperm survives up to 5 days, Egg 12-24h.
        # We open window 5 days prior, close 1 day post.
        fertile_start = estimated_ovulation - timedelta(days=5)
        fertile_end = estimated_ovulation + timedelta(days=1)
        
        # Confidence interval based on standard deviation
        margin = int(math.ceil(self.std_dev))
        
        return {
            "method": "Calendar Only",
            "last_lmp": last_lmp,
            "avg_cycle_length": round(self.avg_cycle, 1),
            "estimated_ovulation": estimated_ovulation,
            "fertile_window_start": fertile_start,
            "fertile_window_end": fertile_end,
            "uncertainty_margin_days": margin,
            "next_period_estimate": expected_next_period
        }

    def get_symptothermal_prediction(self, last_lmp: date, 
                                     bbt_chart: Dict[date, float], 
                                     lh_tests: Dict[date, bool], 
                                     mucus_obs: Dict[date, str]) -> Dict:
        """
        Refines prediction using BBT, LH, and Cervical Mucus.
        
        Inputs:
        - bbt_chart: {date: temp_in_celsius}
        - lh_tests: {date: is_positive_boolean}
        - mucus_obs: {date: type_string} ('dry', 'sticky', 'creamy', 'eggwhite')
        
        Logic:
        1. LH Surge identifies imminent ovulation (24-36h later).
        2. Eggwhite Mucus identifies high fertility days.
        3. BBT Thermal Shift confirms ovulation HAS occurred (retroactive confirmation).
        """
        
        # 1. Detect LH Surge
        lh_surge_date = None
        sorted_lh_dates = sorted(lh_tests.keys())
        for d in sorted_lh_dates:
            if lh_tests[d]:
                lh_surge_date = d
                break # Take first positive
        
        # 2. Detect Peak Mucus (Last day of Eggwhite)
        peak_mucus_date = None
        sorted_mucus_dates = sorted(mucus_obs.keys())
        last_ew_date = None
        for d in sorted_mucus_dates:
            if mucus_obs[d] == 'eggwhite':
                last_ew_date = d
        peak_mucus_date = last_ew_date

        # 3. Detect BBT Shift (Confirmation)
        # Look for 3 consecutive temps higher than previous 6 low temps
        confirmed_ovulation_date = None
        sorted_bbt_dates = sorted(bbt_chart.keys())
        if len(sorted_bbt_dates) >= 9:
            # Simple shift detection algorithm
            for i in range(6, len(sorted_bbt_dates)):
                window_low = sorted_bbt_dates[i-6:i]
                current_high = sorted_bbt_dates[i]
                
                avg_low = sum(bbt_chart[d] for d in window_low) / 6
                if bbt_chart[current_high] > (avg_low + 0.2): # 0.2C shift threshold
                    # Check if next 2 days also sustain (simplified here to just finding the shift point)
                    # In strict symptothermal, ovulation is confirmed the evening of the 3rd high temp.
                    # Here we estimate the shift happened just before the first high temp.
                    confirmed_ovulation_date = current_high - timedelta(days=1)
                    break

        # Synthesize Results
        predicted_ovulation = None
        fertile_start = last_lmp # Default fallback
        fertile_end = last_lmp
        
        status = "Pre-Ovulatory"
        
        if confirmed_ovulation_date:
            predicted_ovulation = confirmed_ovulation_date
            status = "Post-Ovulatory (Confirmed)"
            fertile_end = confirmed_ovulation_date + timedelta(days=1)
            # Start was likely 5 days before the earliest indicator
            earliest_indicator = last_lmp
            if lh_surge_date: earliest_indicator = min(earliest_indicator, lh_surge_date)
            if peak_mucus_date: earliest_indicator = min(earliest_indicator, peak_mucus_date)
            fertile_start = predicted_ovulation - timedelta(days=5)
            
        elif lh_surge_date:
            # Surge detected, ovulation expected in 24-36h
            predicted_ovulation = lh_surge_date + timedelta(days=1)
            status = "Imminent Ovulation (LH Detected)"
            fertile_start = lh_surge_date - timedelta(days=4)
            fertile_end = predicted_ovulation + timedelta(days=1)
            
        elif peak_mucus_date:
            # No surge test, but fertile mucus present
            # Estimate ovulation shortly after peak
            predicted_ovulation = peak_mucus_date + timedelta(days=1)
            status = "High Fertility (Mucus Detected)"
            fertile_start = peak_mucus_date - timedelta(days=4)
            fertile_end = predicted_ovulation + timedelta(days=1)
            
        else:
            # Fall back to calendar if no symptoms yet
            calendar_pred = self.get_calendar_based_prediction(last_lmp)
            predicted_ovulation = calendar_pred['estimated_ovulation']
            fertile_start = calendar_pred['fertile_window_start']
            fertile_end = calendar_pred['fertile_window_end']
            status = "Estimated (Calendar)"

        return {
            "method": "Symptothermal (BBT+LH+Mucus)",
            "status": status,
            "predicted_ovulation": predicted_ovulation,
            "fertile_window_start": fertile_start,
            "fertile_window_end": fertile_end,
            "indicators": {
                "lh_surge_date": lh_surge_date,
                "peak_mucus_date": peak_mucus_date,
                "confirmed_by_bbt": confirmed_ovulation_date is not None
            }
        }

# ==============================================================================
# PART 2: PREGNANCY ENGINE (Day-by-Day Content)
# ==============================================================================

class PregnancyContentGenerator:
    def __init__(self, lmp: date):
        self.lmp = lmp
        self.due_date = lmp + timedelta(days=280)
        self.today = date.today()
        
        # Baby Size Mapping (Week -> Fruit/Veg/Object)
        self.baby_sizes = {
            1: "Poppy Seed", 2: "Poppy Seed", 3: "Blueberry", 4: "Poppy Seed", # Actually very small early on
            5: "Sesame Seed", 6: "Sweet Pea", 7: "Blueberry", 8: "Raspberry",
            9: "Cherry", 10: "Strawberry", 11: "Fig", 12: "Plum",
            13: "Lemon", 14: "Peach", 15: "Apple", 16: "Avocado",
            17: "Onion", 18: "Bell Pepper", 19: "Tomato", 20: "Banana",
            21: "Carrot", 22: "Spaghetti Squash", 23: "Grapefruit", 24: "Ear of Corn",
            25: "Cauliflower", 26: "Head of Lettuce", 27: "Head of Cauliflower", 28: "Eggplant",
            29: "Butternut Squash", 30: "Cantaloupe", 31: "Coconut", 32: "Jicama",
            33: "Pineapple", 34: "Cantaloupe", 35: "Honeydew Melon", 36: "Papaya",
            37: "Swiss Chard", 38: "Leek", 39: "Watermelon", 40: "Pumpkin", 41: "Watermelon"
        }
        
        # General Symptoms by Trimester/Week ranges
        self.symptom_db = {
            (1, 4): ["Fatigue", "Breast tenderness", "Mood swings", "Mild cramping"],
            (5, 8): ["Morning sickness", "Food aversions", "Frequent urination", "Bloating"],
            (9, 12): ["Nausea peaks", "Visible vein growth", "Constipation", "Dizziness"],
            (13, 16): ["Energy returns", "Reduced nausea", "Round ligament pain", "Show (bump)"],
            (17, 20): ["Backache", "Leg cramps", "Feeling movement (Quickening)", "Skin changes"],
            (21, 24): ["Braxton Hicks", "Swelling (edema)", "Stretch marks", "Heartburn"],
            (25, 28): ["Shortness of breath", "Hemorrhoids", "Insomnia", "Colostrum leakage"],
            (29, 32): ["Increased Braxton Hicks", "Anxiety", "Nesting instinct begins", "Pelvic pressure"],
            (33, 36): ["Difficulty sleeping", "Lightning crotch", "Drop (lightening)", "Leakage"],
            (37, 42): ["Extreme fatigue", "Contractions", "Mucus plug loss", "Impatience"]
        }

        # Tips by Trimester
        self.tips_db = {
            (1, 12): ["Start prenatal vitamins with Folic Acid", "Stay hydrated to combat nausea", "Avoid raw fish and unpasteurized cheese", "Rest whenever possible."],
            (13, 26): ["Sleep on your side", "Wear comfortable shoes", "Sign up for childbirth classes", "Start researching pediatricians"],
            (27, 42): ["Pack your hospital bag", "Install the car seat", "Practice breathing techniques", "Freeze meals for postpartum"]
        }

        # Developmental Milestones
        self.milestones = {
            4: "Neural tube closes; heart begins beating.",
            8: "All major organs formed; fingers and toes appear.",
            12: "Reflexes begin; can make a fist.",
            16: "Muscles developing; can suck thumb.",
            20: "Vernix covers skin; can hear sounds.",
            24: "Lungs developing surfactant; eyes opening.",
            28: "Brain activity increases; can regulate temp slightly.",
            32: "Fingernails fully formed; practicing breathing.",
            36: "Lungs nearly mature; turning head down.",
            40: "Fully developed; ready for birth."
        }

    def get_week_number(self, current_date: date) -> int:
        delta = current_date - self.lmp
        days_pregnant = delta.days
        if days_pregnant < 0: return 0
        return (days_pregnant // 7) + 1

    def get_day_number(self, current_date: date) -> int:
        delta = current_date - self.lmp
        return delta.days + 1

    def _get_content_for_week(self, week: int) -> Dict:
        # Find matching symptom range
        symptoms = []
        for (start, end), syms in self.symptom_db.items():
            if start <= week <= end:
                symptoms = syms
                break
        
        # Find matching tips range
        tips = []
        for (start, end), t in self.tips_db.items():
            if start <= week <= end:
                tips = t
                break
                
        size = self.baby_sizes.get(week, "Watermelon")
        milestone = self.milestones.get(week, "Continuing growth and development.")
        
        # Trimester calculation
        trimester = 1
        if week > 13: trimester = 2
        if week > 26: trimester = 3
        
        return {
            "week": week,
            "trimester": trimester,
            "baby_size": size,
            "symptoms": symptoms,
            "tips": tips,
            "milestone": milestone
        }

    def generate_full_timeline(self) -> List[Dict]:
        """Generates data for all 280 days."""
        timeline = []
        current_date = self.lmp
        
        for day_offset in range(281): # 0 to 280
            target_date = self.lmp + timedelta(days=day_offset)
            week = self.get_week_number(target_date)
            day_in_week = (day_offset % 7) + 1
            
            content = self._get_content_for_week(week)
            
            day_entry = {
                "date": target_date.isoformat(),
                "day_of_pregnancy": day_offset + 1, # Day 1 is LMP
                "week_of_pregnancy": week,
                "day_of_week_card": f"Day {day_in_week} of Week {week}",
                "content": content
            }
            timeline.append(day_entry)
            
        return timeline

    def get_today_card(self) -> Optional[Dict]:
        """Gets the specific card for today."""
        days_pregnant = (self.today - self.lmp).days
        if days_pregnant < 0 or days_pregnant > 280:
            return None
        
        week = self.get_week_number(self.today)
        content = self._get_content_for_week(week)
        
        return {
            "date": self.today.isoformat(),
            "day_of_pregnancy": days_pregnant + 1,
            "week_of_pregnancy": week,
            "days_remaining": 280 - days_pregnant,
            "due_date": self.due_date.isoformat(),
            "content": content
        }

# ==============================================================================
# DEMO / USAGE EXAMPLE
# ==============================================================================

if __name__ == "__main__":
    print("--- CYCLE & PREGNANCY TRACKER DEMO ---\n")

    # 1. SETUP DATA
    today = date.today()
    
    # Scenario A: Conceive Mode
    print("1. CONCEIVE MODE (Fertility Prediction)")
    print("-" * 30)
    
    # User has cycles of 28, 29, 28, 30 days
    engine = ConceiveEngine([28, 29, 28, 30])
    last_lmp = today - timedelta(days=10) # Started 10 days ago
    
    # A1. Calendar Only Prediction
    cal_pred = engine.get_calendar_based_prediction(last_lmp)
    print(f"[Calendar Method]")
    print(f"  Avg Cycle: {cal_pred['avg_cycle_length']} days")
    print(f"  Est. Ovulation: {cal_pred['estimated_ovulation']}")
    print(f"  Fertile Window: {cal_pred['fertile_window_start']} to {cal_pred['fertile_window_end']}")
    
    # A2. Symptothermal Prediction (Simulating user inputting data for last few days)
    # Simulate: Today is Day 10. LH turned positive yesterday. Mucus is eggwhite today.
    bbt_data = {
        last_lmp + timedelta(days=i): 36.4 + (0.3 if i > 12 else 0) # Shift happens later usually
        for i in range(15)
    }
    lh_data = {
        last_lmp + timedelta(days=9): False,
        last_lmp + timedelta(days=10): True, # Positive today
    }
    mucus_data = {
        last_lmp + timedelta(days=8): "sticky",
        last_lmp + timedelta(days=9): "creamy",
        last_lmp + timedelta(days=10): "eggwhite",
    }
    
    symp_pred = engine.get_symptothermal_prediction(last_lmp, bbt_data, lh_data, mucus_data)
    print(f"\n[Symptothermal Method]")
    print(f"  Status: {symp_pred['status']}")
    print(f"  Refined Ovulation Estimate: {symp_pred['predicted_ovulation']}")
    print(f"  Indicators: LH Surge={symp_pred['indicators']['lh_surge_date']}, Peak Mucus={symp_pred['indicators']['peak_mucus_date']}")

    print("\n" + "="*50 + "\n")

    # Scenario B: Pregnant Mode
    print("2. PREGNANT MODE (Day-by-Day Content)")
    print("-" * 30)
    
    # User conceived 2 months ago (approx 60 days ago), so LMP was ~74 days ago (assuming 28 day cycle conception at day 14)
    pregnant_lmp = today - timedelta(days=74) 
    preg_engine = PregnancyContentGenerator(pregnant_lmp)
    
    # Get Today's Card
    today_card = preg_engine.get_today_card()
    if today_card:
        c = today_card['content']
        print(f"TODAY: Week {today_card['week_of_pregnancy']}, Day {today_card['day_of_pregnancy']}")
        print(f"  Baby Size: {c['baby_size']}")
        print(f"  Trimester: {c['trimester']}")
        print(f"  Milestone: {c['milestone']}")
        print(f"  Common Symptoms: {', '.join(c['symptoms'])}")
        print(f"  Tip: {c['tips'][0]}")
        print(f"  Due Date: {today_card['due_date']} ({today_card['days_remaining']} days left)")
    
    # Generate Full Timeline Sample (First 3 days of Week 1, and Today)
    print(f"\n[Timeline Sample Generation...]")
    timeline = preg_engine.generate_full_timeline()
    print(f"Total days generated: {len(timeline)}")
    print(f"Sample Entry (Day 1): {timeline[0]['date']} - Week {timeline[0]['week_of_pregnancy']}")
    print(f"Sample Entry (Day 280): {timeline[-1]['date']} - Week {timeline[-1]['week_of_pregnancy']}")

    print("\n--- DEMO COMPLETE ---")
