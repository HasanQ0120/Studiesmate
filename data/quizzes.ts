export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type Quiz = {
  id: string;
  title: string;
  subjectTitle: string; // must match your subject titles exactly
  level?: string;
  questions: QuizQuestion[];
};

export const QUIZZES: Quiz[] = [
  {
    id: "math-quick-1",
    title: "Math Quick Check",
    subjectTitle: "Mathematics",
    level: "Class 6",
    questions: [
      { id: "m1", question: "What is 7 × 8?", options: ["54", "56", "64", "58"], correctIndex: 1, explanation: "7 × 8 = 56." },
      { id: "m2", question: "Which is a prime number?", options: ["9", "21", "17", "27"], correctIndex: 2, explanation: "17 has only two factors: 1 and 17." },
      { id: "m3", question: "Solve: 36 ÷ 6", options: ["4", "5", "6", "7"], correctIndex: 2, explanation: "36 ÷ 6 = 6." },
      { id: "m4", question: "What is 15% of 200?", options: ["15", "20", "25", "30"], correctIndex: 3, explanation: "10% is 20 and 5% is 10 → total 30." },
      { id: "m5", question: "Simplify: 3x + 2x", options: ["5", "5x", "6x", "x"], correctIndex: 1, explanation: "Like terms add: 3x + 2x = 5x." },
      { id: "m6", question: "A triangle has angles 50° and 60°. The third angle is:", options: ["70°", "80°", "90°", "110°"], correctIndex: 0, explanation: "Sum is 180°. 180 − 50 − 60 = 70." },
    ],
  },

  {
    id: "english-quick-1",
    title: "English Quick Check",
    subjectTitle: "English",
    level: "Class 6",
    questions: [
      {
        id: "e1",
        question: "Choose the correct sentence:",
        options: ["He don't like apples.", "He doesn't like apples.", "He doesn't likes apples.", "He don't likes apples."],
        correctIndex: 1,
        explanation: "With 'he', use 'doesn't' + base verb.",
      },
      { id: "e2", question: "What is a synonym of 'happy'?", options: ["Angry", "Joyful", "Tired", "Slow"], correctIndex: 1, explanation: "Joyful means happy." },
      { id: "e3", question: "Which one is a noun?", options: ["Run", "Beautiful", "Quickly", "Teacher"], correctIndex: 3, explanation: "Teacher is a person (noun)." },
      { id: "e4", question: "Pick the correct plural of 'child':", options: ["childs", "childes", "children", "childrens"], correctIndex: 2, explanation: "Plural of child is children." },
      { id: "e5", question: "Which is a complete sentence?", options: ["Because it was late.", "Running very fast.", "I finished my homework.", "In the classroom."], correctIndex: 2, explanation: "A sentence needs a subject and a verb." },
      { id: "e6", question: "Choose the correct word: 'She ____ to school daily.'", options: ["go", "goes", "going", "gone"], correctIndex: 1, explanation: "With 'she', use 'goes'." },
    ],
  },

  {
    id: "science-quick-1",
    title: "Science Quick Check",
    subjectTitle: "Science",
    level: "Class 6",
    questions: [
      { id: "s1", question: "Which is a living thing?", options: ["Rock", "Tree", "Water", "Air"], correctIndex: 1, explanation: "A tree grows and reproduces." },
      { id: "s2", question: "Water changes to steam when it:", options: ["freezes", "boils", "melts", "condenses"], correctIndex: 1, explanation: "Boiling turns liquid into gas." },
      { id: "s3", question: "Which organ helps us breathe?", options: ["Heart", "Lungs", "Stomach", "Kidney"], correctIndex: 1, explanation: "Lungs are for breathing." },
      { id: "s4", question: "Which is an example of a force?", options: ["Push", "Heat", "Sound", "Light"], correctIndex: 0, explanation: "Push/pull are forces." },
      { id: "s5", question: "Plants make food using:", options: ["photosynthesis", "evaporation", "condensation", "friction"], correctIndex: 0, explanation: "Photosynthesis is how plants make food." },
      { id: "s6", question: "Which state of matter has a fixed shape?", options: ["Solid", "Liquid", "Gas", "Plasma"], correctIndex: 0, explanation: "Solids keep their shape." },
    ],
  },

  {
    id: "social-quick-1",
    title: "Social Studies Quick Check",
    subjectTitle: "Social Studies",
    level: "Class 6",
    questions: [
      { id: "ss1", question: "A community is:", options: ["A type of animal", "People living in an area", "A mountain", "A weather type"], correctIndex: 1, explanation: "A community is people living together in an area." },
      { id: "ss2", question: "Rules in school mainly help to:", options: ["Make learning safe and fair", "Stop sports", "Increase homework only", "Close classrooms"], correctIndex: 0, explanation: "Rules keep things safe and fair." },
      { id: "ss3", question: "A citizen is a person who:", options: ["Lives in a country and has rights", "Only travels", "Never votes", "Owns a shop"], correctIndex: 0, explanation: "Citizens have rights and responsibilities." },
      { id: "ss4", question: "A map key/legend shows:", options: ["Weather", "Symbols meaning", "Languages", "Music notes"], correctIndex: 1, explanation: "Legend explains symbols on a map." },
      { id: "ss5", question: "Helping others and following rules is called:", options: ["Responsibility", "Gravity", "Pollution", "Volcano"], correctIndex: 0, explanation: "Responsibility means doing your duties." },
      { id: "ss6", question: "Which is a public service?", options: ["Hospital", "Toy shop", "Private kitchen", "Personal phone"], correctIndex: 0, explanation: "Hospitals provide public service." },
    ],
  },

  {
    id: "ict-quick-1",
    title: "Computer / ICT Quick Check",
    subjectTitle: "Computer / ICT",
    level: "Class 6",
    questions: [
      { id: "c1", question: "CPU stands for:", options: ["Central Processing Unit", "Computer Power Unit", "Control Program Utility", "Central Print Unit"], correctIndex: 0, explanation: "CPU = Central Processing Unit." },
      { id: "c2", question: "Which is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], correctIndex: 2, explanation: "Keyboard is used to input text." },
      { id: "c3", question: "A strong password should:", options: ["Be your name", "Use only 1234", "Be long with mix of characters", "Be the same everywhere"], correctIndex: 2, explanation: "Long + mixed characters is safer." },
      { id: "c4", question: "Which is an example of a web browser?", options: ["Chrome", "Windows", "PowerPoint", "Calculator"], correctIndex: 0, explanation: "Chrome is a browser." },
      { id: "c5", question: "Saving a file means:", options: ["Deleting it", "Storing it for later", "Printing it", "Scanning it"], correctIndex: 1, explanation: "Saving stores your work." },
      { id: "c6", question: "Which is safe online behavior?", options: ["Share OTP with friends", "Click unknown links", "Keep personal info private", "Use same password everywhere"], correctIndex: 2, explanation: "Keep personal info private." },
    ],
  },

  {
    id: "geo-quick-1",
    title: "Geography Quick Check",
    subjectTitle: "Geography",
    level: "Class 6",
    questions: [
      { id: "g1", question: "The Earth is divided into:", options: ["continents and oceans", "only deserts", "only rivers", "only forests"], correctIndex: 0, explanation: "Earth has continents and oceans." },
      { id: "g2", question: "A compass shows:", options: ["Time", "Directions", "Temperature", "Rainfall"], correctIndex: 1, explanation: "Compass shows directions (N, S, E, W)." },
      { id: "g3", question: "The equator is:", options: ["A mountain range", "An imaginary line around Earth", "A river", "A city"], correctIndex: 1, explanation: "Equator is an imaginary line around Earth." },
      { id: "g4", question: "Climate means:", options: ["Daily weather", "Long-term weather pattern", "Only rain", "Only wind"], correctIndex: 1, explanation: "Climate is long-term weather." },
      { id: "g5", question: "A desert usually has:", options: ["Very high rainfall", "Very low rainfall", "Snow all year", "No sand"], correctIndex: 1, explanation: "Deserts have low rainfall." },
      { id: "g6", question: "A map scale tells:", options: ["How far distances are in real life", "How many colors are used", "What food people eat", "Which language is spoken"], correctIndex: 0, explanation: "Scale converts map distance to real distance." },
    ],
  },

  {
    id: "history-quick-1",
    title: "History Quick Check",
    subjectTitle: "History",
    level: "Class 6",
    questions: [
      { id: "h1", question: "History is the study of:", options: ["Future events", "Past events", "Only science", "Only maps"], correctIndex: 1, explanation: "History is about the past." },
      { id: "h2", question: "A timeline shows:", options: ["Weather changes", "Events in order", "Math answers", "Music beats"], correctIndex: 1, explanation: "Timeline orders events by time." },
      { id: "h3", question: "A primary source is:", options: ["A textbook summary", "An eyewitness diary", "A cartoon", "A guess"], correctIndex: 1, explanation: "Primary source comes from that time." },
      { id: "h4", question: "The word 'century' means:", options: ["10 years", "50 years", "100 years", "1000 years"], correctIndex: 2, explanation: "Century = 100 years." },
      { id: "h5", question: "An artifact is:", options: ["A modern app", "An old object from the past", "A planet", "A disease"], correctIndex: 1, explanation: "Artifacts are objects made/used in the past." },
      { id: "h6", question: "Why do we study history?", options: ["To learn from the past", "To avoid reading", "To change math rules", "To stop travel"], correctIndex: 0, explanation: "History teaches lessons from past experiences." },
    ],
  },

  {
    id: "gk-quick-1",
    title: "General Knowledge Quick Check",
    subjectTitle: "General Knowledge",
    level: "Class 6",
    questions: [
      { id: "k1", question: "Which is a planet?", options: ["Moon", "Mars", "Sun", "Star"], correctIndex: 1, explanation: "Mars is a planet." },
      { id: "k2", question: "How many days are in a week?", options: ["5", "6", "7", "8"], correctIndex: 2, explanation: "There are 7 days in a week." },
      { id: "k3", question: "Which is the largest ocean?", options: ["Indian", "Pacific", "Atlantic", "Arctic"], correctIndex: 1, explanation: "Pacific is the largest." },
      { id: "k4", question: "Which is a renewable energy source?", options: ["Coal", "Solar", "Petrol", "Gas"], correctIndex: 1, explanation: "Solar energy is renewable." },
      { id: "k5", question: "A doctor mainly helps to:", options: ["Build houses", "Treat illness", "Fly planes", "Sell clothes"], correctIndex: 1, explanation: "Doctors treat illness." },
      { id: "k6", question: "Which is a fruit?", options: ["Carrot", "Potato", "Apple", "Onion"], correctIndex: 2, explanation: "Apple is a fruit." },
    ],
  },

  {
    id: "isl-quick-1",
    title: "Islamiat Quick Check",
    subjectTitle: "Islamiat",
    level: "Class 6",
    questions: [
      { id: "i1", question: "Muslims follow the teachings of:", options: ["The Qur’an and Sunnah", "Only stories", "Only history books", "Only newspapers"], correctIndex: 0, explanation: "Islam is based on Qur’an and Sunnah." },
      { id: "i2", question: "The Five Pillars are important because they:", options: ["Teach math", "Guide Muslim life", "Replace school", "Stop learning"], correctIndex: 1, explanation: "They guide worship and daily life." },
      { id: "i3", question: "Salah is offered:", options: ["Once a week", "Five times a day", "Once a year", "Only in Ramadan"], correctIndex: 1, explanation: "Salah is five times daily." },
      { id: "i4", question: "Truthfulness is:", options: ["A bad habit", "An Islamic value", "Not important", "Only for adults"], correctIndex: 1, explanation: "Truthfulness is a key Islamic value." },
      { id: "i5", question: "Helping others is:", options: ["Discouraged", "Encouraged in Islam", "Only for friends", "Not allowed"], correctIndex: 1, explanation: "Islam encourages kindness and helping." },
      { id: "i6", question: "Respecting parents is:", options: ["Optional", "Very important in Islam", "Not needed", "Only for children"], correctIndex: 1, explanation: "Respecting parents is strongly emphasized." },
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
