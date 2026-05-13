export type QuizQuestion = {
  id: string;
  question: string;
  type?: "mcq" | "fill";
  options?: string[];
  correctIndex?: number;
  correctAnswers?: string[]; // fill-in-the-blank accepted answers
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  subjectTitle: string;
  level?: string;
  playable?: boolean; // true = links to /quiz/play/[id]
  questions: QuizQuestion[];
};

export const QUIZZES: Quiz[] = [
  // ─── Mathematics ────────────────────────────────────────────────────────────
  {
    id: "math-npv",
    title: "Numbers & Place Value",
    subjectTitle: "Mathematics",
    playable: true,
    questions: [
      {
        id: "npv1",
        type: "mcq",
        question: "What is the place value of 7 in the number 4,752?",
        options: ["7", "70", "700", "7,000"],
        correctIndex: 1,
      },
      {
        id: "npv2",
        type: "mcq",
        question: "Which digit is in the Hundred Thousands place in 3,45,891?",
        options: ["3", "4", "5", "8"],
        correctIndex: 0,
      },
      {
        id: "npv3",
        type: "mcq",
        question: "What is the expanded form of 6,304?",
        options: ["6,000 + 30 + 4", "600 + 300 + 4", "6,000 + 300 + 4", "6,000 + 300 + 40"],
        correctIndex: 2,
      },
      {
        id: "npv4",
        type: "mcq",
        question: "In 2,75,461 — what is the value of 5?",
        options: ["5", "500", "5,000", "50,000"],
        correctIndex: 2,
      },
      {
        id: "npv5",
        type: "fill",
        question: "The number 4,00,000 + 30,000 + 200 + 7 in standard form is ______",
        correctAnswers: ["430207", "4,30,207"],
      },
      {
        id: "npv6",
        type: "fill",
        question: "In 8,563 — the digit 8 is in the ______ place",
        correctAnswers: ["thousands"],
      },
      {
        id: "npv7",
        type: "fill",
        question: "The place value of 9 in 91,204 is ______",
        correctAnswers: ["90000", "90,000"],
      },
      {
        id: "npv8",
        type: "fill",
        question: "Write 50,000 + 3,000 + 400 + 60 + 1 as a single number",
        correctAnswers: ["53461", "53,461"],
      },
    ],
  },

  {
    id: "math-rwn",
    title: "Reading & Writing Whole Numbers",
    subjectTitle: "Mathematics",
    playable: true,
    questions: [
      {
        id: "rwn1",
        type: "mcq",
        question: "How do you write 3,472 in words?",
        options: [
          "Three thousand four hundred seventy",
          "Thirty four seventy two",
          "Three hundred forty seven two",
          "Three four seven two",
        ],
        correctIndex: 0,
      },
      {
        id: "rwn2",
        type: "mcq",
        question: 'Which number equals "Two lakh fifty three thousand four hundred"?',
        options: ["25,3400", "2,53,400", "25,34,00", "2,534,00"],
        correctIndex: 1,
      },
      {
        id: "rwn3",
        type: "mcq",
        question: 'What is the standard form of "Forty five thousand six hundred eight"?',
        options: ["4,5608", "45,068", "45,608", "4,56,08"],
        correctIndex: 2,
      },
      {
        id: "rwn4",
        type: "mcq",
        question: "Which is written correctly in words?",
        options: [
          "12,305 = Twelve thousand thirty fifty",
          "12,305 = Twelve thousand three hundred five",
          "12,305 = One two three zero five",
          "12,305 = Twelve thirty five",
        ],
        correctIndex: 1,
      },
      {
        id: "rwn5",
        type: "fill",
        question: "Write 1,00,000 in words",
        correctAnswers: ["one lakh"],
      },
      {
        id: "rwn6",
        type: "fill",
        question: 'The number "Seventy two thousand four hundred nineteen" in digits is ______',
        correctAnswers: ["72419", "72,419"],
      },
      {
        id: "rwn7",
        type: "fill",
        question: "Write 9,08,006 in words",
        correctAnswers: ["nine lakh eight thousand six"],
      },
      {
        id: "rwn8",
        type: "fill",
        question: 'The standard form of "Six lakh five" is ______',
        correctAnswers: ["600005", "6,00,005"],
      },
    ],
  },

  // ─── English ─────────────────────────────────────────────────────────────────
  {
    id: "english-quick-1",
    title: "English Quick Check",
    subjectTitle: "English",
    level: "Class 6",
    questions: [
      { id: "e1", type: "mcq", question: "Choose the correct sentence:", options: ["He don't like apples.", "He doesn't like apples.", "He doesn't likes apples.", "He don't likes apples."], correctIndex: 1, explanation: "With 'he', use 'doesn't' + base verb." },
      { id: "e2", type: "mcq", question: "What is a synonym of 'happy'?", options: ["Angry", "Joyful", "Tired", "Slow"], correctIndex: 1, explanation: "Joyful means happy." },
      { id: "e3", type: "mcq", question: "Which one is a noun?", options: ["Run", "Beautiful", "Quickly", "Teacher"], correctIndex: 3, explanation: "Teacher is a person (noun)." },
      { id: "e4", type: "mcq", question: "Pick the correct plural of 'child':", options: ["childs", "childes", "children", "childrens"], correctIndex: 2, explanation: "Plural of child is children." },
      { id: "e5", type: "mcq", question: "Which is a complete sentence?", options: ["Because it was late.", "Running very fast.", "I finished my homework.", "In the classroom."], correctIndex: 2, explanation: "A sentence needs a subject and a verb." },
      { id: "e6", type: "mcq", question: "Choose the correct word: 'She ____ to school daily.'", options: ["go", "goes", "going", "gone"], correctIndex: 1, explanation: "With 'she', use 'goes'." },
    ],
  },

  // ─── Science ──────────────────────────────────────────────────────────────────
  {
    id: "science-quick-1",
    title: "Science Quick Check",
    subjectTitle: "Science",
    level: "Class 6",
    questions: [
      { id: "s1", type: "mcq", question: "Which is a living thing?", options: ["Rock", "Tree", "Water", "Air"], correctIndex: 1, explanation: "A tree grows and reproduces." },
      { id: "s2", type: "mcq", question: "Water changes to steam when it:", options: ["freezes", "boils", "melts", "condenses"], correctIndex: 1, explanation: "Boiling turns liquid into gas." },
      { id: "s3", type: "mcq", question: "Which organ helps us breathe?", options: ["Heart", "Lungs", "Stomach", "Kidney"], correctIndex: 1, explanation: "Lungs are for breathing." },
      { id: "s4", type: "mcq", question: "Which is an example of a force?", options: ["Push", "Heat", "Sound", "Light"], correctIndex: 0, explanation: "Push/pull are forces." },
      { id: "s5", type: "mcq", question: "Plants make food using:", options: ["photosynthesis", "evaporation", "condensation", "friction"], correctIndex: 0, explanation: "Photosynthesis is how plants make food." },
      { id: "s6", type: "mcq", question: "Which state of matter has a fixed shape?", options: ["Solid", "Liquid", "Gas", "Plasma"], correctIndex: 0, explanation: "Solids keep their shape." },
    ],
  },

  // ─── Social Studies ───────────────────────────────────────────────────────────
  {
    id: "social-quick-1",
    title: "Social Studies Quick Check",
    subjectTitle: "Social Studies",
    level: "Class 6",
    questions: [
      { id: "ss1", type: "mcq", question: "A community is:", options: ["A type of animal", "People living in an area", "A mountain", "A weather type"], correctIndex: 1 },
      { id: "ss2", type: "mcq", question: "Rules in school mainly help to:", options: ["Make learning safe and fair", "Stop sports", "Increase homework only", "Close classrooms"], correctIndex: 0 },
      { id: "ss3", type: "mcq", question: "A citizen is a person who:", options: ["Lives in a country and has rights", "Only travels", "Never votes", "Owns a shop"], correctIndex: 0 },
      { id: "ss4", type: "mcq", question: "A map key/legend shows:", options: ["Weather", "Symbols meaning", "Languages", "Music notes"], correctIndex: 1 },
      { id: "ss5", type: "mcq", question: "Helping others and following rules is called:", options: ["Responsibility", "Gravity", "Pollution", "Volcano"], correctIndex: 0 },
      { id: "ss6", type: "mcq", question: "Which is a public service?", options: ["Hospital", "Toy shop", "Private kitchen", "Personal phone"], correctIndex: 0 },
    ],
  },

  // ─── Computer / ICT ───────────────────────────────────────────────────────────
  {
    id: "ict-quick-1",
    title: "Computer / ICT Quick Check",
    subjectTitle: "Computer / ICT",
    level: "Class 6",
    questions: [
      { id: "c1", type: "mcq", question: "CPU stands for:", options: ["Central Processing Unit", "Computer Power Unit", "Control Program Utility", "Central Print Unit"], correctIndex: 0 },
      { id: "c2", type: "mcq", question: "Which is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], correctIndex: 2 },
      { id: "c3", type: "mcq", question: "A strong password should:", options: ["Be your name", "Use only 1234", "Be long with mix of characters", "Be the same everywhere"], correctIndex: 2 },
      { id: "c4", type: "mcq", question: "Which is an example of a web browser?", options: ["Chrome", "Windows", "PowerPoint", "Calculator"], correctIndex: 0 },
      { id: "c5", type: "mcq", question: "Saving a file means:", options: ["Deleting it", "Storing it for later", "Printing it", "Scanning it"], correctIndex: 1 },
      { id: "c6", type: "mcq", question: "Which is safe online behavior?", options: ["Share OTP with friends", "Click unknown links", "Keep personal info private", "Use same password everywhere"], correctIndex: 2 },
    ],
  },

  // ─── Geography ────────────────────────────────────────────────────────────────
  {
    id: "geo-quick-1",
    title: "Geography Quick Check",
    subjectTitle: "Geography",
    level: "Class 6",
    questions: [
      { id: "g1", type: "mcq", question: "The Earth is divided into:", options: ["continents and oceans", "only deserts", "only rivers", "only forests"], correctIndex: 0 },
      { id: "g2", type: "mcq", question: "A compass shows:", options: ["Time", "Directions", "Temperature", "Rainfall"], correctIndex: 1 },
      { id: "g3", type: "mcq", question: "The equator is:", options: ["A mountain range", "An imaginary line around Earth", "A river", "A city"], correctIndex: 1 },
      { id: "g4", type: "mcq", question: "Climate means:", options: ["Daily weather", "Long-term weather pattern", "Only rain", "Only wind"], correctIndex: 1 },
      { id: "g5", type: "mcq", question: "A desert usually has:", options: ["Very high rainfall", "Very low rainfall", "Snow all year", "No sand"], correctIndex: 1 },
      { id: "g6", type: "mcq", question: "A map scale tells:", options: ["How far distances are in real life", "How many colors are used", "What food people eat", "Which language is spoken"], correctIndex: 0 },
    ],
  },

  // ─── History ──────────────────────────────────────────────────────────────────
  {
    id: "history-quick-1",
    title: "History Quick Check",
    subjectTitle: "History",
    level: "Class 6",
    questions: [
      { id: "h1", type: "mcq", question: "History is the study of:", options: ["Future events", "Past events", "Only science", "Only maps"], correctIndex: 1 },
      { id: "h2", type: "mcq", question: "A timeline shows:", options: ["Weather changes", "Events in order", "Math answers", "Music beats"], correctIndex: 1 },
      { id: "h3", type: "mcq", question: "A primary source is:", options: ["A textbook summary", "An eyewitness diary", "A cartoon", "A guess"], correctIndex: 1 },
      { id: "h4", type: "mcq", question: "The word 'century' means:", options: ["10 years", "50 years", "100 years", "1000 years"], correctIndex: 2 },
      { id: "h5", type: "mcq", question: "An artifact is:", options: ["A modern app", "An old object from the past", "A planet", "A disease"], correctIndex: 1 },
      { id: "h6", type: "mcq", question: "Why do we study history?", options: ["To learn from the past", "To avoid reading", "To change math rules", "To stop travel"], correctIndex: 0 },
    ],
  },

  // ─── General Knowledge ────────────────────────────────────────────────────────
  {
    id: "gk-quick-1",
    title: "General Knowledge Quick Check",
    subjectTitle: "General Knowledge",
    level: "Class 6",
    questions: [
      { id: "k1", type: "mcq", question: "Which is a planet?", options: ["Moon", "Mars", "Sun", "Star"], correctIndex: 1 },
      { id: "k2", type: "mcq", question: "How many days are in a week?", options: ["5", "6", "7", "8"], correctIndex: 2 },
      { id: "k3", type: "mcq", question: "Which is the largest ocean?", options: ["Indian", "Pacific", "Atlantic", "Arctic"], correctIndex: 1 },
      { id: "k4", type: "mcq", question: "Which is a renewable energy source?", options: ["Coal", "Solar", "Petrol", "Gas"], correctIndex: 1 },
      { id: "k5", type: "mcq", question: "A doctor mainly helps to:", options: ["Build houses", "Treat illness", "Fly planes", "Sell clothes"], correctIndex: 1 },
      { id: "k6", type: "mcq", question: "Which is a fruit?", options: ["Carrot", "Potato", "Apple", "Onion"], correctIndex: 2 },
    ],
  },

  // ─── Islamiat ─────────────────────────────────────────────────────────────────
  {
    id: "isl-quick-1",
    title: "Islamiat Quick Check",
    subjectTitle: "Islamiat",
    level: "Class 6",
    questions: [
      { id: "i1", type: "mcq", question: "Muslims follow the teachings of:", options: ["The Qur'an and Sunnah", "Only stories", "Only history books", "Only newspapers"], correctIndex: 0 },
      { id: "i2", type: "mcq", question: "The Five Pillars are important because they:", options: ["Teach math", "Guide Muslim life", "Replace school", "Stop learning"], correctIndex: 1 },
      { id: "i3", type: "mcq", question: "Salah is offered:", options: ["Once a week", "Five times a day", "Once a year", "Only in Ramadan"], correctIndex: 1 },
      { id: "i4", type: "mcq", question: "Truthfulness is:", options: ["A bad habit", "An Islamic value", "Not important", "Only for adults"], correctIndex: 1 },
      { id: "i5", type: "mcq", question: "Helping others is:", options: ["Discouraged", "Encouraged in Islam", "Only for friends", "Not allowed"], correctIndex: 1 },
      { id: "i6", type: "mcq", question: "Respecting parents is:", options: ["Optional", "Very important in Islam", "Not needed", "Only for children"], correctIndex: 1 },
    ],
  },
];

export function getQuizById(id: string) {
  return QUIZZES.find((q) => q.id === id) || null;
}

export function getQuizzesBySubject(subjectTitle: string) {
  const key = subjectTitle.trim().toLowerCase();
  return QUIZZES.filter((q) => q.subjectTitle.trim().toLowerCase() === key);
}
