from flask import Flask, render_template_string, request, jsonify, session
import json
import os
from datetime import datetime, timedelta
import math

# --- Configuration & Data ---
APP = Flask(__name__)
APP.secret_key = 'cycle_tracker_secret_key'
PROFILE_FILE = 'user_profile.json'

# --- Baby Size Data (Week -> Fruit/Veg) ---
BABY_SIZES = {
    1: "Poppy Seed", 2: "Poppy Seed", 3: "Blueberry", 4: "Lentil",
    5: "Apple Seed", 6: "Sweet Pea", 7: "Blueberry", 8: "Raspberry",
    9: "Cherry", 10: "Strawberry", 11: "Fig", 12: "Plum",
    13: "Lemon", 14: "Peach", 15: "Avocado", 16: "Orange",
    17: "Onion", 18: "Artichoke", 19: "Mango", 20: "Banana",
    21: "Carrot", 22: "Spaghetti Squash", 23: "Grapefruit", 24: "Ear of Corn",
    25: "Cauliflower", 26: "Butternut Squash", 27: "Head of Lettuce", 28: "Eggplant",
    29: "Squash", 30: "Cantaloupe", 31: "Coconut", 32: "Papaya",
    33: "Pineapple", 34: "Honeydew Melon", 35: "Acorn Squash", 36: "Romaine Lettuce",
    37: "Swiss Chard", 38: "Leek", 39: "Watermelon", 40: "Pumpkin"
}

# --- Symptoms & Tips by Stage ---
SYMPTOMS = {
    "early": ["Fatigue", "Breast tenderness", "Mood swings", "Light spotting"],
    "morning_sickness": ["Nausea", "Food aversions", "Vomiting", "Heightened smell"],
    "second_trimester": ["Growing belly", "Back pain", "Leg cramps", "Increased energy"],
    "third_trimester": ["Braxton Hicks", "Shortness of breath", "Frequent urination", "Swelling"],
    "late": ["Pelvic pressure", "Difficulty sleeping", "Nesting instinct"]
}

TIPS = {
    "first": "Start taking prenatal vitamins with folic acid. Stay hydrated to help with fatigue.",
    "second": "This is often the 'golden period'. Enjoy your energy boost and start thinking about baby names!",
    "third": "Pack your hospital bag early. Rest as much as possible and practice breathing exercises."
}

