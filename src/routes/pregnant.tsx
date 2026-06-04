import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useId, useEffect, useCallback } from "react";
import { X, Info, Plus, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/BottomNav";
import { ModeSwitcherPill } from "@/components/ModeSwitcherPill";
import { ProfileIcon } from "@/components/ProfileIcon";

export const Route = createFileRoute("/pregnant")({
  head: () => ({
    meta: [
      { title: "Pregnancy — SheThrives" },
      { name: "description", content: "Track your pregnancy journey week by week." },
    ],
  }),
  component: PregnantScreen,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface WeekData {
  fruit: string;
  fruitEmoji: string;
  lengthMm: string;
  weightG: string;
  lengthIn: string;
  weightOz: string;
  babyHeadline: string;
  babyBody: string[];
  bodyHeadline: string;
  bodyBody: string[];
  symptoms: string[];
  tip: string;
  milestone?: string;
}

// ─── Complete 40-week dataset ──────────────────────────────────────────────────

const WEEK_DATA: Record<number, WeekData> = {
  1: {
    fruit: "Sesame seed",
    fruitEmoji: "🌱",
    lengthMm: "< 1 mm",
    weightG: "< 0.1 g",
    lengthIn: "< 0.1 in",
    weightOz: "< 0.01 oz",
    babyHeadline: "Fertilisation",
    babyBody: [
      "The egg and sperm have just united to form a single cell called a zygote.",
      "This tiny cell contains all the genetic information that will determine your baby's traits.",
      "The zygote starts dividing rapidly as it travels to the uterus.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You may not know you're pregnant yet — most tests won't detect hCG this early.",
      "Hormones are beginning to shift to prepare the uterine lining for implantation.",
      "Light spotting (implantation bleeding) can occur around days 10–14 post-ovulation.",
    ],
    symptoms: ["Mild cramping", "Light spotting", "Fatigue", "Breast tenderness"],
    tip: "Start a prenatal vitamin with at least 400 mcg of folic acid if you haven't already.",
  },
  2: {
    fruit: "Poppy seed",
    fruitEmoji: "🌿",
    lengthMm: "< 1 mm",
    weightG: "< 0.1 g",
    lengthIn: "< 0.1 in",
    weightOz: "< 0.01 oz",
    babyHeadline: "Implantation",
    babyBody: [
      "The blastocyst burrows into the uterine lining — a process called implantation.",
      "Cells are differentiating into those that form the placenta and those that form the embryo.",
      "The amniotic cavity is beginning to form.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "hCG levels start rising — a home pregnancy test may turn positive.",
      "The corpus luteum produces progesterone to maintain the pregnancy.",
      "You might feel nothing yet, or notice mild bloating and breast tenderness.",
    ],
    symptoms: ["Bloating", "Mild cramps", "Breast sensitivity", "Mood changes"],
    tip: "Schedule your first prenatal appointment for around 8–10 weeks.",
  },
  3: {
    fruit: "Poppy seed",
    fruitEmoji: "🌱",
    lengthMm: "1–2 mm",
    weightG: "< 0.1 g",
    lengthIn: "< 0.1 in",
    weightOz: "< 0.01 oz",
    babyHeadline: "Embryo forms",
    babyBody: [
      "Three distinct layers — ectoderm, mesoderm, endoderm — are taking shape.",
      "The neural tube, which becomes the brain and spinal cord, begins to form.",
      "The foundation for the heart, lungs, kidneys and gut is being laid.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Morning sickness may begin — though it can strike at any time of day.",
      "Your uterus starts to enlarge slightly.",
      "Blood volume will increase by up to 50% over the pregnancy.",
    ],
    symptoms: ["Nausea", "Fatigue", "Frequent urination", "Food aversions"],
    tip: "Eat small, frequent meals to help ease nausea.",
  },
  4: {
    fruit: "Poppy seed",
    fruitEmoji: "⚫",
    lengthMm: "2 mm",
    weightG: "< 0.1 g",
    lengthIn: "0.08 in",
    weightOz: "< 0.01 oz",
    babyHeadline: "Neural tube closes",
    babyBody: [
      "The neural tube closes this week — folic acid is critical right now.",
      "A tiny heart-like structure starts beating around day 22–23.",
      "Arm and leg buds are emerging as small paddles.",
      "The face is beginning to form with dark spots where eyes will be.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "The embryo produces hCG, which keeps progesterone flowing and your period from arriving.",
      "Your uterus is about the size of an orange.",
      "Tender, swollen breasts are very common.",
    ],
    symptoms: ["Breast tenderness", "Nausea", "Fatigue", "Heightened sense of smell"],
    tip: "Avoid alcohol, smoking, and unpasteurised foods entirely from now on.",
    milestone: "Heart starts beating",
  },
  5: {
    fruit: "Sesame seed",
    fruitEmoji: "🫘",
    lengthMm: "4 mm",
    weightG: "< 0.1 g",
    lengthIn: "0.16 in",
    weightOz: "< 0.01 oz",
    babyHeadline: "Organs forming",
    babyBody: [
      "Major organs — heart, stomach, liver, kidneys — are all beginning to form.",
      "The tiny heart is now beating about 100–160 times per minute.",
      "Limb buds are elongating into recognisable arm and leg shapes.",
      "The gut is taking shape and the embryo has a C-curve.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Morning sickness may peak around weeks 6–8 for many women.",
      "Your basal metabolic rate increases to support the growing embryo.",
      "Progesterone causes smooth muscles to relax, which can cause constipation.",
    ],
    symptoms: ["Vomiting", "Saliva increase", "Headaches", "Light-headedness"],
    tip: "Ginger tea, crackers before getting up, and acupressure wristbands can ease nausea.",
  },
  6: {
    fruit: "Sweet pea",
    fruitEmoji: "🟢",
    lengthMm: "6 mm",
    weightG: "< 0.1 g",
    lengthIn: "0.25 in",
    weightOz: "< 0.01 oz",
    babyHeadline: "Face is forming",
    babyBody: [
      "Dark spots for eyes and tiny depressions for nostrils are visible.",
      "The jaw, cheeks and chin are beginning to form.",
      "Tiny webbed fingers and toes are emerging.",
      "The intestines are growing inside the umbilical cord (this is normal).",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Your uterus has doubled in size since conception.",
      "Cervical mucus increases to form the protective mucus plug.",
      "You may experience vivid dreams due to hormonal changes.",
    ],
    symptoms: ["Vivid dreams", "Bloating", "Constipation", "Increased urination"],
    tip: "Stay hydrated — aim for at least 8–10 glasses of water per day.",
  },
  7: {
    fruit: "Blueberry",
    fruitEmoji: "🫐",
    lengthMm: "10 mm",
    weightG: "< 1 g",
    lengthIn: "0.39 in",
    weightOz: "< 0.04 oz",
    babyHeadline: "Developing limbs",
    babyBody: [
      "Your baby is growing at a rapid rate — about 1 mm per day.",
      "They're making around 100 new brain cells per minute.",
      "Limbs are lengthening and the paddle-shaped hands are developing distinct fingers.",
      "Eyelids are forming over the eyes.",
      "The tongue and inner ear structures are developing.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Your uterus is the size of a large orange.",
      "You may notice your waist thickening slightly.",
      "Fatigue is very common — your body is working as hard as climbing a mountain every day.",
    ],
    symptoms: ["Extreme fatigue", "Nausea", "Heartburn", "Mood swings"],
    tip: "Rest as much as your schedule allows — fatigue is your body's way of telling you to slow down.",
  },
  8: {
    fruit: "Raspberry",
    fruitEmoji: "🍓",
    lengthMm: "16 mm",
    weightG: "1 g",
    lengthIn: "0.63 in",
    weightOz: "0.04 oz",
    babyHeadline: "All organs present",
    babyBody: [
      "All major organs have begun forming — the embryo is now called a fetus.",
      "The tail has disappeared and your baby looks more human.",
      "Fingers and toes are distinct (though still webbed).",
      "The baby can now move, though you won't feel it yet.",
      "Taste buds are beginning to form.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Your first prenatal appointment is usually around now.",
      "Expect a transvaginal ultrasound to confirm the heartbeat.",
      "Your blood pressure may be slightly lower than normal.",
    ],
    symptoms: ["Food cravings", "Aversions", "Bloating", "Breast growth"],
    tip: "First prenatal visit: bring questions, your medical history, and a list of any medications.",
    milestone: "Embryo → Fetus",
  },
  9: {
    fruit: "Cherry",
    fruitEmoji: "🍒",
    lengthMm: "23 mm",
    weightG: "2 g",
    lengthIn: "0.9 in",
    weightOz: "0.07 oz",
    babyHeadline: "Tiny movements",
    babyBody: [
      "The fetus is now moving spontaneously, though too small to feel.",
      "Muscles are developing and the baby can flex its joints.",
      "The reproductive organs are forming, but sex isn't identifiable yet on ultrasound.",
      "Eyelids are fused shut and will stay that way until ~26 weeks.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Your uterus is the size of a grapefruit.",
      "Mood swings can be intense — oestrogen and progesterone are both surging.",
      "Some women find their skin glows; others experience breakouts.",
    ],
    symptoms: ["Mood swings", "Acne", "Fatigue", "Nasal congestion"],
    tip: "Prenatal yoga or gentle walks can help with mood and energy levels.",
  },
  10: {
    fruit: "Kumquat",
    fruitEmoji: "🍊",
    lengthMm: "31 mm",
    weightG: "4 g",
    lengthIn: "1.2 in",
    weightOz: "0.14 oz",
    babyHeadline: "Critical development complete",
    babyBody: [
      "The most critical period of organ development is complete.",
      "Vital organs are formed and beginning to function.",
      "The baby's bones are starting to harden from cartilage.",
      "Fingernails and hair follicles are forming.",
      "The intestines return from the cord into the abdomen.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Your risk of miscarriage drops significantly after week 10.",
      "Round ligament pain — sharp twinges in your lower abdomen — may appear as your uterus grows.",
      "Some women notice a darkening of the linea nigra (midline abdominal line).",
    ],
    symptoms: ["Round ligament pain", "Leg cramps", "Indigestion", "Visible veins on breasts"],
    tip: "This is a good time to discuss NIPT (non-invasive prenatal testing) with your doctor.",
  },
  11: {
    fruit: "Fig",
    fruitEmoji: "🫒",
    lengthMm: "41 mm",
    weightG: "7 g",
    lengthIn: "1.6 in",
    weightOz: "0.25 oz",
    babyHeadline: "Baby stretches",
    babyBody: [
      "Your baby can now open and close their fists.",
      "Tooth buds are forming for all 20 baby teeth.",
      "Hiccups may begin — a sign the diaphragm is practising.",
      "The baby's irises are developing, though eye colour isn't set until after birth.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Morning sickness often starts to ease around 11–13 weeks.",
      "Your uterus moves up out of the pelvis — pressure on the bladder decreases.",
      "First-trimester screening (nuchal translucency ultrasound + blood tests) is usually done now.",
    ],
    symptoms: ["Reduced nausea", "Continued fatigue", "Skin changes", "Increased appetite"],
    tip: "Book your nuchal translucency scan if you haven't — it's done between 11 and 13+6 weeks.",
  },
  12: {
    fruit: "Lime",
    fruitEmoji: "🍋",
    lengthMm: "54 mm",
    weightG: "14 g",
    lengthIn: "2.1 in",
    weightOz: "0.49 oz",
    babyHeadline: "First trimester milestone",
    babyBody: [
      "Reflexes are developing — the baby grabs, swallows and moves toes.",
      "The pituitary gland begins producing hormones.",
      "White blood cells are forming to fight infection after birth.",
      "The baby can yawn and make sucking motions.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "End of the first trimester! Miscarriage risk drops to around 1–2%.",
      "You may start to 'show' — a small bump can appear.",
      "Energy often returns in the second trimester.",
    ],
    symptoms: ["Improved energy", "Reduced nausea", "Visible bump", "Heartburn"],
    tip: "Many people choose to share pregnancy news after the 12-week scan.",
    milestone: "End of 1st trimester",
  },
  13: {
    fruit: "Peach",
    fruitEmoji: "🍑",
    lengthMm: "65 mm",
    weightG: "23 g",
    lengthIn: "2.6 in",
    weightOz: "0.81 oz",
    babyHeadline: "Fingerprints form",
    babyBody: [
      "Unique fingerprints are forming on the baby's fingertips.",
      "Vocal cords are developing.",
      "The liver is producing bile; the spleen is producing red blood cells.",
      "The baby's head is about a third of its total body length.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Welcome to the second trimester! Many women feel a surge of energy.",
      "Colostrum — the first breast milk — may begin to form.",
      "Varicose veins can appear as blood volume increases.",
    ],
    symptoms: ["Increased energy", "Breast leakage (colostrum)", "Nosebleeds", "Gum sensitivity"],
    tip: "Gentle dental care is especially important — hormones can cause gum inflammation.",
  },
  14: {
    fruit: "Lemon",
    fruitEmoji: "🍋",
    lengthMm: "80 mm",
    weightG: "43 g",
    lengthIn: "3.1 in",
    weightOz: "1.52 oz",
    babyHeadline: "Hair and eyebrows",
    babyBody: [
      "Fine hair (lanugo) starts to cover the body for warmth.",
      "Eyebrows and eyelashes are beginning to grow.",
      "The baby can make facial expressions — squinting, grimacing, frowning.",
      "The kidneys are producing urine which goes into the amniotic fluid.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Your uterus rises above your pubic bone — you may look visibly pregnant.",
      "Increased libido is common in the second trimester for many women.",
      "Braxton Hicks contractions (painless tightening) can begin.",
    ],
    symptoms: ["Braxton Hicks", "Increased appetite", "Backache", "Skin darkening"],
    tip: "Start moisturising your growing belly to help skin elasticity.",
  },
  15: {
    fruit: "Apple",
    fruitEmoji: "🍎",
    lengthMm: "93 mm",
    weightG: "70 g",
    lengthIn: "3.7 in",
    weightOz: "2.47 oz",
    babyHeadline: "Sensitive to light",
    babyBody: [
      "The baby can sense light through its eyelids even though they're fused shut.",
      "They're practising breathing, inhaling and exhaling amniotic fluid.",
      "Taste receptors are developing — the baby tastes what you eat through amniotic fluid.",
      "Bones are getting harder every day.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You may feel first flutters of movement ('quickening') — like butterflies or gas bubbles.",
      "Weight gain accelerates — about 450g (1 lb) per week is normal now.",
      "Your centre of gravity is shifting, which can affect balance.",
    ],
    symptoms: ["Quickening (flutters)", "Nosebleeds", "Swollen gums", "Skin itching"],
    tip: "Sleep on your left side to improve circulation to the placenta.",
  },
  16: {
    fruit: "Avocado",
    fruitEmoji: "🥑",
    lengthMm: "116 mm",
    weightG: "100 g",
    lengthIn: "4.6 in",
    weightOz: "3.53 oz",
    babyHeadline: "Facial expressions",
    babyBody: [
      "The baby's legs are longer than the arms now.",
      "They can grasp the umbilical cord.",
      "Eyes are moving slowly side-to-side.",
      "The baby is holding its head more erect.",
      "Toenails are growing.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Amniocentesis, if chosen, is typically offered between 15–20 weeks.",
      "Your bump is clearly visible.",
      "You might experience round ligament pain as the uterus grows.",
    ],
    symptoms: ["Visible bump", "Round ligament pain", "Constipation", "Heartburn"],
    tip: "Kegel exercises help strengthen pelvic floor muscles — do 10–15 three times a day.",
  },
  17: {
    fruit: "Pear",
    fruitEmoji: "🍐",
    lengthMm: "130 mm",
    weightG: "140 g",
    lengthIn: "5.1 in",
    weightOz: "4.94 oz",
    babyHeadline: "Fat begins forming",
    babyBody: [
      "The baby begins to accumulate brown fat, which will help regulate body temperature after birth.",
      "Sweat glands are developing.",
      "Cartilage throughout the skeleton is turning to bone.",
      "The umbilical cord is thickening and growing stronger.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Your blood volume has increased by about 40%.",
      "Carpal tunnel syndrome can develop from fluid retention.",
      "You may notice your belly button starting to push outward.",
    ],
    symptoms: ["Carpal tunnel", "Tingling hands", "Belly button changing", "Stretch marks"],
    tip: "Eating iron-rich foods (leafy greens, red meat, legumes) helps support your increased blood volume.",
  },
  18: {
    fruit: "Bell pepper",
    fruitEmoji: "🫑",
    lengthMm: "143 mm",
    weightG: "190 g",
    lengthIn: "5.6 in",
    weightOz: "6.7 oz",
    babyHeadline: "Baby is yawning",
    babyBody: [
      "The baby yawns, hiccups and rolls inside the womb.",
      "The ears are now in position and the baby can hear sounds.",
      "Myelin is beginning to coat nerve fibres to speed up brain signals.",
      "Female babies' fallopian tubes and uterus are fully formed.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You should feel definite movements now if this isn't your first pregnancy.",
      "Your uterus is about the size of a cantaloupe.",
      "Dizziness can occur if you stand up too quickly (postural hypotension).",
    ],
    symptoms: ["Baby movements", "Dizziness", "Back pain", "Leg cramps"],
    tip: "Talk, read or sing to your baby — they can now hear your voice.",
  },
  19: {
    fruit: "Mango",
    fruitEmoji: "🥭",
    lengthMm: "152 mm",
    weightG: "240 g",
    lengthIn: "6.0 in",
    weightOz: "8.47 oz",
    babyHeadline: "Vernix forms",
    babyBody: [
      "A white, waxy coating (vernix caseosa) is covering the skin to protect it from amniotic fluid.",
      "The senses of taste, smell, sight, touch and hearing are developing.",
      "The baby's brain is mapping out specialised areas for each sense.",
      "Legs are now in proportion with the rest of the body.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Round ligament pain is very common as the uterus grows sideways.",
      "You may notice a dark line (linea nigra) running down your bump.",
      "Your posture is changing — try to be mindful of your back.",
    ],
    symptoms: ["Linea nigra", "Round ligament pain", "Increased appetite", "Mild oedema"],
    tip: "The 20-week anomaly scan is coming up — this is an exciting milestone.",
  },
  20: {
    fruit: "Banana",
    fruitEmoji: "🍌",
    lengthMm: "164 mm",
    weightG: "300 g",
    lengthIn: "6.5 in",
    weightOz: "10.6 oz",
    babyHeadline: "Halfway there!",
    babyBody: [
      "Your baby now measures from crown to heel (not just crown to rump).",
      "The 20-week scan can usually reveal the sex.",
      "They're swallowing amniotic fluid — which helps the digestive system mature.",
      "Meconium (first poo) is forming in the intestines.",
      "The baby is sleeping and waking in cycles.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "The top of your uterus (fundus) is at your belly button.",
      "Oedema (swelling) in feet and ankles is very common.",
      "Shortness of breath may increase as your uterus pushes up on your diaphragm.",
    ],
    symptoms: ["Oedema", "Shortness of breath", "Kick counting begins", "Pelvic pain"],
    tip: "Congratulations on reaching the halfway point! Celebrate this milestone.",
    milestone: "Halfway there! 20 weeks",
  },
  21: {
    fruit: "Carrot",
    fruitEmoji: "🥕",
    lengthMm: "267 mm",
    weightG: "360 g",
    lengthIn: "10.5 in",
    weightOz: "12.7 oz",
    babyHeadline: "Kicks & punches",
    babyBody: [
      "Kicks, punches and somersaults are getting stronger and more frequent.",
      "The baby's digestive system is practising — it swallows up to a litre of fluid a day.",
      "Male babies' testes start descending from the abdomen.",
      "Bone marrow is starting to produce red blood cells.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You may experience Braxton Hicks contractions more often.",
      "Symphysis pubis dysfunction (SPD) — pelvic girdle pain — can develop.",
      "Varicose veins in legs and vulva are more common now.",
    ],
    symptoms: ["SPD/pelvic pain", "Varicose veins", "Braxton Hicks", "Hip pain"],
    tip: "A pregnancy pillow between your knees can significantly ease pelvic and hip pain at night.",
  },
  22: {
    fruit: "Papaya",
    fruitEmoji: "🫛",
    lengthMm: "277 mm",
    weightG: "430 g",
    lengthIn: "10.9 in",
    weightOz: "15.2 oz",
    babyHeadline: "Grip strength",
    babyBody: [
      "The baby has a strong grip and will grab at the umbilical cord.",
      "Lips and eyebrows are distinct and visible on ultrasound.",
      "The baby now has sleep cycles of 12–14 hours a day.",
      "Melanin is beginning to pigment the skin — though all babies are born with lighter skin.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Your belly may feel itchy as the skin stretches.",
      "Haemorrhoids (piles) are common due to increased blood flow and pressure.",
      "Some women experience linea nigra extending above the belly button.",
    ],
    symptoms: ["Itchy belly", "Haemorrhoids", "Swollen ankles", "Stretch marks"],
    tip: "Wearing compression socks can help with oedema and varicose veins.",
  },
  23: {
    fruit: "Grapefruit",
    fruitEmoji: "🍊",
    lengthMm: "287 mm",
    weightG: "501 g",
    lengthIn: "11.3 in",
    weightOz: "17.7 oz",
    babyHeadline: "Listens to music",
    babyBody: [
      "The baby reacts to music and familiar voices.",
      "Fat deposits beneath the skin are increasing, making it less translucent.",
      "Rapid eye movement (REM) sleep — and possibly dreaming — may begin.",
      "The pancreas is developing and producing insulin.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You may notice Braxton Hicks more frequently, especially after activity.",
      "Ankle and foot swelling is very common in the afternoon.",
      "The uterus is now above your belly button.",
    ],
    symptoms: ["Frequent Braxton Hicks", "Swelling", "Backache", "Insomnia"],
    tip: "Lie on your left side to reduce swelling — it improves blood flow back to the heart.",
  },
  24: {
    fruit: "Corn",
    fruitEmoji: "🌽",
    lengthMm: "298 mm",
    weightG: "600 g",
    lengthIn: "11.8 in",
    weightOz: "21.2 oz",
    babyHeadline: "Viability milestone",
    babyBody: [
      "At 24 weeks, babies born prematurely have a chance of survival with intensive care.",
      "Lung alveoli (air sacs) are forming and will continue maturing until birth.",
      "The brain is growing rapidly — it will triple in volume in the third trimester.",
      "Taste buds are fully formed.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "The glucose tolerance test (GDM screen) is typically done between 24–28 weeks.",
      "Your ribs may feel sore as the uterus pushes upward.",
      "Colostrum can sometimes leak from the nipples.",
    ],
    symptoms: ["Rib pain", "Colostrum leakage", "Insomnia", "Skin changes"],
    tip: "Book a gestational diabetes test (OGTT) if not already scheduled.",
    milestone: "Viability milestone",
  },
  25: {
    fruit: "Cauliflower",
    fruitEmoji: "🥦",
    lengthMm: "347 mm",
    weightG: "660 g",
    lengthIn: "13.6 in",
    weightOz: "23.3 oz",
    babyHeadline: "Responds to touch",
    babyBody: [
      "The baby can feel you touching your bump from the inside.",
      "They're starting to look more like a newborn — though still very thin.",
      "The baby is beginning to respond to pain.",
      "Hair on the head is growing.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Sciatic nerve pain can shoot down one or both legs.",
      "You may experience carpal tunnel symptoms due to fluid retention.",
      "Your posture is being pulled forward by the growing bump.",
    ],
    symptoms: ["Sciatica", "Carpal tunnel", "Heartburn", "Shortness of breath"],
    tip: "Prenatal massage and physiotherapy can help manage sciatic pain.",
  },
  26: {
    fruit: "Scallion",
    fruitEmoji: "🧅",
    lengthMm: "359 mm",
    weightG: "760 g",
    lengthIn: "14.1 in",
    weightOz: "26.8 oz",
    babyHeadline: "Eyes open",
    babyBody: [
      "The baby opens their eyes for the first time this week.",
      "They can now blink and react to light shining on your belly.",
      "The brain is taking control of rhythmic breathing movements.",
      "Fingernails have grown to reach the fingertips.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Sleep becomes more challenging as the bump grows.",
      "Heartburn is often at its worst now — the uterus pushes acid upward.",
      "Braxton Hicks may be strong enough to stop you in your tracks.",
    ],
    symptoms: ["Heartburn", "Sleep disturbance", "Strong Braxton Hicks", "Pelvic pressure"],
    tip: "Eating smaller meals and staying upright for 30 minutes after eating helps heartburn.",
  },
  27: {
    fruit: "Lettuce head",
    fruitEmoji: "🥬",
    lengthMm: "368 mm",
    weightG: "875 g",
    lengthIn: "14.5 in",
    weightOz: "30.9 oz",
    babyHeadline: "End of second trimester",
    babyBody: [
      "The baby is practising breathing by inhaling amniotic fluid.",
      "The brain is developing billions of neurons.",
      "They can recognise your voice and may turn toward familiar sounds.",
      "Taste preferences are being shaped by what you eat.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You're entering the third trimester next week — the final stretch!",
      "Pelvic floor weakness can cause leaking when you cough or sneeze.",
      "Haemorrhoids and varicose veins may worsen.",
      "You may feel breathless just walking up stairs.",
    ],
    symptoms: ["Breathlessness", "Pelvic pressure", "Leaking urine", "Wrist/hand pain"],
    tip: "Start thinking about your birth plan — this is a great time to discuss it with your midwife.",
  },
  28: {
    fruit: "Aubergine",
    fruitEmoji: "🍆",
    lengthMm: "380 mm",
    weightG: "1005 g",
    lengthIn: "14.8 in",
    weightOz: "35.4 oz",
    babyHeadline: "Third trimester begins",
    babyBody: [
      "Your baby weighs about 1 kg (just over 2 lbs) for the first time.",
      "They can now dream during REM sleep.",
      "The baby's eyes can track light.",
      "Bone marrow has fully taken over red blood cell production.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Antenatal appointments become more frequent — every 2–4 weeks.",
      "You may be offered a whooping cough vaccination (recommended between 16–32 weeks).",
      "Colostrum may leak more noticeably.",
    ],
    symptoms: ["Shortness of breath", "Frequent urination", "Leg cramps", "Insomnia"],
    tip: "Third trimester — start tracking kick counts daily. Ten movements in 2 hours is reassuring.",
    milestone: "Third trimester begins",
  },
  29: {
    fruit: "Butternut squash",
    fruitEmoji: "🎃",
    lengthMm: "388 mm",
    weightG: "1153 g",
    lengthIn: "15.2 in",
    weightOz: "40.7 oz",
    babyHeadline: "Rapid brain growth",
    babyBody: [
      "The brain is growing rapidly, developing grooves and folds.",
      "The baby is accumulating iron, calcium and phosphorus.",
      "Muscles and lungs are continuing to mature.",
      "The baby is increasingly sensitive to light, sound and pain.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Baby's movements may feel like they're decreasing — but they shouldn't stop.",
      "Pelvic girdle pain (PGP) often worsens in the third trimester.",
      "You may be waking frequently at night to urinate.",
    ],
    symptoms: ["Pelvic girdle pain", "Nocturia", "Fatigue", "Swelling"],
    tip: "Contact your midwife immediately if you notice reduced fetal movements.",
  },
  30: {
    fruit: "Cabbage",
    fruitEmoji: "🥬",
    lengthMm: "399 mm",
    weightG: "1319 g",
    lengthIn: "15.7 in",
    weightOz: "46.5 oz",
    babyHeadline: "Fat layers thicken",
    babyBody: [
      "The baby's brain is growing so fast it's developing wrinkles to increase surface area.",
      "Fat layers beneath the skin are thickening — the baby looks chubbier.",
      "Lanugo is beginning to disappear as the baby plumps up.",
      "Red blood cells are fully functional.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You've gained around 8–11 kg (18–25 lbs) by now on average.",
      "The uterus is 10 cm above the belly button.",
      "Braxton Hicks contractions may be more frequent and stronger.",
    ],
    symptoms: ["Braxton Hicks", "Shortness of breath", "Heartburn", "Stretch marks"],
    tip: "Pack your hospital bag — it's easier to do it now than in the chaos of early labour.",
  },
  31: {
    fruit: "Coconut",
    fruitEmoji: "🥥",
    lengthMm: "411 mm",
    weightG: "1502 g",
    lengthIn: "16.2 in",
    weightOz: "53.0 oz",
    babyHeadline: "All five senses",
    babyBody: [
      "All five senses are now operational.",
      "The baby is processing information, tracking light and responding to sound.",
      "The baby spends more time in quiet alert states.",
      "Hiccups are common — you'll feel rhythmic jolts.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Colostrum leakage from nipples is normal.",
      "You may feel the baby 'drop' into the pelvis (lightening) in the coming weeks.",
      "Anxiety about labour is common — antenatal classes can really help.",
    ],
    symptoms: ["Frequent hiccups felt", "Nipple leakage", "Nesting instinct", "Insomnia"],
    tip: "If you haven't already, book antenatal classes — hypnobirthing is popular and evidence-based.",
  },
  32: {
    fruit: "Jicama",
    fruitEmoji: "🍈",
    lengthMm: "422 mm",
    weightG: "1702 g",
    lengthIn: "16.7 in",
    weightOz: "60.0 oz",
    babyHeadline: "Practising breathing",
    babyBody: [
      "The baby is practising breathing movements for up to 40 minutes at a time.",
      "Toenails are fully formed.",
      "The irises can now dilate and contract in response to light.",
      "The baby is gaining about 200–250 g per week now.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Group B Streptococcus (GBS) swab may be taken around 35–37 weeks.",
      "Pelvic pressure increases as the baby's head moves lower.",
      "Many women begin to feel very heavy and uncomfortable.",
    ],
    symptoms: ["Pelvic heaviness", "Frequent urination", "Insomnia", "Back pain"],
    tip: "Sleep with several pillows — one under the bump, one between your knees, one behind your back.",
  },
  33: {
    fruit: "Pineapple",
    fruitEmoji: "🍍",
    lengthMm: "432 mm",
    weightG: "1918 g",
    lengthIn: "17.0 in",
    weightOz: "67.7 oz",
    babyHeadline: "Skull softens",
    babyBody: [
      "The skull bones are still soft and not fully fused — they'll overlap during delivery.",
      "The baby is sleeping 90–95% of the time to conserve energy for growth.",
      "Antibodies are transferring from mother to baby through the placenta.",
      "The immune system is developing.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Braxton Hicks are becoming more intense — but they should stop if you change position.",
      "Oedema in legs and feet can be significant.",
      "You may notice your rings no longer fit.",
    ],
    symptoms: ["Oedema", "Pelvic pressure", "Braxton Hicks", "Restless legs"],
    tip: "Watch for signs of pre-eclampsia: severe headache, visual disturbances, sudden swelling. Seek urgent care if these occur.",
  },
  34: {
    fruit: "Cantaloupe",
    fruitEmoji: "🍈",
    lengthMm: "450 mm",
    weightG: "2146 g",
    lengthIn: "17.7 in",
    weightOz: "75.7 oz",
    babyHeadline: "Immune system ready",
    babyBody: [
      "The baby's immune system is receiving antibodies to protect against illness after birth.",
      "The central nervous system is maturing rapidly.",
      "The baby's hearing is fully developed.",
      "Most babies are now head-down (cephalic position).",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Lightening (baby dropping into the pelvis) may happen now or in the coming weeks.",
      "Lightning crotch — sharp shooting pains — is caused by baby pressing on nerves.",
      "Your breathing may become easier once the baby drops.",
    ],
    symptoms: ["Lightning crotch", "Pelvic pressure", "Breathlessness improving", "Leaking urine"],
    tip: "Discuss your birth preferences in detail with your midwife or obstetrician.",
  },
  35: {
    fruit: "Honeydew melon",
    fruitEmoji: "🍈",
    lengthMm: "463 mm",
    weightG: "2383 g",
    lengthIn: "18.2 in",
    weightOz: "84.1 oz",
    babyHeadline: "Kidneys fully mature",
    babyBody: [
      "The kidneys are fully developed and producing about half a litre of urine daily.",
      "Hearing is acute — the baby startles at loud noises.",
      "The baby's body fat is now about 15% of their weight.",
      "Most of the lanugo has shed.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Antenatal appointments are now weekly in many care models.",
      "Group B Strep swab may be done this week.",
      "Cervical changes (effacement and dilation) may already be beginning.",
    ],
    symptoms: ["Pelvic floor weakness", "Frequent urination", "Backache", "Nesting urge"],
    tip: "Install the car seat and have your bag ready — babies can come early!",
  },
  36: {
    fruit: "Papaya",
    fruitEmoji: "🍈",
    lengthMm: "474 mm",
    weightG: "2622 g",
    lengthIn: "18.7 in",
    weightOz: "92.5 oz",
    babyHeadline: "Shedding vernix",
    babyBody: [
      "The vernix and lanugo are mostly gone now — swallowed into meconium.",
      "The baby is gaining about 28 g (1 oz) per day.",
      "Skull bones can now slide over each other to fit through the birth canal.",
      "Gums are firm — teething ridges are visible on scan.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You're considered 'early term' from 37 weeks.",
      "Mucus plug can shed in the coming weeks — it may come out all at once or in pieces.",
      "Braxton Hicks may feel very intense and regular.",
    ],
    symptoms: ["Mucus plug discharge", "Pelvic pressure", "Difficulty walking", "Insomnia"],
    tip: "Keep track of fetal movements — if you notice a decrease, contact your midwife immediately.",
  },
  37: {
    fruit: "Winter melon",
    fruitEmoji: "🍉",
    lengthMm: "487 mm",
    weightG: "2859 g",
    lengthIn: "19.1 in",
    weightOz: "100.8 oz",
    babyHeadline: "Early term",
    babyBody: [
      "Your baby is considered 'early term' — major development is complete.",
      "They're practising grasping and have a very strong grip.",
      "The lungs produce surfactant to keep air sacs open after birth.",
      "The baby continues to gain weight — up to 28 g per day.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You may lose the mucus plug (a gel-like blob, sometimes blood-tinged).",
      "Latent phase of labour can begin and last days or even weeks.",
      "Your cervix is beginning to soften (ripen) and thin (efface).",
    ],
    symptoms: ["Mucus plug loss", "Show (bloody discharge)", "Irregular contractions", "Nesting"],
    tip: "Know the signs of labour: regular contractions every 5 min for 1 hour, waters breaking, or heavy bleeding.",
    milestone: "Early term (37 weeks)",
  },
  38: {
    fruit: "Leek",
    fruitEmoji: "🫛",
    lengthMm: "499 mm",
    weightG: "3083 g",
    lengthIn: "19.6 in",
    weightOz: "108.7 oz",
    babyHeadline: "Ready to be born",
    babyBody: [
      "Your baby is considered full-term from this week.",
      "They're shedding the last of the vernix into the amniotic fluid.",
      "The brain and nervous system are fully mature.",
      "The baby is well-positioned for birth, most likely head-down.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "You may notice your bump 'dropping' lower — baby has engaged in the pelvis.",
      "Contractions may come and go — 'practice runs' for labour.",
      "Sleep is often very disrupted with frequent trips to the bathroom.",
    ],
    symptoms: [
      "Pelvic engagement",
      "Irregular contractions",
      "Waters leaking (trickle)",
      "Anxiety",
    ],
    tip: "If your waters break — note the time, colour and smell, then call your midwife or hospital.",
    milestone: "Full term",
  },
  39: {
    fruit: "Watermelon",
    fruitEmoji: "🍉",
    lengthMm: "507 mm",
    weightG: "3288 g",
    lengthIn: "19.9 in",
    weightOz: "115.9 oz",
    babyHeadline: "Final preparations",
    babyBody: [
      "The brain, lungs and muscles are fully mature.",
      "The baby is very cramped — big kicks and rolls are replaced by rolling and squirming.",
      "Antibody transfer from mother is at its highest peak.",
      "The placenta is beginning to age but still functioning well.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Induction may be discussed if you go past 41 weeks.",
      "Cervical sweeps (membrane sweeps) may be offered.",
      "You may feel very impatient — that's completely normal!",
    ],
    symptoms: [
      "Contractions",
      "Lower back ache",
      "Loose stools (sign of labour approaching)",
      "Emotional",
    ],
    tip: "Rest as much as possible — you'll need your strength for labour. Eat well and stay hydrated.",
  },
  40: {
    fruit: "Watermelon",
    fruitEmoji: "🍉",
    lengthMm: "514 mm",
    weightG: "3462 g",
    lengthIn: "20.2 in",
    weightOz: "122.1 oz",
    babyHeadline: "Due date!",
    babyBody: [
      "Your baby is ready to meet the world.",
      "The average birth weight is around 3.4 kg (7.5 lbs), but normal ranges from 2.5–4.5 kg.",
      "Only about 5% of babies are born on their due date — most arrive within 2 weeks.",
      "The placenta is fully mature and will deliver shortly after birth.",
    ],
    bodyHeadline: "Your body this week",
    bodyBody: [
      "Induction is typically offered at 41–42 weeks if labour hasn't started.",
      "You may feel excited, anxious, and very ready — all normal.",
      "Trust your body — it knows what to do.",
    ],
    symptoms: ["Labour signs", "Nesting urge", "Emotional", "Very little sleep"],
    tip: "You're almost there! Call your hospital if contractions are 5 minutes apart, lasting 1 minute, for 1 hour.",
    milestone: "Due date! 🎉",
  },
};

// Fill missing weeks with interpolated data
for (let w = 1; w <= 40; w++) {
  if (!WEEK_DATA[w]) {
    // Find nearest weeks
    const keys = Object.keys(WEEK_DATA)
      .map(Number)
      .sort((a, b) => a - b);
    const prev = keys.filter((k) => k < w).pop() || 1;
    const next = keys.find((k) => k > w) || 40;
    const p = WEEK_DATA[prev];
    const n = WEEK_DATA[next];
    WEEK_DATA[w] = {
      fruit: p.fruit,
      fruitEmoji: p.fruitEmoji,
      lengthMm: p.lengthMm,
      weightG: p.weightG,
      lengthIn: p.lengthIn,
      weightOz: p.weightOz,
      babyHeadline: p.babyHeadline,
      babyBody: p.babyBody,
      bodyHeadline: p.bodyHeadline,
      bodyBody: p.bodyBody,
      symptoms: p.symptoms,
      tip: p.tip,
    };
  }
}

// ─── Fetus SVG illustration (sonography-inspired, stage-based) ─────────────────

function FetusSvg({ week, size = 220 }: { week: number; size?: number }) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, "i");

  const stage =
    week <= 4
      ? 1
      : week <= 8
        ? 2
        : week <= 12
          ? 3
          : week <= 20
            ? 4
            : week <= 28
              ? 5
              : week <= 34
                ? 6
                : 7;

  // Unique gradient/filter IDs
  const am = `am${uid}`; // amniotic ambient
  const bd = `bd${uid}`; // body gradient
  const hg = `hg${uid}`; // head gradient
  const sh = `sh${uid}`; // shadow depth overlay
  const gl = `gl${uid}`; // embryo glow
  const sf = `sf${uid}`; // soft blur filter

  const ks = "0.45 0 0.55 1; 0.45 0 0.55 1";
  // Growth: week 1 ≈ 22% → week 40 ≈ 82%.
  // Capped at 0.82 so stage-7 paths (which extend to ~y=234) stay within the 220px viewBox.
  // Power 0.65 gives a slightly more gradual S-curve than before — consecutive weeks
  // look clearly different (≈ +1–3% per week) without clipping at either end.
  const s = 0.22 + 0.6 * Math.pow(Math.max(0, week - 1) / 39, 0.65);
  const st = `translate(${+(110 * (1 - s)).toFixed(2)},${+(115 * (1 - s)).toFixed(2)}) scale(${+s.toFixed(4)})`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={sf} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={am} cx="50%" cy="44%" r="54%">
          <stop offset="0%" stopColor="#FFF2EC" stopOpacity="0.82" />
          <stop offset="60%" stopColor="#FFD8C0" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FFD8C0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={bd} cx="26%" cy="20%" r="80%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#F5C0A0" />
          <stop offset="18%" stopColor="#E8986A" />
          <stop offset="50%" stopColor="#CC6840" />
          <stop offset="78%" stopColor="#A84828" />
          <stop offset="100%" stopColor="#882810" />
        </radialGradient>
        <radialGradient id={hg} cx="36%" cy="22%" r="74%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#FACCAA" />
          <stop offset="16%" stopColor="#ECA080" />
          <stop offset="48%" stopColor="#D06848" />
          <stop offset="78%" stopColor="#A84430" />
          <stop offset="100%" stopColor="#882810" />
        </radialGradient>
        <radialGradient id={sh} cx="68%" cy="74%" r="58%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#5A1808" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#5A1808" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={gl} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE0C0" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#FFB880" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF9050" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm amniotic ambient */}
      <ellipse cx="110" cy="112" rx="92" ry="88" fill={`url(#${am})`} />

      {/* ── Stage 1: weeks 1–4 — glowing blastocyst ── */}
      {stage === 1 && (
        <g transform={st}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-8; 0,0"
            dur="3.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={ks}
            additive="sum"
          />
          <circle cx="110" cy="115" r="54" fill={`url(#${gl})`} filter={`url(#${sf})`}>
            <animate
              attributeName="r"
              values="48;60;48"
              dur="2.4s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines={ks}
            />
            <animate
              attributeName="opacity"
              values="0.65;1;0.65"
              dur="2.4s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines={ks}
            />
          </circle>
          <circle cx="110" cy="115" r="26" fill={`url(#${bd})`} />
          <circle cx="110" cy="115" r="26" fill={`url(#${sh})`} />
          <circle cx="124" cy="104" r="14" fill="#D07848" opacity="0.82" />
          <circle cx="96" cy="124" r="10" fill="#C86840" opacity="0.72" />
          <circle cx="120" cy="128" r="9" fill="#BE6038" opacity="0.62" />
          <ellipse cx="103" cy="108" rx="8" ry="7" fill="#FAD0B0" opacity="0.38" />
          <circle cx="110" cy="115" r="4" fill="#E03828" opacity="0.9">
            <animate
              attributeName="r"
              values="3;7;3"
              dur="1.1s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
            <animate
              attributeName="opacity"
              values="0.9;0.25;0.9"
              dur="1.1s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </circle>
        </g>
      )}

      {/* ── Stage 2: weeks 5–8 — early C-shaped embryo (like 7-week scan) ── */}
      {stage === 2 && (
        <g transform={st}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-7; 0,0"
            dur="3.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={ks}
            additive="sum"
          />
          {/* Head — large oval, embryo proportions */}
          <ellipse cx="107" cy="70" rx="33" ry="40" fill={`url(#${hg})`} />
          <ellipse cx="107" cy="70" rx="33" ry="40" fill={`url(#${sh})`} />
          <ellipse cx="97" cy="57" rx="11" ry="13" fill="#FAD0B0" opacity="0.24" />
          {/* Body torso */}
          <path
            d="M108,106 C124,102 140,116 136,138 C132,158 118,168 104,160 C90,152 82,136 86,116 C90,102 100,108 108,106Z"
            fill={`url(#${bd})`}
          />
          <path
            d="M108,106 C124,102 140,116 136,138 C132,158 118,168 104,160 C90,152 82,136 86,116 C90,102 100,108 108,106Z"
            fill={`url(#${sh})`}
          />
          {/* Arm bud */}
          <ellipse
            cx="142"
            cy="114"
            rx="14"
            ry="8"
            fill="#C07848"
            opacity="0.9"
            transform="rotate(28 142 114)"
          />
          <ellipse
            cx="142"
            cy="114"
            rx="14"
            ry="8"
            fill={`url(#${sh})`}
            transform="rotate(28 142 114)"
          />
          {/* Leg bud */}
          <ellipse
            cx="128"
            cy="152"
            rx="13"
            ry="7.5"
            fill="#B87040"
            opacity="0.84"
            transform="rotate(-22 128 152)"
          />
          {/* Embryonic tail */}
          <path
            d="M90,154 C78,166 78,180 86,184"
            stroke="#B06038"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.52"
          />
          {/* Pulsing heart */}
          <circle cx="118" cy="118" r="5" fill="#E03828" opacity="0.82">
            <animate
              attributeName="r"
              values="4;8;4"
              dur="1.2s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
            <animate
              attributeName="opacity"
              values="0.82;0.22;0.82"
              dur="1.2s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </circle>
        </g>
      )}

      {/* ── Stage 3: weeks 9–12 — recognizable curled fetus ── */}
      {stage === 3 && (
        <g transform={st}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-7; 0,0"
            dur="3.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={ks}
            additive="sum"
          />
          <path
            d="M106,102 C130,94 150,116 146,150 C142,180 118,192 98,176 C78,160 70,130 76,108 C82,90 96,108 106,102Z"
            fill={`url(#${bd})`}
          />
          <path
            d="M106,102 C130,94 150,116 146,150 C142,180 118,192 98,176 C78,160 70,130 76,108 C82,90 96,108 106,102Z"
            fill={`url(#${sh})`}
          />
          <circle cx="106" cy="70" r="34" fill={`url(#${hg})`} />
          <circle cx="106" cy="70" r="34" fill={`url(#${sh})`} />
          <ellipse cx="96" cy="57" rx="12" ry="13" fill="#FAD0B0" opacity="0.22" />
          {/* Eye areas — subtle dark patches only */}
          <ellipse cx="96" cy="66" rx="5.5" ry="4" fill="#4A1808" opacity="0.25" />
          <ellipse cx="116" cy="66" rx="5.5" ry="4" fill="#4A1808" opacity="0.25" />
          <path
            d="M134,122 C154,116 162,134 150,148"
            stroke="#C07040"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="150" cy="149" r="8" fill="#B86830" />
          <path
            d="M118,162 C132,176 128,194 108,196"
            stroke="#C07040"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="104" cy="197" rx="10" ry="6" fill="#B06830" transform="rotate(-8 104 197)" />
          <path
            d="M90,166 C74,180 72,194 84,198"
            stroke="#A85828"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity="0.58"
          />
          <path
            d="M94,140 C72,156 76,174 88,184"
            stroke="#C87848"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.36"
          />
        </g>
      )}

      {/* ── Stage 4: weeks 13–20 ── */}
      {stage === 4 && (
        <g transform={st}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-7; 0,0"
            dur="3.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={ks}
            additive="sum"
          />
          <path
            d="M104,90 C134,82 156,110 152,150 C148,188 114,200 88,180 C62,160 54,128 60,104 C66,84 88,96 104,90Z"
            fill={`url(#${bd})`}
          />
          <path
            d="M104,90 C134,82 156,110 152,150 C148,188 114,200 88,180 C62,160 54,128 60,104 C66,84 88,96 104,90Z"
            fill={`url(#${sh})`}
          />
          <circle cx="108" cy="56" r="38" fill={`url(#${hg})`} />
          <circle cx="108" cy="56" r="38" fill={`url(#${sh})`} />
          <ellipse cx="96" cy="42" rx="13" ry="14" fill="#FAD0B0" opacity="0.2" />
          {/* Eye patches */}
          <ellipse cx="96" cy="52" rx="6" ry="4" fill="#4A1808" opacity="0.28" />
          <ellipse cx="118" cy="52" rx="6" ry="4" fill="#4A1808" opacity="0.28" />
          <ellipse cx="108" cy="64" rx="4" ry="2.5" fill="#904020" opacity="0.2" />
          {/* Arm up */}
          <path
            d="M146,108 C166,100 172,80 156,62"
            stroke="#C07040"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="154" cy="60" r="10" fill="#B86830" />
          {[-3, 2, 7].map((d, i) => (
            <line
              key={i}
              x1={154 + d}
              y1={57}
              x2={153 + d}
              y2={48}
              stroke="#A05828"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
          <path
            d="M120,164 C136,178 132,198 110,202"
            stroke="#C07040"
            strokeWidth="13"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="106" cy="203" rx="12" ry="7" fill="#B06830" transform="rotate(-6 106 203)" />
          <path
            d="M82,170 C60,186 58,206 72,210"
            stroke="#A05028"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M86,132 C62,152 66,180 78,196"
            stroke="#C87848"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />
        </g>
      )}

      {/* ── Stage 5: weeks 21–28 ── */}
      {stage === 5 && (
        <g transform={st}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-7; 0,0"
            dur="3.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={ks}
            additive="sum"
          />
          <path
            d="M100,86 C138,76 162,108 156,154 C150,196 112,208 84,184 C56,160 48,122 56,96 C64,74 82,94 100,86Z"
            fill={`url(#${bd})`}
          />
          <path
            d="M100,86 C138,76 162,108 156,154 C150,196 112,208 84,184 C56,160 48,122 56,96 C64,74 82,94 100,86Z"
            fill={`url(#${sh})`}
          />
          <circle cx="110" cy="50" r="42" fill={`url(#${hg})`} />
          <circle cx="110" cy="50" r="42" fill={`url(#${sh})`} />
          <ellipse cx="97" cy="36" rx="14" ry="15" fill="#FAD0B0" opacity="0.18" />
          {/* Closed eyelids — medical style */}
          <path
            d="M94,46 Q103,40 112,46"
            stroke="#6A2010"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M114,46 Q123,40 132,46"
            stroke="#6A2010"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          <ellipse cx="112" cy="60" rx="4" ry="3" fill="#904020" opacity="0.2" />
          <path
            d="M150,110 C170,102 178,78 158,60"
            stroke="#C07040"
            strokeWidth="13"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="156" cy="58" r="11" fill="#B06830" />
          {[-4, 1, 6].map((d, i) => (
            <line
              key={i}
              x1={156 + d}
              y1={54}
              x2={155 + d}
              y2={44}
              stroke="#986028"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          ))}
          <path
            d="M118,168 C136,184 132,204 108,208"
            stroke="#C07040"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="104" cy="209" rx="13" ry="7.5" fill="#B06830" />
          <path
            d="M76,176 C52,194 50,214 66,218"
            stroke="#A05028"
            strokeWidth="13"
            strokeLinecap="round"
            fill="none"
            opacity="0.58"
          />
          <path
            d="M80,126 C54,152 58,186 70,204"
            stroke="#C87848"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.26"
          />
        </g>
      )}

      {/* ── Stage 6: weeks 29–34, plump with hair ── */}
      {stage === 6 && (
        <g transform={st}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-7; 0,0"
            dur="3.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={ks}
            additive="sum"
          />
          <path
            d="M96,82 C144,70 170,106 162,156 C154,202 106,214 78,188 C50,162 42,122 52,94 C62,68 76,92 96,82Z"
            fill={`url(#${bd})`}
          />
          <path
            d="M96,82 C144,70 170,106 162,156 C154,202 106,214 78,188 C50,162 42,122 52,94 C62,68 76,92 96,82Z"
            fill={`url(#${sh})`}
          />
          <circle cx="112" cy="44" r="46" fill={`url(#${hg})`} />
          <circle cx="112" cy="44" r="46" fill={`url(#${sh})`} />
          <ellipse cx="97" cy="30" rx="16" ry="16" fill="#FAD0B0" opacity="0.16" />
          {[-16, -9, -2, 5, 12, 19].map((x, i) => (
            <path
              key={i}
              d={`M${112 + x},4 Q${113 + x},-6 ${111 + x},-10`}
              stroke="#8A3818"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.36"
            />
          ))}
          <path
            d="M92,40 Q103,33 114,40"
            stroke="#6A2010"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
          <path
            d="M116,40 Q127,33 138,40"
            stroke="#6A2010"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
          <ellipse cx="114" cy="53" rx="4.5" ry="3.5" fill="#904020" opacity="0.2" />
          <path
            d="M106,65 Q114,72 122,65"
            stroke="#904020"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.26"
          />
          <path
            d="M154,112 C176,104 182,78 164,60"
            stroke="#C07040"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="162" cy="58" r="12" fill="#B06830" />
          {[-5, 0, 6].map((d, i) => (
            <line
              key={i}
              x1={162 + d}
              y1={54}
              x2={162 + d}
              y2={43}
              stroke="#986028"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
          <path
            d="M112,172 C134,190 130,210 106,214"
            stroke="#C07040"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="102" cy="215" rx="14" ry="8" fill="#B06830" />
          <path
            d="M70,180 C44,200 42,220 60,224"
            stroke="#A05028"
            strokeWidth="13"
            strokeLinecap="round"
            fill="none"
            opacity="0.58"
          />
          <path
            d="M76,128 C46,160 50,196 62,214"
            stroke="#C87848"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.24"
          />
        </g>
      )}

      {/* ── Stage 7: weeks 35–40, full-term ── */}
      {stage === 7 && (
        <g transform={st}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-6; 0,0"
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines={ks}
            additive="sum"
          />
          <path
            d="M90,78 C148,64 178,104 166,160 C154,212 100,226 70,196 C40,166 32,124 44,92 C56,62 72,88 90,78Z"
            fill={`url(#${bd})`}
          />
          <path
            d="M90,78 C148,64 178,104 166,160 C154,212 100,226 70,196 C40,166 32,124 44,92 C56,62 72,88 90,78Z"
            fill={`url(#${sh})`}
          />
          <circle cx="114" cy="40" r="50" fill={`url(#${hg})`} />
          <circle cx="114" cy="40" r="50" fill={`url(#${sh})`} />
          <ellipse cx="98" cy="24" rx="18" ry="18" fill="#FAD0B0" opacity="0.14" />
          {[-20, -13, -6, 1, 8, 15, 22].map((x, i) => (
            <path
              key={i}
              d={`M${114 + x},-2 Q${115 + x},-14 ${113 + x},-18`}
              stroke="#8A3818"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
          ))}
          <path
            d="M90,34 Q103,26 116,34"
            stroke="#6A2010"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M120,34 Q133,26 146,34"
            stroke="#6A2010"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <ellipse cx="116" cy="49" rx="5" ry="4" fill="#904020" opacity="0.2" />
          <path
            d="M106,62 Q116,70 126,62"
            stroke="#904020"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.28"
          />
          <path
            d="M158,114 C182,104 188,76 168,56"
            stroke="#C07040"
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="166" cy="54" r="13" fill="#B06830" />
          {[-5, 0, 6].map((d, i) => (
            <line
              key={i}
              x1={166 + d}
              y1={49}
              x2={165 + d}
              y2={37}
              stroke="#986028"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          ))}
          <path
            d="M114,182 C138,202 134,222 108,226"
            stroke="#C07040"
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="104" cy="227" rx="15" ry="9" fill="#B06830" />
          <path
            d="M62,192 C36,214 34,230 54,234"
            stroke="#A05028"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity="0.58"
          />
          <path
            d="M70,132 C38,168 42,208 56,226"
            stroke="#C87848"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.22"
          />
        </g>
      )}
    </svg>
  );
}

// ─── Helper: get week from LMP ─────────────────────────────────────────────────

function getPregnancyInfo(lmpStr: string | null) {
  const lmp = lmpStr ? new Date(lmpStr) : new Date(Date.now() - 49 * 86400000); // demo: 7w
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - lmp.getTime()) / 86400000);
  const weeks = Math.min(Math.max(Math.floor(diffDays / 7), 1), 40);
  const days = diffDays % 7;
  const dueDate = new Date(lmp.getTime() + 280 * 86400000);
  const daysLeft = Math.max(Math.ceil((dueDate.getTime() - today.getTime()) / 86400000), 0);
  return { weeks, days, dueDate, daysLeft, lmp };
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

function fmtDateShort(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Week strip calendar (top) ─────────────────────────────────────────────────

function WeekStrip({ today }: { today: Date }) {
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  // Show current week (Sun–Sat)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="flex items-center justify-between px-4">
      {days.map((d, i) => {
        const isToday = d.toDateString() === today.toDateString();
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className="text-[11px] font-medium"
              style={{ color: isToday ? "#fff" : "rgba(255,255,255,0.65)" }}
            >
              {dayNames[i]}
            </span>
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-[14px] font-semibold",
                isToday ? "bg-white text-[#B05A2A]" : "text-white",
              )}
            >
              {d.getDate()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Details bottom sheet ──────────────────────────────────────────────────────

function DetailsSheet({ initialWeek, onClose }: { initialWeek: number; onClose: () => void }) {
  const [selectedWeek, setSelectedWeek] = useState(initialWeek);
  const scrollRef = useRef<HTMLDivElement>(null);
  const weeks = Array.from({ length: 40 }, (_, i) => i + 1);
  const data = WEEK_DATA[selectedWeek] || WEEK_DATA[7];

  // Auto-scroll week pills to the selected week on open
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector("[data-active-week]") as HTMLElement | null;
    if (activeBtn) {
      const left = activeBtn.offsetLeft - el.clientWidth / 2 + activeBtn.clientWidth / 2;
      el.scrollTo({ left, behavior: "instant" });
    }
  }, []);

  // Intercept hardware/swipe back to close the sheet instead of leaving the route.
  // We push one sentinel entry when the sheet opens so the back gesture has
  // something to pop. The popstate handler intercepts that pop and closes the sheet.
  // onClose is wrapped in useCallback in the parent so this effect only runs once.
  useEffect(() => {
    window.history.pushState({ detailsSheet: true }, "");
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      // If the sheet is closed programmatically (not via back), clean up the
      // sentinel history entry so we don't leave extra entries behind.
      if (window.history.state?.detailsSheet) {
        window.history.back();
      }
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "linear-gradient(160deg, #f4c09a 0%, #e8956d 55%, #f0b080 100%)" }}
    >
      {/* Back / Close — prominent pill button */}
      <div className="flex items-center px-4 pt-12 pb-2">
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex items-center gap-2 rounded-full bg-white/30 px-4 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
        >
          <ArrowLeft className="size-4" strokeWidth={2.5} />
          <span className="text-[13px] font-semibold">Back</span>
        </button>
      </div>

      {/* Fetus illustration */}
      <div className="flex flex-1 items-center justify-center">
        <FetusSvg week={selectedWeek} size={240} />
      </div>

      {/* Week selector pills */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" ref={scrollRef}>
          {weeks.map((w) => (
            <button
              key={w}
              data-active-week={w === selectedWeek ? "" : undefined}
              onClick={() => setSelectedWeek(w)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
                selectedWeek === w ? "bg-white text-[#B05A2A] shadow-md" : "bg-white/20 text-white",
              )}
            >
              {w} {w === 1 ? "week" : "weeks"}
            </button>
          ))}
        </div>
      </div>

      {/* Content bottom sheet */}
      <div
        className="max-h-[55vh] overflow-y-auto rounded-t-3xl bg-white px-5 pb-12 pt-3"
        style={{ boxShadow: "0 -4px 30px rgba(0,0,0,0.1)" }}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

        <h2 className="font-display text-[24px] font-bold text-foreground">
          What happens at {selectedWeek} {selectedWeek === 1 ? "week" : "weeks"}
        </h2>

        {/* Doctor badge */}
        <div className="mt-3 flex items-start gap-3 rounded-xl bg-gray-50 p-3">
          <div className="relative shrink-0">
            <div className="grid size-10 place-items-center rounded-full bg-gray-200 text-[18px]">
              👩‍⚕️
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-teal-500 text-white">
              <span className="text-[8px] font-bold">✓</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Reviewed by</p>
            <p className="text-[12px] font-semibold text-foreground">Dr. Sarah Mitchell, OB-GYN</p>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Obstetrician and gynecologist, 10+ years in obstetrics
            </p>
          </div>
        </div>

        {/* Size comparison */}
        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-orange-50 p-4">
          <span className="text-5xl">{data.fruitEmoji}</span>
          <div>
            <p className="text-[13px] font-semibold text-foreground">Size of a {data.fruit}</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Length: {data.lengthMm} ({data.lengthIn})
            </p>
            <p className="text-[12px] text-muted-foreground">
              Weight: {data.weightG} ({data.weightOz})
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-1">
              All measurements approximate and vary within normal range
            </p>
          </div>
        </div>

        {/* Baby development */}
        <h3 className="mt-5 text-[16px] font-bold text-foreground">{data.babyHeadline}</h3>
        {data.babyBody.map((p, i) => (
          <p key={i} className="mt-2 text-[14px] leading-relaxed text-gray-700">
            {p}
          </p>
        ))}

        {/* Your body */}
        <h3 className="mt-5 text-[16px] font-bold text-foreground">{data.bodyHeadline}</h3>
        {data.bodyBody.map((p, i) => (
          <p key={i} className="mt-2 text-[14px] leading-relaxed text-gray-700">
            {p}
          </p>
        ))}

        {/* Symptoms */}
        <h3 className="mt-5 text-[16px] font-bold text-foreground">Common symptoms</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.symptoms.map((s) => (
            <span
              key={s}
              className="rounded-full bg-orange-100 px-3 py-1 text-[12px] font-medium text-orange-800"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-5 rounded-2xl bg-teal-50 p-4">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-teal-600">
            💡 Tip for week {selectedWeek}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-teal-900">{data.tip}</p>
        </div>

        {/* Milestone badge */}
        {data.milestone && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-3">
            <span className="text-xl">🌟</span>
            <p className="text-[13px] font-semibold text-orange-700">{data.milestone}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Insight cards (horizontal scroll) ────────────────────────────────────────

function InsightCards({
  week,
  data,
  onOpenDetails,
}: {
  week: number;
  data: WeekData;
  onOpenDetails: () => void;
}) {
  const cards = [
    {
      id: "log",
      title: "Log your\nsymptoms",
      bg: "bg-white border border-gray-100",
      content: (
        <div className="mt-auto flex size-12 items-center justify-center rounded-full bg-rose-500">
          <Plus className="size-6 text-white" strokeWidth={2.5} />
        </div>
      ),
    },
    {
      id: "baby",
      title: `Your baby\nat ${week} ${week === 1 ? "week" : "weeks"}`,
      bg: "bg-stone-100",
      content: (
        <div className="mt-auto flex items-center gap-1">
          <FetusSvg week={week} size={58} />
          <span className="text-3xl">{data.fruitEmoji}</span>
        </div>
      ),
      onClick: onOpenDetails,
    },
    {
      id: "body",
      title: `Your body\nat ${week} ${week === 1 ? "week" : "weeks"}`,
      bg: "bg-sky-100",
      content: <div className="mt-auto text-4xl">🫁</div>,
      onClick: onOpenDetails,
    },
    {
      id: "symptoms",
      title: "Symptoms\nthis week",
      bg: "bg-purple-50",
      content: <div className="mt-auto text-4xl">😔</div>,
      onClick: onOpenDetails,
    },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-none">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={card.onClick}
          className={cn(
            "flex h-40 w-36 shrink-0 flex-col rounded-2xl p-3 text-left shadow-sm transition-transform active:scale-[0.97]",
            card.bg,
          )}
        >
          <p className="text-[13px] font-bold leading-snug text-foreground whitespace-pre-line">
            {card.title}
          </p>
          {card.content}
        </button>
      ))}
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────────

function PregnantScreen() {
  const [showDetails, setShowDetails] = useState(false);
  // Stable reference so DetailsSheet's useEffect doesn't re-run on every render
  const handleCloseDetails = useCallback(() => setShowDetails(false), []);
  const today = new Date();

  const lmpStr =
    typeof window !== "undefined" ? window.localStorage.getItem("petal:lastPeriod") : null;
  const { weeks, days, dueDate, daysLeft } = getPregnancyInfo(lmpStr);
  const data = WEEK_DATA[weeks] || WEEK_DATA[7];

  const monthLabel = today.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  return (
    <>
      {showDetails && <DetailsSheet initialWeek={weeks} onClose={handleCloseDetails} />}

      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        {/* ── Hero gradient zone ── */}
        <div
          className="relative flex flex-col pb-10"
          style={{
            background: "linear-gradient(160deg, #f4c09a 0%, #e8956d 55%, #f0b080 100%)",
            minHeight: "62vh",
          }}
        >
          {/* Top bar — ProfileIcon left, date centre, spacer right */}
          <div className="flex items-center justify-between px-5 pt-12">
            <ProfileIcon variant="light" />
            <p className="text-[16px] font-semibold text-white">{monthLabel}</p>
            <span className="size-9" aria-hidden />
          </div>

          {/* Mode switcher — sits just below the top bar */}
          <div className="mt-2 flex justify-center">
            <ModeSwitcherPill />
          </div>

          {/* Week strip */}
          <div className="mt-2">
            <WeekStrip today={today} />
          </div>

          {/* Fetus */}
          <div className="flex flex-1 items-center justify-center py-4">
            <FetusSvg week={weeks} size={200} />
          </div>

          {/* Pregnancy age */}
          <div className="flex flex-col items-center gap-3 pb-2">
            <button onClick={() => setShowDetails(true)} className="flex items-center gap-1.5">
              <span className="font-display text-[30px] font-bold" style={{ color: "#7B3A10" }}>
                {weeks} {weeks === 1 ? "week" : "weeks"}
                {days > 0 ? `, ${days} day${days > 1 ? "s" : ""}` : ""}
              </span>
              <Info className="size-5" style={{ color: "#9B5A30" }} />
            </button>

            <button
              onClick={() => setShowDetails(true)}
              className="rounded-full bg-white px-8 py-2.5 text-[15px] font-semibold shadow-md transition-transform active:scale-[0.97]"
              style={{ color: "#C07040" }}
            >
              Details
            </button>
          </div>
        </div>

        {/* ── White content zone ── */}
        <div className="flex-1 bg-background pb-32">
          {/* Due date strip */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Due date</p>
              <p className="text-[14px] font-semibold text-foreground">{fmtDate(dueDate)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Days left
              </p>
              <p className="text-[14px] font-semibold text-foreground">{daysLeft} days</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Baby size
              </p>
              <p className="text-[14px] font-semibold text-foreground">
                {data.fruitEmoji} {data.fruit}
              </p>
            </div>
          </div>

          {/* Daily insights */}
          <div className="mt-5">
            <div className="flex items-baseline justify-between px-5 pb-3">
              <h2 className="text-[17px] font-bold text-foreground">My daily insights</h2>
              <span className="text-[13px] text-muted-foreground">Today</span>
            </div>
            <InsightCards week={weeks} data={data} onOpenDetails={() => setShowDetails(true)} />
          </div>

          {/* Tip of the day */}
          <div className="mx-5 mt-5 rounded-2xl bg-orange-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-500">
              Tip · Week {weeks}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-orange-900">{data.tip}</p>
          </div>

          {/* Milestone */}
          {data.milestone && (
            <div className="mx-5 mt-3 flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
              <span className="text-2xl">🌟</span>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-orange-600">
                  Milestone
                </p>
                <p className="text-[14px] font-semibold text-orange-900">{data.milestone}</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="mx-5 mt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-[13px] font-semibold text-foreground">Pregnancy progress</p>
              <p className="text-[12px] text-muted-foreground">{weeks}/40 weeks</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min((weeks / 40) * 100, 100)}%`,
                  background: "linear-gradient(90deg, #f4a070, #e8956d)",
                }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>1st trimester</span>
              <span>2nd trimester</span>
              <span>3rd trimester</span>
            </div>
          </div>

          {/* Next appointment reminder */}
          <div className="mx-5 mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="text-2xl">📋</span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">Next appointment</p>
              <p className="text-[12px] text-muted-foreground">
                {weeks < 12
                  ? "Book your 12-week scan"
                  : weeks < 20
                    ? "20-week anomaly scan coming up"
                    : weeks < 28
                      ? "Glucose tolerance test (24–28 weeks)"
                      : weeks < 36
                        ? "Antenatal check-up"
                        : "Weekly midwife appointment"}
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </div>

        {/* ── Bottom navigation (same as every other screen) ── */}
        <BottomNav />
      </div>
    </>
  );
}
