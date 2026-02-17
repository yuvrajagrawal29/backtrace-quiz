require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

/**
 * SEED SCRIPT - Generates and inserts 500 MCQ Questions
 * Run: npm run seed
 */

// Helper to generate questions
const generateQuestions = () => {
  const questions = [];
  
  // BACKTRACE QUESTIONS (1-500) - Based on system component identification
  const backtraceQuestions = [
    { q: "Room Light Automation: Person enters room → Light turns ON, Person leaves room → Light turns OFF. Which components are needed?", opts: ["Motion Sensor, Controller, Light", "Temperature Sensor, Controller, Light", "Motion Sensor, Speaker, Light", "Camera, Controller, Light"], ans: 0 },
    { q: "Automatic Hand Sanitizer: Hand placed → Sanitizer dispensed. Which components are needed?", opts: ["IR Sensor, Pump Motor, Controller", "Motion Sensor, Pump Motor, Controller", "IR Sensor, Display Screen, Controller", "Camera, Pump Motor, Controller"], ans: 0 },
    { q: "Mobile Phone Unlock (PIN): Enter PIN → Phone unlocks. Which components are needed?", opts: ["Keypad, Authentication Logic, Display, Storage", "Keypad, Speaker, Display, Storage", "Camera, Authentication Logic, Display, Storage", "Keypad, Authentication Logic, Speaker, Storage"], ans: 0 },
    { q: "Lift System: Press floor button → Lift moves → Door opens. Which components are needed?", opts: ["Button Panel, Motor, Controller, Door Mechanism", "Button Panel, Speaker, Controller, Door Mechanism", "Camera, Motor, Controller, Door Mechanism", "Button Panel, Motor, Display, Door Mechanism"], ans: 0 },
    { q: "Online Login System: Enter credentials → Login success/failure. Which components are needed?", opts: ["Input Form, Database, Authentication Logic, Display", "Input Form, Printer, Authentication Logic, Display", "Input Form, Database, Speaker, Display", "Camera, Database, Authentication Logic, Display"], ans: 0 },
    { q: "Traffic Signal: Red → Yellow → Green → Red. Which components are needed?", opts: ["Timer, Controller, Signal Lights, Power Supply", "Timer, Camera, Signal Lights, Power Supply", "Timer, Controller, Display, Power Supply", "Motion Sensor, Controller, Signal Lights, Power Supply"], ans: 0 },
    { q: "Smart Door Lock: Fingerprint scanned → Door unlocks. Which components are needed?", opts: ["Fingerprint Sensor, Controller, Lock Motor", "Fingerprint Sensor, Display, Lock Motor", "Temperature Sensor, Controller, Lock Motor", "Fingerprint Sensor, Controller, Speaker"], ans: 0 },
    { q: "ATM Withdrawal: Insert card → Enter PIN → Cash dispensed. Which components are needed?", opts: ["Card Reader, Keypad, Bank Server, Cash Dispenser", "Card Reader, Keypad, Bank Server, Speaker", "Card Reader, Display, Bank Server, Cash Dispenser", "Camera, Keypad, Bank Server, Cash Dispenser"], ans: 0 },
    { q: "Automatic Street Light: Night → Light ON, Day → Light OFF. Which components are needed?", opts: ["LDR Sensor, Controller, Light, Power Unit", "Motion Sensor, Controller, Light, Power Unit", "LDR Sensor, Display, Light, Power Unit", "LDR Sensor, Controller, Camera, Power Unit"], ans: 0 },
    { q: "File Upload System: Click Upload → Progress bar → Success. Which components are needed?", opts: ["UI Button, Backend Server, Storage, Progress Indicator", "UI Button, Backend Server, Camera, Progress Indicator", "UI Button, Printer, Storage, Progress Indicator", "Display, Backend Server, Storage, Progress Indicator"], ans: 0 },
    { q: "Email Sending: Click Send → Email delivered. Which components are needed?", opts: ["Email Client, SMTP Server, Internet, Display", "Email Client, SMTP Server, Printer, Display", "Email Client, SMTP Server, Internet, Camera", "Email Client, Database, Internet, Display"], ans: 0 },
    { q: "Water Tank Overflow Control: Tank full → Motor stops. Which components are needed?", opts: ["Water Level Sensor, Motor, Controller", "Water Level Sensor, Motor, Display", "Temperature Sensor, Motor, Controller", "Water Level Sensor, Pump, Display"], ans: 0 },
    { q: "Online Payment: Pay → OTP → Payment success. Which components are needed?", opts: ["Payment App, Bank Server, OTP Service, Display", "Payment App, Bank Server, OTP Service, Camera", "Payment App, Printer, OTP Service, Display", "Payment App, Bank Server, Speaker, Display"], ans: 0 },
    { q: "Classroom Attendance (RFID): Card tapped → Attendance marked. Which components are needed?", opts: ["RFID Reader, Database, Controller, Display", "RFID Reader, Database, Speaker, Display", "RFID Reader, Camera, Controller, Display", "Motion Sensor, Database, Controller, Display"], ans: 0 },
    { q: "Search Engine: Type query → Results shown. Which components are needed?", opts: ["Search Box, Search Algorithm, Database, Display", "Search Box, Search Algorithm, GPS, Display", "Search Box, Search Algorithm, Database, Printer", "Camera, Search Algorithm, Database, Display"], ans: 0 },
    { q: "Smart Fan: Temperature increases → Fan speed increases. Which components are needed?", opts: ["Temperature Sensor, Controller, Fan Motor", "Temperature Sensor, Display, Fan Motor", "Motion Sensor, Controller, Fan Motor", "Temperature Sensor, Controller, Camera"], ans: 0 },
    { q: "QR Code Scanner: Scan QR → Link opens. Which components are needed?", opts: ["Camera, Decoder, Browser, Display", "Camera, Decoder, Speaker, Display", "Motion Sensor, Decoder, Browser, Display", "Camera, Decoder, Browser, Printer"], ans: 0 },
    { q: "Online Exam Submission: Click Submit → Answers saved. Which components are needed?", opts: ["Submit Button, Server, Database, Confirmation Screen", "Submit Button, Server, Printer, Confirmation Screen", "Submit Button, Server, Database, Camera", "Submit Button, Speaker, Database, Confirmation Screen"], ans: 0 },
    { q: "Smart Dustbin: Hand near → Lid opens. Which components are needed?", opts: ["Ultrasonic Sensor, Motor, Controller, Battery", "Ultrasonic Sensor, Motor, Display, Battery", "Motion Sensor, Motor, Controller, Battery", "Ultrasonic Sensor, Speaker, Controller, Battery"], ans: 0 },
    { q: "Music Player App: Select song → Music plays. Which components are needed?", opts: ["Song List UI, Media Decoder, Speaker, Storage", "Song List UI, Media Decoder, Camera, Storage", "Song List UI, Media Decoder, Speaker, Printer", "Display, Media Decoder, Speaker, Storage"], ans: 0 },
    { q: "Smart Alarm Clock: Alarm time reached → Alarm rings. Which components are needed?", opts: ["Clock Timer, Controller, Speaker", "Clock Timer, Controller, Display", "Clock Timer, Camera, Speaker", "Clock Timer, Controller, Printer"], ans: 0 },
    { q: "Google Maps Navigation: Enter destination → Route shown. Which components are needed?", opts: ["GPS, Map Database, Routing Algorithm, Display, Speaker", "GPS, Map Database, Routing Algorithm, Display, Camera", "GPS, Map Database, Routing Algorithm, Printer, Speaker", "Motion Sensor, Map Database, Routing Algorithm, Display, Speaker"], ans: 0 },
    { q: "Smart Parking System: Car enters → Slot assigned. Which components are needed?", opts: ["Vehicle Sensor, Controller, Display Board, Database", "Vehicle Sensor, Controller, Display Board, Payment Gateway", "Vehicle Sensor, Camera, Display Board, Database", "Motion Sensor, Controller, Display Board, Database"], ans: 0 },
    { q: "Online Food Ordering: Order placed → Order confirmed. Which components are needed?", opts: ["Mobile App, Restaurant System, Payment Gateway, Database", "Mobile App, Restaurant System, Camera, Database", "Mobile App, Restaurant System, Payment Gateway, Printer", "Display, Restaurant System, Payment Gateway, Database"], ans: 0 },
    { q: "Face Unlock Phone: Face scanned → Phone unlocks. Which components are needed?", opts: ["Camera, Face Recognition Logic, Controller, Lock Mechanism", "Camera, Face Recognition Logic, Speaker, Lock Mechanism", "Motion Sensor, Face Recognition Logic, Controller, Lock Mechanism", "Camera, Face Recognition Logic, Controller, Display"], ans: 0 },
    { q: "Online Ticket Booking: Select seat → Ticket booked. Which components are needed?", opts: ["Booking App, Seat Database, Payment System, Confirmation Screen", "Booking App, Seat Database, Payment System, Printer", "Booking App, Seat Database, Camera, Confirmation Screen", "Display, Seat Database, Payment System, Confirmation Screen"], ans: 0 },
    { q: "Smart Refrigerator: Temperature rises → Cooling increases. Which components are needed?", opts: ["Temperature Sensor, Controller, Compressor", "Temperature Sensor, Display, Compressor", "Motion Sensor, Controller, Compressor", "Temperature Sensor, Controller, Camera"], ans: 0 },
    { q: "Chat Application: Send message → Message delivered. Which components are needed?", opts: ["Chat UI, Internet, Server, Database", "Chat UI, Internet, Server, Speaker", "Chat UI, Printer, Server, Database", "Display, Internet, Server, Database"], ans: 0 },
    { q: "Online Video Streaming: Click Play → Video plays. Which components are needed?", opts: ["Play Button, Streaming Server, Decoder, Display", "Play Button, Streaming Server, Decoder, Storage", "Play Button, Streaming Server, Camera, Display", "Display, Streaming Server, Decoder, Printer"], ans: 0 },
    { q: "Railway Signal System: Train approaches → Signal turns red. Which components are needed?", opts: ["Track Sensor, Controller, Signal Light, Power Unit", "Track Sensor, Camera, Signal Light, Power Unit", "Track Sensor, Controller, Display, Power Unit", "Motion Sensor, Controller, Signal Light, Power Unit"], ans: 0 },
    { q: "Smart Doorbell: Button pressed → Bell rings. Which components are needed?", opts: ["Push Button, Controller, Speaker", "Push Button, Controller, Camera", "Push Button, Display, Speaker", "Motion Sensor, Controller, Speaker"], ans: 0 },
    { q: "Cloud Backup System: Click Backup → Files saved online. Which components are needed?", opts: ["Backup App, Internet, Cloud Server, Storage", "Backup App, Internet, Cloud Server, Printer", "Backup App, Camera, Cloud Server, Storage", "Display, Internet, Cloud Server, Storage"], ans: 0 },
    { q: "Smart Watch Heart Rate: Heart rate increases → Alert shown. Which components are needed?", opts: ["Heart Rate Sensor, Controller, Display", "Heart Rate Sensor, Controller, Speaker", "Heart Rate Sensor, GPS, Display", "Motion Sensor, Controller, Display"], ans: 0 },
    { q: "Online Quiz System: Answer submitted → Score updated. Which components are needed?", opts: ["Quiz Interface, Evaluation Logic, Database, Result Display", "Quiz Interface, Evaluation Logic, Camera, Result Display", "Quiz Interface, Evaluation Logic, Database, Printer", "Display, Evaluation Logic, Database, Result Display"], ans: 0 },
    { q: "Smart Washing Machine: Load detected → Wash starts. Which components are needed?", opts: ["Load Sensor, Controller, Motor, Water Pump", "Load Sensor, Display, Motor, Water Pump", "Load Sensor, Controller, Motor, Display", "Motion Sensor, Controller, Motor, Water Pump"], ans: 0 },
    { q: "Password Reset System: Forgot password → Reset link sent. Which components are needed?", opts: ["User Interface, Email Service, Authentication Server, Database", "User Interface, Email Service, Speaker, Database", "User Interface, Email Service, Authentication Server, Printer", "Display, Email Service, Authentication Server, Database"], ans: 0 },
    { q: "Automatic Railway Gate: Train arrives → Gate closes. Which components are needed?", opts: ["Train Sensor, Controller, Gate Motor, Signal Light", "Train Sensor, Controller, Gate Motor, Display", "Train Sensor, Camera, Gate Motor, Signal Light", "Motion Sensor, Controller, Gate Motor, Signal Light"], ans: 0 },
    { q: "Online Result Portal: Enter roll number → Result shown. Which components are needed?", opts: ["Input Form, Database, Server, Display", "Input Form, Database, Server, Printer", "Input Form, Camera, Server, Display", "Display, Database, Server, Speaker"], ans: 0 },
    { q: "Smart Irrigation: Soil dry → Water supplied. Which components are needed?", opts: ["Soil Moisture Sensor, Controller, Water Pump", "Soil Moisture Sensor, Display, Water Pump", "Soil Moisture Sensor, Controller, Weather App", "Temperature Sensor, Controller, Water Pump"], ans: 0 },
    { q: "Bluetooth File Transfer: Send file → File received. Which components are needed?", opts: ["Sender Device, Bluetooth Module, Receiver Device, Storage", "Sender Device, Bluetooth Module, Camera, Storage", "Sender Device, Bluetooth Module, Receiver Device, Printer", "Display, Bluetooth Module, Receiver Device, Storage"], ans: 0 },
    { q: "Smart Elevator Overload: Overweight → Alarm sounds. Which components are needed?", opts: ["Weight Sensor, Controller, Alarm Speaker", "Weight Sensor, Controller, Motor", "Weight Sensor, Display, Alarm Speaker", "Motion Sensor, Controller, Alarm Speaker"], ans: 0 },
    { q: "Online Banking Balance Check: Login → Balance displayed. Which components are needed?", opts: ["Banking App, Bank Server, Database, Display", "Banking App, Bank Server, Printer, Display", "Banking App, Bank Server, Database, Camera", "Display, Bank Server, Database, Speaker"], ans: 0 },
    { q: "Smart Water Dispenser: Glass placed → Water flows. Which components are needed?", opts: ["Proximity Sensor, Controller, Valve", "Proximity Sensor, Display, Valve", "Proximity Sensor, Controller, Heater", "Motion Sensor, Controller, Valve"], ans: 0 },
    { q: "Online Chatbot: User asks → Bot replies. Which components are needed?", opts: ["Chat Interface, NLP Engine, Knowledge Base, Display", "Chat Interface, NLP Engine, Camera, Display", "Chat Interface, NLP Engine, Knowledge Base, Printer", "Display, NLP Engine, Knowledge Base, Speaker"], ans: 0 },
    { q: "Smart Smoke Alarm: Smoke detected → Alarm rings. Which components are needed?", opts: ["Smoke Sensor, Controller, Speaker", "Smoke Sensor, Controller, Display", "Smoke Sensor, Camera, Speaker", "Motion Sensor, Controller, Speaker"], ans: 0 },
    { q: "Online File Download: Click Download → File saved. Which components are needed?", opts: ["Download Button, Server, Internet, Storage", "Download Button, Server, Internet, Display", "Download Button, Server, Camera, Storage", "Display, Server, Internet, Storage"], ans: 0 },
    { q: "Smart Classroom Projector: Power ON → Projector starts. Which components are needed?", opts: ["Power Button, Controller, Projector Unit", "Power Button, Controller, Display", "Power Button, Speaker, Projector Unit", "Motion Sensor, Controller, Projector Unit"], ans: 0 },
    { q: "Ride Booking App: Book ride → Driver assigned. Which components are needed?", opts: ["User App, Server, Driver App, GPS", "User App, Server, Driver App, Payment Gateway", "User App, Server, Camera, GPS", "Display, Server, Driver App, GPS"], ans: 0 },
    { q: "Smart Power Cut Alert: Power fails → Alert sent. Which components are needed?", opts: ["Power Sensor, Controller, Notification Service, Mobile App", "Power Sensor, Controller, Camera, Mobile App", "Power Sensor, Display, Notification Service, Mobile App", "Motion Sensor, Controller, Notification Service, Mobile App"], ans: 0 },
    { q: "Online Form Submission: Fill form → Data saved. Which components are needed?", opts: ["Web Form, Server, Database, Confirmation Page", "Web Form, Server, Printer, Confirmation Page", "Web Form, Server, Database, Camera", "Display, Server, Database, Confirmation Page"], ans: 0 },
    { q: "Smart Gas Leakage System: Gas detected → Alarm rings → Valve shuts. Which components are needed?", opts: ["Gas Sensor, Controller, Alarm, Valve", "Gas Sensor, Display, Alarm, Valve", "Gas Sensor, Controller, Camera, Valve", "Motion Sensor, Controller, Alarm, Valve"], ans: 0 },
    { q: "Online Voting System: Vote cast → Vote recorded. Which components are needed?", opts: ["Interface, Authentication, Database, Display", "Interface, Authentication, Printer, Display", "Interface, Camera, Database, Display", "Display, Authentication, Database, Speaker"], ans: 0 },
    { q: "Smart AC: Temperature increases → Cooling starts. Which components are needed?", opts: ["Temperature Sensor, Controller, Compressor", "Temperature Sensor, Display, Compressor", "Motion Sensor, Controller, Compressor", "Temperature Sensor, Controller, Camera"], ans: 0 },
    { q: "E-commerce Order Tracking: Enter Order ID → Status shown. Which components are needed?", opts: ["Input, Server, Database, Display", "Input, Server, Printer, Display", "Input, Server, Database, Camera", "Display, Server, Database, Speaker"], ans: 0 },
    { q: "Smart Helmet: Helmet not worn → Bike won't start. Which components are needed?", opts: ["Sensor, Controller, Ignition", "Sensor, Display, Ignition", "Sensor, Controller, Camera", "Motion Sensor, Controller, Ignition"], ans: 0 },
    { q: "Online OTP Verification: Enter OTP → Verified. Which components are needed?", opts: ["UI, Server, OTP Service", "UI, Server, Display", "UI, Printer, OTP Service", "Display, Server, OTP Service"], ans: 0 },
    { q: "Smart Library System: Book scanned → Record updated. Which components are needed?", opts: ["Scanner, Controller, Database, Display", "Scanner, Controller, Printer, Display", "Scanner, Camera, Database, Display", "Display, Controller, Database, Speaker"], ans: 0 },
    { q: "Automatic Car Wiper: Rain detected → Wiper starts. Which components are needed?", opts: ["Rain Sensor, Controller, Motor", "Rain Sensor, Display, Motor", "Rain Sensor, Controller, Camera", "Motion Sensor, Controller, Motor"], ans: 0 },
    { q: "Online Course Enrollment: Click Enroll → Course added. Which components are needed?", opts: ["UI, Server, Payment, Database", "UI, Server, Payment, Display", "UI, Server, Camera, Database", "Display, Server, Payment, Database"], ans: 0 },
    { q: "Smart Pet Feeder: Feeding time → Food dispensed. Which components are needed?", opts: ["Timer, Controller, Motor", "Timer, Display, Motor", "Timer, Controller, Camera", "Motion Sensor, Controller, Motor"], ans: 0 },
  ];

  // Generate 500 questions using the base patterns
  for (let i = 0; i < 500; i++) {
    const base = backtraceQuestions[i % backtraceQuestions.length];
    let difficulty;
    if (i < 150) difficulty = 'easy';
    else if (i < 300) difficulty = 'medium';
    else difficulty = 'hard';
    
    questions.push({
      questionNumber: i + 1,
      question: base.q + ` (Q${i+1})`,
      options: base.opts,
      correctAnswer: base.ans,
      category: 'general',
      difficulty: difficulty
    });
  }

  return questions;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    // Generate all 500 questions
    const questions = generateQuestions();
    console.log(`📝 Generated ${questions.length} questions`);

    // Insert all questions
    await Question.insertMany(questions);
    console.log('✅ Successfully seeded 500 questions!');

    // Verify count
    const count = await Question.countDocuments();
    console.log(`📊 Total questions in database: ${count}`);

    // Show breakdown by category
    const categories = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    console.log('\n📈 Breakdown by category:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} questions`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run the seed
seedDatabase();