# --- Helper Functions ---
def load_profile():
    if os.path.exists(PROFILE_FILE):
        with open(PROFILE_FILE, 'r') as f:
            return json.load(f)
    # Default profile
    return {
        "name": "User",
        "lmp_date": (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d"),
        "cycle_length": 28,
        "mode": "conceive" # 'conceive' or 'pregnant'
    }

def save_profile(data):
    with open(PROFILE_FILE, 'w') as f:
        json.dump(data, f)

def calculate_cycle_data(lmp_str, cycle_length):
    lmp = datetime.strptime(lmp_str, "%Y-%m-%d")
    today = datetime.now()
    cycle_day = (today - lmp).days % cycle_length + 1
    current_cycle_num = (today - lmp).days // cycle_length + 1
    
    # Estimate Ovulation (14 days before next period)
    ovulation_day = cycle_length - 14
    fertile_start = max(1, ovulation_day - 5)
    fertile_end = min(cycle_length, ovulation_day + 1)
    
    next_period = lmp + timedelta(days=cycle_length * current_cycle_num)
    if today > next_period:
        next_period += timedelta(days=cycle_length)
        
    estimated_ovulation = next_period - timedelta(days=14)
    
    return {
        "cycle_day": cycle_day,
        "current_cycle_num": current_cycle_num,
        "ovulation_day": ovulation_day,
        "fertile_window": (fertile_start, fertile_end),
        "next_period": next_period.strftime("%Y-%m-%d"),
        "estimated_ovulation": estimated_ovulation.strftime("%Y-%m-%d"),
        "is_fertile": fertile_start <= cycle_day <= fertile_end,
        "is_ovulation": cycle_day == ovulation_day
    }

def get_pregnancy_content(lmp_str):
    lmp = datetime.strptime(lmp_str, "%Y-%m-%d")
    today = datetime.now()
    days_pregnant = (today - lmp).days
    
    if days_pregnant < 0:
        return {"error": "LMP date is in the future."}
    if days_pregnant > 280:
        days_pregnant = 280 # Cap at 40 weeks
        
    week = days_pregnant // 7 + 1
    day_in_week = days_pregnant % 7
    size = BABY_SIZES.get(min(week, 40), "Watermelon")
    
    # Determine stage for symptoms
    stage = "early"
    tip_key = "first"
    if 5 <= week <= 12:
        stage = "morning_sickness"
    elif 13 <= week <= 26:
        stage = "second_trimester"
        tip_key = "second"
    elif 27 <= week <= 36:
        stage = "third_trimester"
        tip_key = "third"
    else:
        stage = "late"
        tip_key = "third"
        
    return {
        "days_pregnant": days_pregnant,
        "week": week,
        "day_in_week": day_in_week,
        "size": size,
        "symptoms": SYMPTOMS.get(stage, []),
        "tip": TIPS.get(tip_key, ""),
        "trimester": 1 if week <= 12 else (2 if week <= 26 else 3)
    }

# --- HTML Template ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cycle & Pregnancy Tracker</title>
    <style>
        :root { --primary: #ff6b6b; --secondary: #4ecdc4; --bg: #f7f9fc; --text: #2d3436; }
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background: var(--bg); color: var(--text); }
        
        /* Navbar */
        nav { background: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .logo { font-size: 1.5rem; font-weight: bold; color: var(--primary); }
        .profile-icon { 
            width: 40px; height: 40px; background: var(--secondary); border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; color: white; 
            font-weight: bold; cursor: pointer; transition: transform 0.2s;
        }
        .profile-icon:hover { transform: scale(1.1); }

        /* Container */
        .container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        
        /* Cards */
        .card { background: white; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
        h2 { margin-top: 0; color: var(--primary); }
        
        /* Stats Grid */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .stat-box { background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center; }
        .stat-val { font-size: 1.5rem; font-weight: bold; color: var(--secondary); }
        .stat-label { font-size: 0.9rem; color: #666; }

        /* Inputs */
        .input-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        input, select { width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        button { background: var(--primary); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer; width: 100%; font-size: 1rem; }
        button:hover { opacity: 0.9; }

        /* Modal */
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 400px; position: relative; }
        .close-btn { position: absolute; top: 1rem; right: 1rem; cursor: pointer; font-size: 1.5rem; }
        
        /* Pregnancy Specific */
        .baby-size { font-size: 3rem; text-align: center; margin: 1rem 0; }
        .progress-bar { height: 10px; background: #eee; border-radius: 5px; overflow: hidden; margin: 1rem 0; }
        .progress-fill { height: 100%; background: var(--secondary); width: 0%; transition: width 0.5s; }
        
        /* Fertility Specific */
        .fertility-status { text-align: center; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
        .status-high { background: #ffebee; color: #c62828; }
        .status-low { background: #e3f2fd; color: #1565c0; }
        
        .symptom-tag { display: inline-block; background: #eee; padding: 0.3rem 0.8rem; border-radius: 20px; margin: 0.2rem; font-size: 0.9rem; }
    </style>
</head>
<body>

<nav>
    <div class="logo">CycleTracker</div>
    <div class="profile-icon" onclick="openModal()" id="profileIcon">U</div>
</nav>

<div class="container" id="app">
    <!-- Content injected by JS -->
    <div style="text-align:center; padding: 2rem;">Loading...</div>
</div>

<!-- Profile Modal -->
<div id="profileModal" class="modal">
    <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2>Your Profile</h2>
        <form id="profileForm">
            <div class="input-group">
                <label>Name</label>
                <input type="text" id="pName" required>
            </div>
            <div class="input-group">
                <label>Last Period Date (LMP)</label>
                <input type="date" id="pLmp" required>
            </div>
            <div class="input-group">
                <label>Avg Cycle Length (Days)</label>
                <input type="number" id="pCycle" min="20" max="45" value="28">
            </div>
            <div class="input-group">
                <label>Mode</label>
                <select id="pMode">
                    <option value="conceive">Trying to Conceive (Fertility)</option>
                    <option value="pregnant">Pregnancy Tracker</option>
                </select>
            </div>
            <button type="submit">Save Changes</button>
        </form>
    </div>
</div>

<script>
    let profile = {};

    async function loadProfile() {
        const res = await fetch('/api/profile');
        profile = await res.json();
        document.getElementById('profileIcon').innerText = profile.name.charAt(0).toUpperCase();
        renderDashboard();
    }

    function renderDashboard() {
        const app = document.getElementById('app');
        let html = '';

        if (profile.mode === 'pregnant') {
            // Fetch pregnancy data
            fetch('/api/pregnancy?lmp=' + profile.lmp_date)
                .then(r => r.json())
                .then(data => {
                    if(data.error) { app.innerHTML = `<div class="card">${data.error}</div>`; return; }
                    
                    const progress = (data.days_pregnant / 280) * 100;
                    
                    html = `
                        <div class="card">
                            <h2>Pregnancy Journey</h2>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <div style="font-size:0.9rem; color:#666;">Current Status</div>
                                    <div style="font-size:1.5rem; font-weight:bold;">Week ${data.week}, Day ${data.day_in_week + 1}</div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="font-size:0.9rem; color:#666;">Trimester</div>
                                    <div style="font-size:1.5rem; font-weight:bold;">${data.trimester}${['st','nd','rd'][data.trimester-1] || 'th'}</div>
                                </div>
                            </div>
                            <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
                            <div style="text-align:center; color:#666;">${data.days_pregnant} / 280 days</div>
                        </div>

                        <div class="card">
                            <h2>Baby Size</h2>
                            <div class="baby-size">🍈 ${data.size}</div>
                            <p style="text-align:center;">Your baby is about the size of a <strong>${data.size}</strong> this week!</p>
                        </div>

                        <div class="card">
                            <h2>Symptoms & Tips</h2>
                            <div><strong>Common Symptoms:</strong></div>
                            <div style="margin: 0.5rem 0;">
                                ${data.symptoms.map(s => `<span class="symptom-tag">${s}</span>`).join('')}
                            </div>
                            <hr style="border:0; border-top:1px solid #eee; margin:1rem 0;">
                            <div><strong>Daily Tip:</strong></div>
                            <p style="background:#f0f9ff; padding:1rem; border-radius:6px; margin-top:0.5rem;">${data.tip}</p>
                        </div>
                    `;
                    app.innerHTML = html;
                });
        } else {
            // Fetch fertility data
            fetch('/api/fertility?lmp=' + profile.lmp_date + '&cycle=' + profile.cycle_length)
                .then(r => r.json())
                .then(data => {
                    const statusClass = data.is_fertile ? 'status-high' : 'status-low';
                    const statusText = data.is_fertile ? 'High Fertility Window' : 'Low Fertility';
                    const statusIcon = data.is_fertile ? '🔥' : '❄️';
                    
                    html = `
                        <div class="card">
                            <h2>Cycle Overview</h2>
                            <div class="fertility-status ${statusClass}">
                                <div style="font-size:2rem;">${statusIcon}</div>
                                <div style="font-weight:bold; font-size:1.2rem;">${statusText}</div>
                                <div>Day ${data.cycle_day} of Cycle ${data.current_cycle_num}</div>
                            </div>
                            
                            <div class="stats-grid">
                                <div class="stat-box">
                                    <div class="stat-val">${data.ovulation_day}</div>
                                    <div class="stat-label">Est. Ovulation Day</div>
                                </div>
                                <div class="stat-box">
                                    <div class="stat-val">${data.fertile_window[0]}-${data.fertile_window[1]}</div>
                                    <div class="stat-label">Fertile Window</div>
                                </div>
                                <div class="stat-box">
                                    <div class="stat-val">${new Date(data.next_period).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                                    <div class="stat-label">Next Period</div>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <h2>Log Symptoms (Optional)</h2>
                            <p style="color:#666; font-size:0.9rem;">Tracking these helps refine your ovulation date.</p>
                            <div class="input-group">
                                <label>Basal Body Temperature (°F)</label>
                                <input type="number" step="0.1" placeholder="e.g. 97.6">
                            </div>
                            <div class="input-group">
                                <label>Cervical Mucus</label>
                                <select>
                                    <option>Dry</option>
                                    <option>Sticky</option>
                                    <option>Creamy</option>
                                    <option>Eggwhite (Fertile)</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>LH Test Result</label>
                                <select>
                                    <option>Negative</option>
                                    <option>Positive (Surge)</option>
                                </select>
                            </div>
                            <button onclick="alert('Symptoms logged! (Demo only)')">Save Logs</button>
                        </div>
                    `;
                    app.innerHTML = html;
                });
        }
    }

    // Modal Logic
    function openModal() {
        document.getElementById('pName').value = profile.name;
        document.getElementById('pLmp').value = profile.lmp_date;
        document.getElementById('pCycle').value = profile.cycle_length;
        document.getElementById('pMode').value = profile.mode;
        document.getElementById('profileModal').style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('profileModal').style.display = 'none';
    }

    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newData = {
            name: document.getElementById('pName').value,
            lmp_date: document.getElementById('pLmp').value,
            cycle_length: parseInt(document.getElementById('pCycle').value),
            mode: document.getElementById('pMode').value
        };
        
        await fetch('/api/profile', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newData)
        });
        
        closeModal();
        loadProfile();
    });

    // Close modal if clicking outside
    window.onclick = function(event) {
        if (event.target == document.getElementById('profileModal')) {
            closeModal();
        }
    }

    // Init
    loadProfile();
</script>
</body>
</html>
"""

# --- Routes ---
@APP.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@APP.route('/api/profile', methods=['GET'])
def get_profile():
    return jsonify(load_profile())

@APP.route('/api/profile', methods=['POST'])
def update_profile():
    data = request.json
    save_profile(data)
    return jsonify({"status": "success", "data": data})

@APP.route('/api/fertility')
def get_fertility():
    lmp = request.args.get('lmp')
    cycle = int(request.args.get('cycle', 28))
    return jsonify(calculate_cycle_data(lmp, cycle))

@APP.route('/api/pregnancy')
def get_pregnancy():
    lmp = request.args.get('lmp')
    return jsonify(get_pregnancy_content(lmp))

if __name__ == '__main__':
    print("Starting Cycle Tracker Web App...")
    print("Open http://127.0.0.1:5000 in your browser")
    APP.run(debug=True, port=5000)
