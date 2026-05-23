import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { X, Info, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pregnant")({
  head: () => ({
    meta: [
      { title: "Pregnancy — Petal" },
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
    fruit: "Sesame seed", fruitEmoji: "🌱",
    lengthMm: "< 1 mm", weightG: "< 0.1 g", lengthIn: "< 0.1 in", weightOz: "< 0.01 oz",
    babyHeadline: "Fertilisation",
    babyBody: ["The egg and sperm have just united to form a single cell called a zygote.", "This tiny cell contains all the genetic information that will determine your baby's traits.", "The zygote starts dividing rapidly as it travels to the uterus."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You may not know you're pregnant yet — most tests won't detect hCG this early.", "Hormones are beginning to shift to prepare the uterine lining for implantation.", "Light spotting (implantation bleeding) can occur around days 10–14 post-ovulation."],
    symptoms: ["Mild cramping", "Light spotting", "Fatigue", "Breast tenderness"],
    tip: "Start a prenatal vitamin with at least 400 mcg of folic acid if you haven't already.",
  },
  2: {
    fruit: "Poppy seed", fruitEmoji: "🌿",
    lengthMm: "< 1 mm", weightG: "< 0.1 g", lengthIn: "< 0.1 in", weightOz: "< 0.01 oz",
    babyHeadline: "Implantation",
    babyBody: ["The blastocyst burrows into the uterine lining — a process called implantation.", "Cells are differentiating into those that form the placenta and those that form the embryo.", "The amniotic cavity is beginning to form."],
    bodyHeadline: "Your body this week",
    bodyBody: ["hCG levels start rising — a home pregnancy test may turn positive.", "The corpus luteum produces progesterone to maintain the pregnancy.", "You might feel nothing yet, or notice mild bloating and breast tenderness."],
    symptoms: ["Bloating", "Mild cramps", "Breast sensitivity", "Mood changes"],
    tip: "Schedule your first prenatal appointment for around 8–10 weeks.",
  },
  3: {
    fruit: "Poppy seed", fruitEmoji: "🌱",
    lengthMm: "1–2 mm", weightG: "< 0.1 g", lengthIn: "< 0.1 in", weightOz: "< 0.01 oz",
    babyHeadline: "Embryo forms",
    babyBody: ["Three distinct layers — ectoderm, mesoderm, endoderm — are taking shape.", "The neural tube, which becomes the brain and spinal cord, begins to form.", "The foundation for the heart, lungs, kidneys and gut is being laid."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Morning sickness may begin — though it can strike at any time of day.", "Your uterus starts to enlarge slightly.", "Blood volume will increase by up to 50% over the pregnancy."],
    symptoms: ["Nausea", "Fatigue", "Frequent urination", "Food aversions"],
    tip: "Eat small, frequent meals to help ease nausea.",
  },
  4: {
    fruit: "Poppy seed", fruitEmoji: "⚫",
    lengthMm: "2 mm", weightG: "< 0.1 g", lengthIn: "0.08 in", weightOz: "< 0.01 oz",
    babyHeadline: "Neural tube closes",
    babyBody: ["The neural tube closes this week — folic acid is critical right now.", "A tiny heart-like structure starts beating around day 22–23.", "Arm and leg buds are emerging as small paddles.", "The face is beginning to form with dark spots where eyes will be."],
    bodyHeadline: "Your body this week",
    bodyBody: ["The embryo produces hCG, which keeps progesterone flowing and your period from arriving.", "Your uterus is about the size of an orange.", "Tender, swollen breasts are very common."],
    symptoms: ["Breast tenderness", "Nausea", "Fatigue", "Heightened sense of smell"],
    tip: "Avoid alcohol, smoking, and unpasteurised foods entirely from now on.",
    milestone: "Heart starts beating",
  },
  5: {
    fruit: "Sesame seed", fruitEmoji: "🫘",
    lengthMm: "4 mm", weightG: "< 0.1 g", lengthIn: "0.16 in", weightOz: "< 0.01 oz",
    babyHeadline: "Organs forming",
    babyBody: ["Major organs — heart, stomach, liver, kidneys — are all beginning to form.", "The tiny heart is now beating about 100–160 times per minute.", "Limb buds are elongating into recognisable arm and leg shapes.", "The gut is taking shape and the embryo has a C-curve."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Morning sickness may peak around weeks 6–8 for many women.", "Your basal metabolic rate increases to support the growing embryo.", "Progesterone causes smooth muscles to relax, which can cause constipation."],
    symptoms: ["Vomiting", "Saliva increase", "Headaches", "Light-headedness"],
    tip: "Ginger tea, crackers before getting up, and acupressure wristbands can ease nausea.",
  },
  6: {
    fruit: "Sweet pea", fruitEmoji: "🟢",
    lengthMm: "6 mm", weightG: "< 0.1 g", lengthIn: "0.25 in", weightOz: "< 0.01 oz",
    babyHeadline: "Face is forming",
    babyBody: ["Dark spots for eyes and tiny depressions for nostrils are visible.", "The jaw, cheeks and chin are beginning to form.", "Tiny webbed fingers and toes are emerging.", "The intestines are growing inside the umbilical cord (this is normal)."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Your uterus has doubled in size since conception.", "Cervical mucus increases to form the protective mucus plug.", "You may experience vivid dreams due to hormonal changes."],
    symptoms: ["Vivid dreams", "Bloating", "Constipation", "Increased urination"],
    tip: "Stay hydrated — aim for at least 8–10 glasses of water per day.",
  },
  7: {
    fruit: "Blueberry", fruitEmoji: "🫐",
    lengthMm: "10 mm", weightG: "< 1 g", lengthIn: "0.39 in", weightOz: "< 0.04 oz",
    babyHeadline: "Developing limbs",
    babyBody: ["Your baby is growing at a rapid rate — about 1 mm per day.", "They're making around 100 new brain cells per minute.", "Limbs are lengthening and the paddle-shaped hands are developing distinct fingers.", "Eyelids are forming over the eyes.", "The tongue and inner ear structures are developing."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Your uterus is the size of a large orange.", "You may notice your waist thickening slightly.", "Fatigue is very common — your body is working as hard as climbing a mountain every day."],
    symptoms: ["Extreme fatigue", "Nausea", "Heartburn", "Mood swings"],
    tip: "Rest as much as your schedule allows — fatigue is your body's way of telling you to slow down.",
  },
  8: {
    fruit: "Raspberry", fruitEmoji: "🍓",
    lengthMm: "16 mm", weightG: "1 g", lengthIn: "0.63 in", weightOz: "0.04 oz",
    babyHeadline: "All organs present",
    babyBody: ["All major organs have begun forming — the embryo is now called a fetus.", "The tail has disappeared and your baby looks more human.", "Fingers and toes are distinct (though still webbed).", "The baby can now move, though you won't feel it yet.", "Taste buds are beginning to form."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Your first prenatal appointment is usually around now.", "Expect a transvaginal ultrasound to confirm the heartbeat.", "Your blood pressure may be slightly lower than normal."],
    symptoms: ["Food cravings", "Aversions", "Bloating", "Breast growth"],
    tip: "First prenatal visit: bring questions, your medical history, and a list of any medications.",
    milestone: "Embryo → Fetus",
  },
  9: {
    fruit: "Cherry", fruitEmoji: "🍒",
    lengthMm: "23 mm", weightG: "2 g", lengthIn: "0.9 in", weightOz: "0.07 oz",
    babyHeadline: "Tiny movements",
    babyBody: ["The fetus is now moving spontaneously, though too small to feel.", "Muscles are developing and the baby can flex its joints.", "The reproductive organs are forming, but sex isn't identifiable yet on ultrasound.", "Eyelids are fused shut and will stay that way until ~26 weeks."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Your uterus is the size of a grapefruit.", "Mood swings can be intense — oestrogen and progesterone are both surging.", "Some women find their skin glows; others experience breakouts."],
    symptoms: ["Mood swings", "Acne", "Fatigue", "Nasal congestion"],
    tip: "Prenatal yoga or gentle walks can help with mood and energy levels.",
  },
  10: {
    fruit: "Kumquat", fruitEmoji: "🍊",
    lengthMm: "31 mm", weightG: "4 g", lengthIn: "1.2 in", weightOz: "0.14 oz",
    babyHeadline: "Critical development complete",
    babyBody: ["The most critical period of organ development is complete.", "Vital organs are formed and beginning to function.", "The baby's bones are starting to harden from cartilage.", "Fingernails and hair follicles are forming.", "The intestines return from the cord into the abdomen."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Your risk of miscarriage drops significantly after week 10.", "Round ligament pain — sharp twinges in your lower abdomen — may appear as your uterus grows.", "Some women notice a darkening of the linea nigra (midline abdominal line)."],
    symptoms: ["Round ligament pain", "Leg cramps", "Indigestion", "Visible veins on breasts"],
    tip: "This is a good time to discuss NIPT (non-invasive prenatal testing) with your doctor.",
  },
  11: {
    fruit: "Fig", fruitEmoji: "🫒",
    lengthMm: "41 mm", weightG: "7 g", lengthIn: "1.6 in", weightOz: "0.25 oz",
    babyHeadline: "Baby stretches",
    babyBody: ["Your baby can now open and close their fists.", "Tooth buds are forming for all 20 baby teeth.", "Hiccups may begin — a sign the diaphragm is practising.", "The baby's irises are developing, though eye colour isn't set until after birth."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Morning sickness often starts to ease around 11–13 weeks.", "Your uterus moves up out of the pelvis — pressure on the bladder decreases.", "First-trimester screening (nuchal translucency ultrasound + blood tests) is usually done now."],
    symptoms: ["Reduced nausea", "Continued fatigue", "Skin changes", "Increased appetite"],
    tip: "Book your nuchal translucency scan if you haven't — it's done between 11 and 13+6 weeks.",
  },
  12: {
    fruit: "Lime", fruitEmoji: "🍋",
    lengthMm: "54 mm", weightG: "14 g", lengthIn: "2.1 in", weightOz: "0.49 oz",
    babyHeadline: "First trimester milestone",
    babyBody: ["Reflexes are developing — the baby grabs, swallows and moves toes.", "The pituitary gland begins producing hormones.", "White blood cells are forming to fight infection after birth.", "The baby can yawn and make sucking motions."],
    bodyHeadline: "Your body this week",
    bodyBody: ["End of the first trimester! Miscarriage risk drops to around 1–2%.", "You may start to 'show' — a small bump can appear.", "Energy often returns in the second trimester."],
    symptoms: ["Improved energy", "Reduced nausea", "Visible bump", "Heartburn"],
    tip: "Many people choose to share pregnancy news after the 12-week scan.",
    milestone: "End of 1st trimester",
  },
  13: {
    fruit: "Peach", fruitEmoji: "🍑",
    lengthMm: "65 mm", weightG: "23 g", lengthIn: "2.6 in", weightOz: "0.81 oz",
    babyHeadline: "Fingerprints form",
    babyBody: ["Unique fingerprints are forming on the baby's fingertips.", "Vocal cords are developing.", "The liver is producing bile; the spleen is producing red blood cells.", "The baby's head is about a third of its total body length."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Welcome to the second trimester! Many women feel a surge of energy.", "Colostrum — the first breast milk — may begin to form.", "Varicose veins can appear as blood volume increases."],
    symptoms: ["Increased energy", "Breast leakage (colostrum)", "Nosebleeds", "Gum sensitivity"],
    tip: "Gentle dental care is especially important — hormones can cause gum inflammation.",
  },
  14: {
    fruit: "Lemon", fruitEmoji: "🍋",
    lengthMm: "80 mm", weightG: "43 g", lengthIn: "3.1 in", weightOz: "1.52 oz",
    babyHeadline: "Hair and eyebrows",
    babyBody: ["Fine hair (lanugo) starts to cover the body for warmth.", "Eyebrows and eyelashes are beginning to grow.", "The baby can make facial expressions — squinting, grimacing, frowning.", "The kidneys are producing urine which goes into the amniotic fluid."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Your uterus rises above your pubic bone — you may look visibly pregnant.", "Increased libido is common in the second trimester for many women.", "Braxton Hicks contractions (painless tightening) can begin."],
    symptoms: ["Braxton Hicks", "Increased appetite", "Backache", "Skin darkening"],
    tip: "Start moisturising your growing belly to help skin elasticity.",
  },
  15: {
    fruit: "Apple", fruitEmoji: "🍎",
    lengthMm: "93 mm", weightG: "70 g", lengthIn: "3.7 in", weightOz: "2.47 oz",
    babyHeadline: "Sensitive to light",
    babyBody: ["The baby can sense light through its eyelids even though they're fused shut.", "They're practising breathing, inhaling and exhaling amniotic fluid.", "Taste receptors are developing — the baby tastes what you eat through amniotic fluid.", "Bones are getting harder every day."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You may feel first flutters of movement ('quickening') — like butterflies or gas bubbles.", "Weight gain accelerates — about 450g (1 lb) per week is normal now.", "Your centre of gravity is shifting, which can affect balance."],
    symptoms: ["Quickening (flutters)", "Nosebleeds", "Swollen gums", "Skin itching"],
    tip: "Sleep on your left side to improve circulation to the placenta.",
  },
  16: {
    fruit: "Avocado", fruitEmoji: "🥑",
    lengthMm: "116 mm", weightG: "100 g", lengthIn: "4.6 in", weightOz: "3.53 oz",
    babyHeadline: "Facial expressions",
    babyBody: ["The baby's legs are longer than the arms now.", "They can grasp the umbilical cord.", "Eyes are moving slowly side-to-side.", "The baby is holding its head more erect.", "Toenails are growing."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Amniocentesis, if chosen, is typically offered between 15–20 weeks.", "Your bump is clearly visible.", "You might experience round ligament pain as the uterus grows."],
    symptoms: ["Visible bump", "Round ligament pain", "Constipation", "Heartburn"],
    tip: "Kegel exercises help strengthen pelvic floor muscles — do 10–15 three times a day.",
  },
  17: {
    fruit: "Pear", fruitEmoji: "🍐",
    lengthMm: "130 mm", weightG: "140 g", lengthIn: "5.1 in", weightOz: "4.94 oz",
    babyHeadline: "Fat begins forming",
    babyBody: ["The baby begins to accumulate brown fat, which will help regulate body temperature after birth.", "Sweat glands are developing.", "Cartilage throughout the skeleton is turning to bone.", "The umbilical cord is thickening and growing stronger."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Your blood volume has increased by about 40%.", "Carpal tunnel syndrome can develop from fluid retention.", "You may notice your belly button starting to push outward."],
    symptoms: ["Carpal tunnel", "Tingling hands", "Belly button changing", "Stretch marks"],
    tip: "Eating iron-rich foods (leafy greens, red meat, legumes) helps support your increased blood volume.",
  },
  18: {
    fruit: "Bell pepper", fruitEmoji: "🫑",
    lengthMm: "143 mm", weightG: "190 g", lengthIn: "5.6 in", weightOz: "6.7 oz",
    babyHeadline: "Baby is yawning",
    babyBody: ["The baby yawns, hiccups and rolls inside the womb.", "The ears are now in position and the baby can hear sounds.", "Myelin is beginning to coat nerve fibres to speed up brain signals.", "Female babies' fallopian tubes and uterus are fully formed."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You should feel definite movements now if this isn't your first pregnancy.", "Your uterus is about the size of a cantaloupe.", "Dizziness can occur if you stand up too quickly (postural hypotension)."],
    symptoms: ["Baby movements", "Dizziness", "Back pain", "Leg cramps"],
    tip: "Talk, read or sing to your baby — they can now hear your voice.",
  },
  19: {
    fruit: "Mango", fruitEmoji: "🥭",
    lengthMm: "152 mm", weightG: "240 g", lengthIn: "6.0 in", weightOz: "8.47 oz",
    babyHeadline: "Vernix forms",
    babyBody: ["A white, waxy coating (vernix caseosa) is covering the skin to protect it from amniotic fluid.", "The senses of taste, smell, sight, touch and hearing are developing.", "The baby's brain is mapping out specialised areas for each sense.", "Legs are now in proportion with the rest of the body."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Round ligament pain is very common as the uterus grows sideways.", "You may notice a dark line (linea nigra) running down your bump.", "Your posture is changing — try to be mindful of your back."],
    symptoms: ["Linea nigra", "Round ligament pain", "Increased appetite", "Mild oedema"],
    tip: "The 20-week anomaly scan is coming up — this is an exciting milestone.",
  },
  20: {
    fruit: "Banana", fruitEmoji: "🍌",
    lengthMm: "164 mm", weightG: "300 g", lengthIn: "6.5 in", weightOz: "10.6 oz",
    babyHeadline: "Halfway there!",
    babyBody: ["Your baby now measures from crown to heel (not just crown to rump).", "The 20-week scan can usually reveal the sex.", "They're swallowing amniotic fluid — which helps the digestive system mature.", "Meconium (first poo) is forming in the intestines.", "The baby is sleeping and waking in cycles."],
    bodyHeadline: "Your body this week",
    bodyBody: ["The top of your uterus (fundus) is at your belly button.", "Oedema (swelling) in feet and ankles is very common.", "Shortness of breath may increase as your uterus pushes up on your diaphragm."],
    symptoms: ["Oedema", "Shortness of breath", "Kick counting begins", "Pelvic pain"],
    tip: "Congratulations on reaching the halfway point! Celebrate this milestone.",
    milestone: "Halfway there! 20 weeks",
  },
  21: {
    fruit: "Carrot", fruitEmoji: "🥕",
    lengthMm: "267 mm", weightG: "360 g", lengthIn: "10.5 in", weightOz: "12.7 oz",
    babyHeadline: "Kicks & punches",
    babyBody: ["Kicks, punches and somersaults are getting stronger and more frequent.", "The baby's digestive system is practising — it swallows up to a litre of fluid a day.", "Male babies' testes start descending from the abdomen.", "Bone marrow is starting to produce red blood cells."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You may experience Braxton Hicks contractions more often.", "Symphysis pubis dysfunction (SPD) — pelvic girdle pain — can develop.", "Varicose veins in legs and vulva are more common now."],
    symptoms: ["SPD/pelvic pain", "Varicose veins", "Braxton Hicks", "Hip pain"],
    tip: "A pregnancy pillow between your knees can significantly ease pelvic and hip pain at night.",
  },
  22: {
    fruit: "Papaya", fruitEmoji: "🫛",
    lengthMm: "277 mm", weightG: "430 g", lengthIn: "10.9 in", weightOz: "15.2 oz",
    babyHeadline: "Grip strength",
    babyBody: ["The baby has a strong grip and will grab at the umbilical cord.", "Lips and eyebrows are distinct and visible on ultrasound.", "The baby now has sleep cycles of 12–14 hours a day.", "Melanin is beginning to pigment the skin — though all babies are born with lighter skin."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Your belly may feel itchy as the skin stretches.", "Haemorrhoids (piles) are common due to increased blood flow and pressure.", "Some women experience linea nigra extending above the belly button."],
    symptoms: ["Itchy belly", "Haemorrhoids", "Swollen ankles", "Stretch marks"],
    tip: "Wearing compression socks can help with oedema and varicose veins.",
  },
  23: {
    fruit: "Grapefruit", fruitEmoji: "🍊",
    lengthMm: "287 mm", weightG: "501 g", lengthIn: "11.3 in", weightOz: "17.7 oz",
    babyHeadline: "Listens to music",
    babyBody: ["The baby reacts to music and familiar voices.", "Fat deposits beneath the skin are increasing, making it less translucent.", "Rapid eye movement (REM) sleep — and possibly dreaming — may begin.", "The pancreas is developing and producing insulin."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You may notice Braxton Hicks more frequently, especially after activity.", "Ankle and foot swelling is very common in the afternoon.", "The uterus is now above your belly button."],
    symptoms: ["Frequent Braxton Hicks", "Swelling", "Backache", "Insomnia"],
    tip: "Lie on your left side to reduce swelling — it improves blood flow back to the heart.",
  },
  24: {
    fruit: "Corn", fruitEmoji: "🌽",
    lengthMm: "298 mm", weightG: "600 g", lengthIn: "11.8 in", weightOz: "21.2 oz",
    babyHeadline: "Viability milestone",
    babyBody: ["At 24 weeks, babies born prematurely have a chance of survival with intensive care.", "Lung alveoli (air sacs) are forming and will continue maturing until birth.", "The brain is growing rapidly — it will triple in volume in the third trimester.", "Taste buds are fully formed."],
    bodyHeadline: "Your body this week",
    bodyBody: ["The glucose tolerance test (GDM screen) is typically done between 24–28 weeks.", "Your ribs may feel sore as the uterus pushes upward.", "Colostrum can sometimes leak from the nipples."],
    symptoms: ["Rib pain", "Colostrum leakage", "Insomnia", "Skin changes"],
    tip: "Book a gestational diabetes test (OGTT) if not already scheduled.",
    milestone: "Viability milestone",
  },
  25: {
    fruit: "Cauliflower", fruitEmoji: "🥦",
    lengthMm: "347 mm", weightG: "660 g", lengthIn: "13.6 in", weightOz: "23.3 oz",
    babyHeadline: "Responds to touch",
    babyBody: ["The baby can feel you touching your bump from the inside.", "They're starting to look more like a newborn — though still very thin.", "The baby is beginning to respond to pain.", "Hair on the head is growing."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Sciatic nerve pain can shoot down one or both legs.", "You may experience carpal tunnel symptoms due to fluid retention.", "Your posture is being pulled forward by the growing bump."],
    symptoms: ["Sciatica", "Carpal tunnel", "Heartburn", "Shortness of breath"],
    tip: "Prenatal massage and physiotherapy can help manage sciatic pain.",
  },
  26: {
    fruit: "Scallion", fruitEmoji: "🧅",
    lengthMm: "359 mm", weightG: "760 g", lengthIn: "14.1 in", weightOz: "26.8 oz",
    babyHeadline: "Eyes open",
    babyBody: ["The baby opens their eyes for the first time this week.", "They can now blink and react to light shining on your belly.", "The brain is taking control of rhythmic breathing movements.", "Fingernails have grown to reach the fingertips."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Sleep becomes more challenging as the bump grows.", "Heartburn is often at its worst now — the uterus pushes acid upward.", "Braxton Hicks may be strong enough to stop you in your tracks."],
    symptoms: ["Heartburn", "Sleep disturbance", "Strong Braxton Hicks", "Pelvic pressure"],
    tip: "Eating smaller meals and staying upright for 30 minutes after eating helps heartburn.",
  },
  27: {
    fruit: "Lettuce head", fruitEmoji: "🥬",
    lengthMm: "368 mm", weightG: "875 g", lengthIn: "14.5 in", weightOz: "30.9 oz",
    babyHeadline: "End of second trimester",
    babyBody: ["The baby is practising breathing by inhaling amniotic fluid.", "The brain is developing billions of neurons.", "They can recognise your voice and may turn toward familiar sounds.", "Taste preferences are being shaped by what you eat."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You're entering the third trimester next week — the final stretch!", "Pelvic floor weakness can cause leaking when you cough or sneeze.", "Haemorrhoids and varicose veins may worsen.", "You may feel breathless just walking up stairs."],
    symptoms: ["Breathlessness", "Pelvic pressure", "Leaking urine", "Wrist/hand pain"],
    tip: "Start thinking about your birth plan — this is a great time to discuss it with your midwife.",
  },
  28: {
    fruit: "Aubergine", fruitEmoji: "🍆",
    lengthMm: "380 mm", weightG: "1005 g", lengthIn: "14.8 in", weightOz: "35.4 oz",
    babyHeadline: "Third trimester begins",
    babyBody: ["Your baby weighs about 1 kg (just over 2 lbs) for the first time.", "They can now dream during REM sleep.", "The baby's eyes can track light.", "Bone marrow has fully taken over red blood cell production."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Antenatal appointments become more frequent — every 2–4 weeks.", "You may be offered a whooping cough vaccination (recommended between 16–32 weeks).", "Colostrum may leak more noticeably."],
    symptoms: ["Shortness of breath", "Frequent urination", "Leg cramps", "Insomnia"],
    tip: "Third trimester — start tracking kick counts daily. Ten movements in 2 hours is reassuring.",
    milestone: "Third trimester begins",
  },
  29: {
    fruit: "Butternut squash", fruitEmoji: "🎃",
    lengthMm: "388 mm", weightG: "1153 g", lengthIn: "15.2 in", weightOz: "40.7 oz",
    babyHeadline: "Rapid brain growth",
    babyBody: ["The brain is growing rapidly, developing grooves and folds.", "The baby is accumulating iron, calcium and phosphorus.", "Muscles and lungs are continuing to mature.", "The baby is increasingly sensitive to light, sound and pain."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Baby's movements may feel like they're decreasing — but they shouldn't stop.", "Pelvic girdle pain (PGP) often worsens in the third trimester.", "You may be waking frequently at night to urinate."],
    symptoms: ["Pelvic girdle pain", "Nocturia", "Fatigue", "Swelling"],
    tip: "Contact your midwife immediately if you notice reduced fetal movements.",
  },
  30: {
    fruit: "Cabbage", fruitEmoji: "🥬",
    lengthMm: "399 mm", weightG: "1319 g", lengthIn: "15.7 in", weightOz: "46.5 oz",
    babyHeadline: "Fat layers thicken",
    babyBody: ["The baby's brain is growing so fast it's developing wrinkles to increase surface area.", "Fat layers beneath the skin are thickening — the baby looks chubbier.", "Lanugo is beginning to disappear as the baby plumps up.", "Red blood cells are fully functional."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You've gained around 8–11 kg (18–25 lbs) by now on average.", "The uterus is 10 cm above the belly button.", "Braxton Hicks contractions may be more frequent and stronger."],
    symptoms: ["Braxton Hicks", "Shortness of breath", "Heartburn", "Stretch marks"],
    tip: "Pack your hospital bag — it's easier to do it now than in the chaos of early labour.",
  },
  31: {
    fruit: "Coconut", fruitEmoji: "🥥",
    lengthMm: "411 mm", weightG: "1502 g", lengthIn: "16.2 in", weightOz: "53.0 oz",
    babyHeadline: "All five senses",
    babyBody: ["All five senses are now operational.", "The baby is processing information, tracking light and responding to sound.", "The baby spends more time in quiet alert states.", "Hiccups are common — you'll feel rhythmic jolts."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Colostrum leakage from nipples is normal.", "You may feel the baby 'drop' into the pelvis (lightening) in the coming weeks.", "Anxiety about labour is common — antenatal classes can really help."],
    symptoms: ["Frequent hiccups felt", "Nipple leakage", "Nesting instinct", "Insomnia"],
    tip: "If you haven't already, book antenatal classes — hypnobirthing is popular and evidence-based.",
  },
  32: {
    fruit: "Jicama", fruitEmoji: "🍈",
    lengthMm: "422 mm", weightG: "1702 g", lengthIn: "16.7 in", weightOz: "60.0 oz",
    babyHeadline: "Practising breathing",
    babyBody: ["The baby is practising breathing movements for up to 40 minutes at a time.", "Toenails are fully formed.", "The irises can now dilate and contract in response to light.", "The baby is gaining about 200–250 g per week now."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Group B Streptococcus (GBS) swab may be taken around 35–37 weeks.", "Pelvic pressure increases as the baby's head moves lower.", "Many women begin to feel very heavy and uncomfortable."],
    symptoms: ["Pelvic heaviness", "Frequent urination", "Insomnia", "Back pain"],
    tip: "Sleep with several pillows — one under the bump, one between your knees, one behind your back.",
  },
  33: {
    fruit: "Pineapple", fruitEmoji: "🍍",
    lengthMm: "432 mm", weightG: "1918 g", lengthIn: "17.0 in", weightOz: "67.7 oz",
    babyHeadline: "Skull softens",
    babyBody: ["The skull bones are still soft and not fully fused — they'll overlap during delivery.", "The baby is sleeping 90–95% of the time to conserve energy for growth.", "Antibodies are transferring from mother to baby through the placenta.", "The immune system is developing."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Braxton Hicks are becoming more intense — but they should stop if you change position.", "Oedema in legs and feet can be significant.", "You may notice your rings no longer fit."],
    symptoms: ["Oedema", "Pelvic pressure", "Braxton Hicks", "Restless legs"],
    tip: "Watch for signs of pre-eclampsia: severe headache, visual disturbances, sudden swelling. Seek urgent care if these occur.",
  },
  34: {
    fruit: "Cantaloupe", fruitEmoji: "🍈",
    lengthMm: "450 mm", weightG: "2146 g", lengthIn: "17.7 in", weightOz: "75.7 oz",
    babyHeadline: "Immune system ready",
    babyBody: ["The baby's immune system is receiving antibodies to protect against illness after birth.", "The central nervous system is maturing rapidly.", "The baby's hearing is fully developed.", "Most babies are now head-down (cephalic position)."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Lightening (baby dropping into the pelvis) may happen now or in the coming weeks.", "Lightning crotch — sharp shooting pains — is caused by baby pressing on nerves.", "Your breathing may become easier once the baby drops."],
    symptoms: ["Lightning crotch", "Pelvic pressure", "Breathlessness improving", "Leaking urine"],
    tip: "Discuss your birth preferences in detail with your midwife or obstetrician.",
  },
  35: {
    fruit: "Honeydew melon", fruitEmoji: "🍈",
    lengthMm: "463 mm", weightG: "2383 g", lengthIn: "18.2 in", weightOz: "84.1 oz",
    babyHeadline: "Kidneys fully mature",
    babyBody: ["The kidneys are fully developed and producing about half a litre of urine daily.", "Hearing is acute — the baby startles at loud noises.", "The baby's body fat is now about 15% of their weight.", "Most of the lanugo has shed."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Antenatal appointments are now weekly in many care models.", "Group B Strep swab may be done this week.", "Cervical changes (effacement and dilation) may already be beginning."],
    symptoms: ["Pelvic floor weakness", "Frequent urination", "Backache", "Nesting urge"],
    tip: "Install the car seat and have your bag ready — babies can come early!",
  },
  36: {
    fruit: "Papaya", fruitEmoji: "🍈",
    lengthMm: "474 mm", weightG: "2622 g", lengthIn: "18.7 in", weightOz: "92.5 oz",
    babyHeadline: "Shedding vernix",
    babyBody: ["The vernix and lanugo are mostly gone now — swallowed into meconium.", "The baby is gaining about 28 g (1 oz) per day.", "Skull bones can now slide over each other to fit through the birth canal.", "Gums are firm — teething ridges are visible on scan."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You're considered 'early term' from 37 weeks.", "Mucus plug can shed in the coming weeks — it may come out all at once or in pieces.", "Braxton Hicks may feel very intense and regular."],
    symptoms: ["Mucus plug discharge", "Pelvic pressure", "Difficulty walking", "Insomnia"],
    tip: "Keep track of fetal movements — if you notice a decrease, contact your midwife immediately.",
  },
  37: {
    fruit: "Winter melon", fruitEmoji: "🍉",
    lengthMm: "487 mm", weightG: "2859 g", lengthIn: "19.1 in", weightOz: "100.8 oz",
    babyHeadline: "Early term",
    babyBody: ["Your baby is considered 'early term' — major development is complete.", "They're practising grasping and have a very strong grip.", "The lungs produce surfactant to keep air sacs open after birth.", "The baby continues to gain weight — up to 28 g per day."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You may lose the mucus plug (a gel-like blob, sometimes blood-tinged).", "Latent phase of labour can begin and last days or even weeks.", "Your cervix is beginning to soften (ripen) and thin (efface)."],
    symptoms: ["Mucus plug loss", "Show (bloody discharge)", "Irregular contractions", "Nesting"],
    tip: "Know the signs of labour: regular contractions every 5 min for 1 hour, waters breaking, or heavy bleeding.",
    milestone: "Early term (37 weeks)",
  },
  38: {
    fruit: "Leek", fruitEmoji: "🫛",
    lengthMm: "499 mm", weightG: "3083 g", lengthIn: "19.6 in", weightOz: "108.7 oz",
    babyHeadline: "Ready to be born",
    babyBody: ["Your baby is considered full-term from this week.", "They're shedding the last of the vernix into the amniotic fluid.", "The brain and nervous system are fully mature.", "The baby is well-positioned for birth, most likely head-down."],
    bodyHeadline: "Your body this week",
    bodyBody: ["You may notice your bump 'dropping' lower — baby has engaged in the pelvis.", "Contractions may come and go — 'practice runs' for labour.", "Sleep is often very disrupted with frequent trips to the bathroom."],
    symptoms: ["Pelvic engagement", "Irregular contractions", "Waters leaking (trickle)", "Anxiety"],
    tip: "If your waters break — note the time, colour and smell, then call your midwife or hospital.",
    milestone: "Full term",
  },
  39: {
    fruit: "Watermelon", fruitEmoji: "🍉",
    lengthMm: "507 mm", weightG: "3288 g", lengthIn: "19.9 in", weightOz: "115.9 oz",
    babyHeadline: "Final preparations",
    babyBody: ["The brain, lungs and muscles are fully mature.", "The baby is very cramped — big kicks and rolls are replaced by rolling and squirming.", "Antibody transfer from mother is at its highest peak.", "The placenta is beginning to age but still functioning well."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Induction may be discussed if you go past 41 weeks.", "Cervical sweeps (membrane sweeps) may be offered.", "You may feel very impatient — that's completely normal!"],
    symptoms: ["Contractions", "Lower back ache", "Loose stools (sign of labour approaching)", "Emotional"],
    tip: "Rest as much as possible — you'll need your strength for labour. Eat well and stay hydrated.",
  },
  40: {
    fruit: "Watermelon", fruitEmoji: "🍉",
    lengthMm: "514 mm", weightG: "3462 g", lengthIn: "20.2 in", weightOz: "122.1 oz",
    babyHeadline: "Due date!",
    babyBody: ["Your baby is ready to meet the world.", "The average birth weight is around 3.4 kg (7.5 lbs), but normal ranges from 2.5–4.5 kg.", "Only about 5% of babies are born on their due date — most arrive within 2 weeks.", "The placenta is fully mature and will deliver shortly after birth."],
    bodyHeadline: "Your body this week",
    bodyBody: ["Induction is typically offered at 41–42 weeks if labour hasn't started.", "You may feel excited, anxious, and very ready — all normal.", "Trust your body — it knows what to do."],
    symptoms: ["Labour signs", "Nesting urge", "Emotional", "Very little sleep"],
    tip: "You're almost there! Call your hospital if contractions are 5 minutes apart, lasting 1 minute, for 1 hour.",
    milestone: "Due date! 🎉",
  },
};

// Fill missing weeks with interpolated data
for (let w = 1; w <= 40; w++) {
  if (!WEEK_DATA[w]) {
    // Find nearest weeks
    const keys = Object.keys(WEEK_DATA).map(Number).sort((a, b) => a - b);
    const prev = keys.filter(k => k < w).pop() || 1;
    const next = keys.find(k => k > w) || 40;
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

// ─── Fetus SVG illustration (stage-based) ─────────────────────────────────────

function FetusSvg({ week, size = 220 }: { week: number; size?: number }) {
  // Stage determines the fetus shape / complexity
  const stage =
    week <= 6 ? 1 :
    week <= 9 ? 2 :
    week <= 13 ? 3 :
    week <= 20 ? 4 :
    week <= 28 ? 5 :
    week <= 34 ? 6 : 7;

  const scale = size / 220;

  return (
    <svg width={size} height={size} viewBox="0 0 220 220" fill="none">
      {stage === 1 && (
        // Tiny blastocyst / cluster of cells
        <g transform="translate(110,110)">
          <circle r="18" fill="#E8A07A" opacity={0.9} />
          <circle cx="10" cy="-8" r="7" fill="#D4806A" opacity={0.7} />
          <circle cx="-10" cy="6" r="5" fill="#D4806A" opacity={0.6} />
          <circle cx="5" cy="14" r="6" fill="#C87060" opacity={0.5} />
        </g>
      )}
      {stage === 2 && (
        // Early embryo C-shape
        <g transform={`translate(${110 * scale},${105 * scale}) scale(${scale})`}>
          {/* Amniotic sac */}
          <ellipse cx="0" cy="0" rx="45" ry="55" fill="#F5C4A8" opacity={0.35} />
          {/* Body */}
          <path d="M0,-30 C22,-22 28,0 20,22 C12,38 -5,42 -15,30 C-25,18 -22,-10 0,-30Z"
            fill="#E08060" opacity={0.9} />
          {/* Head */}
          <circle cx="2" cy="-34" r="18" fill="#D87050" opacity={0.95} />
          {/* Eye */}
          <circle cx="7" cy="-36" r="3" fill="#333" opacity={0.6} />
          {/* Limb buds */}
          <ellipse cx="22" cy="-8" rx="9" ry="5" fill="#C86848" opacity={0.7} transform="rotate(30,22,-8)" />
          <ellipse cx="18" cy="18" rx="8" ry="4" fill="#C86848" opacity={0.7} transform="rotate(-20,18,18)" />
        </g>
      )}
      {stage === 3 && (
        // Recognisable fetus, curled
        <g transform="translate(110,108)">
          {/* Sac */}
          <ellipse cx="0" cy="0" rx="60" ry="68" fill="#F5C4A8" opacity={0.3} />
          {/* Torso */}
          <path d="M0,-22 C28,-14 34,10 24,34 C16,52 -8,56 -20,40 C-32,24 -28,-6 0,-22Z"
            fill="#E08060" opacity={0.92} />
          {/* Head */}
          <circle cx="4" cy="-40" r="24" fill="#D07050" opacity={0.97} />
          {/* Face */}
          <circle cx="10" cy="-44" r="4" fill="#222" opacity={0.5} />
          <path d="M0,-32 Q8,-28 14,-32" stroke="#222" strokeWidth="1.5" strokeLinecap="round" opacity={0.4} fill="none" />
          {/* Arm */}
          <path d="M26,-10 C38,-4 42,8 36,16" stroke="#C87050" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Hand */}
          <circle cx="36" cy="16" r="5" fill="#C87050" opacity={0.8} />
          {/* Leg */}
          <path d="M20,32 C30,44 28,58 18,62" stroke="#C87050" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Foot */}
          <ellipse cx="18" cy="62" rx="7" ry="4" fill="#C87050" opacity={0.8} transform="rotate(-20,18,62)" />
          {/* Umbilical cord */}
          <path d="M-4,20 C-20,35 -10,50 -5,58" stroke="#D4805A" strokeWidth="3" strokeLinecap="round" fill="none" opacity={0.5} />
        </g>
      )}
      {stage === 4 && (
        // Floating fetus, more defined
        <g transform="translate(110,112)">
          {/* Body */}
          <path d="M0,-30 C32,-20 40,8 30,38 C20,62 -10,68 -26,50 C-40,32 -36,-4 0,-30Z"
            fill="#E08060" opacity={0.93} />
          {/* Head */}
          <circle cx="5" cy="-55" r="30" fill="#D07050" />
          {/* Face features */}
          <circle cx="14" cy="-60" r="5" fill="#222" opacity={0.45} />
          <circle cx="-2" cy="-60" r="5" fill="#222" opacity={0.45} />
          <path d="M2,-46 Q8,-42 14,-46" stroke="#222" strokeWidth="1.5" strokeLinecap="round" opacity={0.35} fill="none" />
          {/* Ear */}
          <path d="M-24,-55 C-30,-50 -30,-44 -24,-40" stroke="#C87050" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Arm */}
          <path d="M32,-8 C48,0 52,18 44,28" stroke="#D07050" strokeWidth="9" strokeLinecap="round" fill="none" />
          <ellipse cx="46" cy="30" rx="9" ry="6" fill="#C87050" transform="rotate(-20,46,30)" />
          {/* Fingers */}
          {[-1,1,3].map((d,i) => <line key={i} x1={46+d*2} y1={28} x2={46+d*2} y2={38} stroke="#B86040" strokeWidth="2" strokeLinecap="round" />)}
          {/* Leg */}
          <path d="M24,44 C34,62 30,76 18,82" stroke="#D07050" strokeWidth="9" strokeLinecap="round" fill="none" />
          <ellipse cx="17" cy="84" rx="10" ry="5" fill="#C87050" transform="rotate(-10,17,84)" />
          {/* Other leg (behind) */}
          <path d="M-12,48 C-22,62 -24,76 -16,84" stroke="#C06848" strokeWidth="8" strokeLinecap="round" fill="none" opacity={0.6} />
          {/* Cord */}
          <path d="M-4,10 C-24,30 -18,56 -10,68" stroke="#D4805A" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity={0.5} />
        </g>
      )}
      {stage === 5 && (
        // Weeks 21-28: larger fetus, more defined
        <g transform="translate(110,114)">
          {/* Body */}
          <path d="M0,-28 C38,-16 46,14 34,48 C22,76 -14,82 -32,62 C-50,40 -44,-8 0,-28Z"
            fill="#E08060" opacity={0.94} />
          {/* Head */}
          <circle cx="6" cy="-60" r="36" fill="#D07050" />
          {/* Face */}
          <circle cx="18" cy="-66" r="6" fill="#111" opacity={0.4} />
          <circle cx="0" cy="-66" r="6" fill="#111" opacity={0.4} />
          <path d="M4,-50 Q10,-44 18,-50" stroke="#111" strokeWidth="2" strokeLinecap="round" opacity={0.3} fill="none" />
          {/* Ear */}
          <path d="M-29,-62 C-38,-56 -38,-48 -29,-44" stroke="#C87050" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Arm */}
          <path d="M38,-5 C56,6 60,28 50,40" stroke="#D07050" strokeWidth="11" strokeLinecap="round" fill="none" />
          <ellipse cx="52" cy="42" rx="11" ry="7" fill="#C87050" transform="rotate(-15,52,42)" />
          {[0,2,4].map((d,i)=><line key={i} x1={52+d*2} y1={40} x2={52+d*2} y2={52} stroke="#B86040" strokeWidth="2.5" strokeLinecap="round" />)}
          {/* Legs */}
          <path d="M26,54 C38,72 36,90 24,96" stroke="#D07050" strokeWidth="11" strokeLinecap="round" fill="none" />
          <ellipse cx="22" cy="98" rx="12" ry="6" fill="#C87050" transform="rotate(-8,22,98)" />
          <path d="M-10,60 C-26,76 -28,92 -18,100" stroke="#C06848" strokeWidth="10" strokeLinecap="round" fill="none" opacity={0.65} />
          {/* Cord */}
          <path d="M-2,14 C-28,40 -22,70 -12,84" stroke="#D4805A" strokeWidth="4" strokeLinecap="round" fill="none" opacity={0.45} />
        </g>
      )}
      {stage === 6 && (
        // Weeks 29-34: plump fetus
        <g transform="translate(108,118)">
          {/* Plump body */}
          <path d="M2,-22 C46,-8 54,24 40,58 C26,88 -16,94 -38,72 C-58,48 -52,-10 2,-22Z"
            fill="#E08060" opacity={0.95} />
          {/* Head */}
          <circle cx="8" cy="-58" r="40" fill="#D07050" />
          {/* Face */}
          <circle cx="22" cy="-65" r="7" fill="#111" opacity={0.38} />
          <circle cx="2" cy="-65" r="7" fill="#111" opacity={0.38} />
          <ellipse cx="10" cy="-50" rx="8" ry="3" fill="#C06040" opacity={0.5} />
          <path d="M6,-48 Q12,-42 20,-48" stroke="#111" strokeWidth="1.8" strokeLinecap="round" opacity={0.25} fill="none" />
          {/* Ear */}
          <path d="M-31,-60 C-42,-52 -42,-42 -31,-36" stroke="#C87050" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Arms */}
          <path d="M44,-2 C64,10 68,36 56,50" stroke="#D07050" strokeWidth="13" strokeLinecap="round" fill="none" />
          <ellipse cx="57" cy="52" rx="13" ry="8" fill="#C87050" transform="rotate(-12,57,52)" />
          {/* Legs */}
          <path d="M28,62 C42,82 40,100 26,108" stroke="#D07050" strokeWidth="13" strokeLinecap="round" fill="none" />
          <ellipse cx="24" cy="110" rx="14" ry="7" fill="#C87050" />
          <path d="M-14,68 C-32,86 -34,104 -22,112" stroke="#C06848" strokeWidth="12" strokeLinecap="round" fill="none" opacity={0.6} />
        </g>
      )}
      {stage === 7 && (
        // Weeks 35-40: full-term baby
        <g transform="translate(110,116)">
          {/* Full, round body */}
          <path d="M4,-16 C52,-0 62,32 46,66 C30,96 -18,102 -42,78 C-66,52 -60,-8 4,-16Z"
            fill="#E08060" opacity={0.96} />
          {/* Head */}
          <circle cx="10" cy="-54" r="44" fill="#D07050" />
          {/* Face details */}
          <circle cx="26" cy="-62" r="7" fill="#111" opacity={0.35} />
          <circle cx="4" cy="-62" r="7" fill="#111" opacity={0.35} />
          <ellipse cx="14" cy="-46" rx="9" ry="3.5" fill="#C06040" opacity={0.45} />
          <path d="M8,-43 Q15,-36 24,-43" stroke="#333" strokeWidth="2" strokeLinecap="round" opacity={0.22} fill="none" />
          <ellipse cx="15" cy="-54" rx="1" ry="2.5" fill="#C06040" opacity={0.5} />
          {/* Ear */}
          <path d="M-33,-57 C-46,-47 -46,-35 -33,-28" stroke="#C87050" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Hair suggestion */}
          {[-2,4,10,16,22].map((x,i) => <path key={i} d={`M${x},-96 Q${x+3},-104 ${x+1},-108`} stroke="#8B4040" strokeWidth="2" strokeLinecap="round" fill="none" opacity={0.35} />)}
          {/* Arms */}
          <path d="M48,4 C70,18 74,46 60,62" stroke="#D07050" strokeWidth="14" strokeLinecap="round" fill="none" />
          <ellipse cx="61" cy="64" rx="14" ry="9" fill="#C87050" transform="rotate(-10,61,64)" />
          {[0,3,6].map((d,i)=><line key={i} x1={61+d*2} y1={62} x2={62+d*2} y2={74} stroke="#B86040" strokeWidth="2.5" strokeLinecap="round" />)}
          {/* Legs */}
          <path d="M30,70 C46,92 44,112 30,120" stroke="#D07050" strokeWidth="14" strokeLinecap="round" fill="none" />
          <ellipse cx="28" cy="122" rx="16" ry="8" fill="#C87050" />
          <path d="M-16,76 C-36,96 -38,116 -26,124" stroke="#C06848" strokeWidth="13" strokeLinecap="round" fill="none" opacity={0.62} />
          {/* Cord */}
          <path d="M0,18 C-30,48 -26,80 -14,96" stroke="#D4805A" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity={0.42} />
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
            <span className="text-[11px] font-medium" style={{ color: isToday ? "#fff" : "rgba(255,255,255,0.65)" }}>
              {dayNames[i]}
            </span>
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-[14px] font-semibold",
                isToday ? "bg-white text-[#B05A2A]" : "text-white"
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

function DetailsSheet({
  initialWeek,
  onClose,
}: {
  initialWeek: number;
  onClose: () => void;
}) {
  const [selectedWeek, setSelectedWeek] = useState(initialWeek);
  const scrollRef = useRef<HTMLDivElement>(null);
  const weeks = Array.from({ length: 40 }, (_, i) => i + 1);
  const data = WEEK_DATA[selectedWeek] || WEEK_DATA[7];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "linear-gradient(160deg, #f4c09a 0%, #e8956d 55%, #f0b080 100%)" }}>
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute left-4 top-10 z-10 flex size-9 items-center justify-center rounded-full bg-white/20"
        aria-label="Close"
      >
        <X className="size-5 text-white" strokeWidth={2.5} />
      </button>

      {/* Fetus illustration */}
      <div className="flex flex-1 items-center justify-center pt-16">
        <FetusSvg week={selectedWeek} size={240} />
      </div>

      {/* Week selector pills */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" ref={scrollRef}>
          {weeks.map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
                selectedWeek === w
                  ? "bg-white text-[#B05A2A] shadow-md"
                  : "bg-white/20 text-white"
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
            <div className="grid size-10 place-items-center rounded-full bg-gray-200 text-[18px]">👩‍⚕️</div>
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
            <p className="text-[13px] font-semibold text-foreground">
              Size of a {data.fruit}
            </p>
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
          <p key={i} className="mt-2 text-[14px] leading-relaxed text-gray-700">{p}</p>
        ))}

        {/* Your body */}
        <h3 className="mt-5 text-[16px] font-bold text-foreground">{data.bodyHeadline}</h3>
        {data.bodyBody.map((p, i) => (
          <p key={i} className="mt-2 text-[14px] leading-relaxed text-gray-700">{p}</p>
        ))}

        {/* Symptoms */}
        <h3 className="mt-5 text-[16px] font-bold text-foreground">Common symptoms</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.symptoms.map((s) => (
            <span key={s} className="rounded-full bg-orange-100 px-3 py-1 text-[12px] font-medium text-orange-800">
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

function InsightCards({ week, data, onOpenDetails }: {
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
      title: `Your baby\nat ${week} weeks`,
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
      title: `Your body\nat ${week} weeks`,
      bg: "bg-sky-100",
      content: (
        <div className="mt-auto text-4xl">🫁</div>
      ),
      onClick: onOpenDetails,
    },
    {
      id: "symptoms",
      title: "Symptoms\nthis week",
      bg: "bg-purple-50",
      content: (
        <div className="mt-auto text-4xl">😔</div>
      ),
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
            card.bg
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
  const today = new Date();

  const lmpStr = typeof window !== "undefined" ? window.localStorage.getItem("petal:lastPeriod") : null;
  const { weeks, days, dueDate, daysLeft } = getPregnancyInfo(lmpStr);
  const data = WEEK_DATA[weeks] || WEEK_DATA[7];

  const monthLabel = today.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  return (
    <>
      {showDetails && (
        <DetailsSheet initialWeek={weeks} onClose={() => setShowDetails(false)} />
      )}

      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        {/* ── Hero gradient zone ── */}
        <div
          className="relative flex flex-col pb-10"
          style={{
            background: "linear-gradient(160deg, #f4c09a 0%, #e8956d 55%, #f0b080 100%)",
            minHeight: "62vh",
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 pt-12">
            <div className="grid size-9 place-items-center rounded-full bg-white/25">
              <span className="text-[17px]">🐱</span>
            </div>
            <p className="text-[16px] font-semibold text-white">{monthLabel}</p>
            <button className="grid size-9 place-items-center rounded-full bg-white/25">
              <span className="text-[17px]">📅</span>
            </button>
          </div>

          {/* Week strip */}
          <div className="mt-3">
            <WeekStrip today={today} />
          </div>

          {/* Fetus */}
          <div className="flex flex-1 items-center justify-center py-4">
            <FetusSvg week={weeks} size={200} />
          </div>

          {/* Pregnancy age */}
          <div className="flex flex-col items-center gap-3 pb-2">
            <button
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-1.5"
            >
              <span
                className="font-display text-[30px] font-bold"
                style={{ color: "#7B3A10" }}
              >
                {weeks} {weeks === 1 ? "week" : "weeks"}{days > 0 ? `, ${days} day${days > 1 ? "s" : ""}` : ""}
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
            <div className="text-right">=
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Days left</p>
              <p className="text-[14px] font-semibold text-foreground">{daysLeft} days</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Baby size</p>
              <p className="text-[14px] font-semibold text-foreground">{data.fruitEmoji} {data.fruit}</p>
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
                <p className="text-[12px] font-semibold uppercase tracking-wider text-orange-600">Milestone</p>
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
                {weeks < 12 ? "Book your 12-week scan" :
                 weeks < 20 ? "20-week anomaly scan coming up" :
                 weeks < 28 ? "Glucose tolerance test (24–28 weeks)" :
                 weeks < 36 ? "Antenatal check-up" :
                 "Weekly midwife appointment"}
              </p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </>
  );
}
