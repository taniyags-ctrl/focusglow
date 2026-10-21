export type QuestionType = "mcq" | "subjective";

export type QuizQuestion = {
  q: string;
  type: QuestionType;
  options?: string[];
  answer?: number;
  sampleAnswer: string;
  explanation: string;
};

type Bank = Record<string, QuizQuestion[]>;

const bank: Bank = {
  maths: [
    {
      q: "What is the value of pi, rounded to two decimal places?",
      type: "mcq",
      options: ["3.14", "3.16", "2.14", "3.41"],
      answer: 0,
      sampleAnswer: "3.14",
      explanation:
        "Pi (π) is the ratio of a circle's circumference to its diameter. Rounded to two decimals, it is 3.14.",
    },
    {
      q: "A triangle with all three sides equal is called…",
      type: "mcq",
      options: ["Equilateral", "Isosceles", "Scalene", "Right-angled"],
      answer: 0,
      sampleAnswer: "Equilateral",
      explanation:
        "An equilateral triangle has all three sides equal (and all angles 60°). Isosceles has two equal sides.",
    },
    {
      q: "A book costs ₹200 and there's a 10% discount. What do you pay?",
      type: "mcq",
      options: ["₹180", "₹190", "₹210", "₹220"],
      answer: 0,
      sampleAnswer: "₹180",
      explanation:
        "10% of 200 is 20. So you pay 200 − 20 = ₹180.",
    },
    {
      q: "Define what a quadrilateral is. Give any two examples.",
      type: "subjective",
      sampleAnswer: "A quadrilateral is a polygon with 4 sides and 4 vertices. Examples include square, rectangle, parallelogram, and trapezium.",
      explanation: "A quadrilateral is any closed 2D shape with exactly 4 straight sides.",
    },
    {
      q: "What is the angle sum property of a quadrilateral? Explain briefly.",
      type: "subjective",
      sampleAnswer: "The sum of all interior angles of a quadrilateral is 360 degrees. This can be shown by dividing the quadrilateral into two triangles.",
      explanation: "Angle sum property: all 4 interior angles add up to 360°.",
    },
    {
      q: "State the Pythagorean theorem.",
      type: "subjective",
      sampleAnswer: "In a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c²",
      explanation: "Pythagorean theorem: a² + b² = c² where c is the hypotenuse.",
    },
  ],
  science: [
    {
      q: "Which gas do plants absorb from the air?",
      type: "mcq",
      options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
      answer: 0,
      sampleAnswer: "Carbon dioxide",
      explanation:
        "Plants absorb carbon dioxide (CO₂) and use it in photosynthesis to make food.",
    },
    {
      q: "What is H2O commonly known as?",
      type: "mcq",
      options: ["Water", "Salt", "Acid", "Oxygen"],
      answer: 0,
      sampleAnswer: "Water",
      explanation:
        "H₂O means two hydrogen atoms and one oxygen atom — that's a water molecule.",
    },
    {
      q: "What force pulls objects toward Earth?",
      type: "mcq",
      options: ["Gravity", "Friction", "Magnetism", "Tension"],
      answer: 0,
      sampleAnswer: "Gravity",
      explanation:
        "Gravity is the force that pulls everything toward the centre of the Earth.",
    },
    {
      q: "Explain the process of photosynthesis in your own words.",
      type: "subjective",
      sampleAnswer: "Photosynthesis is the process by which green plants use sunlight, water, and carbon dioxide to make glucose (food) and release oxygen. It happens in the chloroplasts of plant cells using chlorophyll.",
      explanation: "Photosynthesis converts light energy into chemical energy in plants.",
    },
    {
      q: "What is the difference between renewable and non-renewable energy? Give examples.",
      type: "subjective",
      sampleAnswer: "Renewable energy sources replenish naturally (solar, wind, water). Non-renewable sources take millions of years to form and run out (coal, petroleum, natural gas).",
      explanation: "Renewable = unlimited supply. Non-renewable = finite, will exhaust.",
    },
    {
      q: "Describe Newton's Third Law of Motion with an example.",
      type: "subjective",
      sampleAnswer: "Newton's Third Law states that every action has an equal and opposite reaction. Example: When you push a wall, the wall pushes back on you with equal force.",
      explanation: "Forces always come in action-reaction pairs.",
    },
  ],
  english: [
    {
      q: "A noun is a word that names a…",
      type: "mcq",
      options: ["Person, place or thing", "Action", "Description", "Linking word"],
      answer: 0,
      sampleAnswer: "Person, place or thing",
      explanation:
        "Nouns name people, places, things or ideas. Words for actions are verbs.",
    },
    {
      q: "Which word is a synonym of 'happy'?",
      type: "mcq",
      options: ["Joyful", "Angry", "Tired", "Sad"],
      answer: 0,
      sampleAnswer: "Joyful",
      explanation:
        "A synonym is a word with the same meaning. 'Joyful' means very happy.",
    },
    {
      q: "In 'The cat sat on the mat', how many words are nouns?",
      type: "mcq",
      options: ["1", "2", "3", "4"],
      answer: 1,
      sampleAnswer: "2",
      explanation: "'Cat' and 'mat' are nouns, so the answer is 2.",
    },
    {
      q: "What is the difference between a simile and a metaphor? Give one example of each.",
      type: "subjective",
      sampleAnswer: "A simile compares two things using 'like' or 'as' (e.g., 'brave as a lion'). A metaphor directly states something is something else (e.g., 'time is money'). Both are figures of speech.",
      explanation: "Simile uses 'like/as'; metaphor is a direct comparison.",
    },
    {
      q: "Write the past tense and past participle of: go, eat, write, take.",
      type: "subjective",
      sampleAnswer: "Go: went / gone. Eat: ate / eaten. Write: wrote / written. Take: took / taken.",
      explanation: "These are irregular verbs — their past forms don't follow the -ed pattern.",
    },
    {
      q: "Explain what a subject-verb agreement is with two examples.",
      type: "subjective",
      sampleAnswer: "Subject-verb agreement means the verb must agree with the subject in number. Singular subject → singular verb: 'He runs fast.' Plural subject → plural verb: 'They run fast.'",
      explanation: "The verb form must match the subject (singular/plural).",
    },
  ],
  history: [
    {
      q: "In which year did India become a republic?",
      type: "mcq",
      options: ["1950", "1947", "1942", "1960"],
      answer: 0,
      sampleAnswer: "1950",
      explanation:
        "India became a republic on 26 January 1950, when the Constitution came into force.",
    },
    {
      q: "Who is known as the father of the Indian Constitution?",
      type: "mcq",
      options: [
        "Dr. B. R. Ambedkar",
        "Mahatma Gandhi",
        "Jawaharlal Nehru",
        "Rabindranath Tagore",
      ],
      answer: 0,
      sampleAnswer: "Dr. B. R. Ambedkar",
      explanation:
        "Dr. B. R. Ambedkar chaired the Drafting Committee of the Indian Constitution.",
    },
    {
      q: "Which city is the capital of India?",
      type: "mcq",
      options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"],
      answer: 0,
      sampleAnswer: "New Delhi",
      explanation: "New Delhi is the capital of India.",
    },
    {
      q: "What was the significance of the Quit India Movement? When was it launched?",
      type: "subjective",
      sampleAnswer: "The Quit India Movement was launched by Mahatma Gandhi on 8 August 1942 demanding an end to British rule. It was a mass civil disobedience movement. Leaders were arrested but the movement energized the freedom struggle.",
      explanation: "1942 Quit India was a major milestone in India's independence struggle.",
    },
    {
      q: "Describe the main causes of the Indian Revolt of 1857.",
      type: "subjective",
      sampleAnswer: "Main causes: Political (Doctrine of Lapse, annexation), Economic (heavy taxes, destruction of Indian industries), Military (low pay, racial discrimination, new rifle cartridges), Social (fear of forced conversion, interference in customs).",
      explanation: "The 1857 revolt had multiple political, economic, military, and social causes.",
    },
    {
      q: "What were the main ideals of the Indian freedom struggle?",
      type: "subjective",
      sampleAnswer: "Key ideals included self-governance (Swaraj), non-violence (Ahimsa), communal harmony, equality, justice, and dignity for all Indians. Leaders like Gandhi, Nehru, and Ambedkar envisioned a democratic, secular, socialist republic.",
      explanation: "The freedom movement was guided by principles of democracy and justice.",
    },
  ],
  hindi: [
    {
      q: "'पुस्तक' का अर्थ क्या है?",
      type: "mcq",
      options: ["किताब", "कलम", "बस्ता", "टोपी"],
      answer: 0,
      sampleAnswer: "किताब",
      explanation: "'पुस्तक' का अर्थ है किताब (book)।",
    },
    {
      q: "हिंदी वर्णमाला में कुल कितने स्वर होते हैं?",
      type: "mcq",
      options: ["11", "5", "33", "14"],
      answer: 0,
      sampleAnswer: "11",
      explanation: "हिंदी में 11 स्वर होते हैं (अ, आ, इ, ई, उ, ऊ, ऋ, ए, ऐ, ओ, औ)।",
    },
    {
      q: "'सूरज' का पर्यायवाची शब्द है…",
      type: "mcq",
      options: ["भानु", "चंद्रमा", "नदी", "पहाड़"],
      answer: 0,
      sampleAnswer: "भानु",
      explanation: "'सूरज' का पर्यायवाची शब्द 'भानु' है।",
    },
    {
      q: "संज्ञा और सर्वनाम में क्या अंतर है? दो-दो उदाहरण दीजिए।",
      type: "subjective",
      sampleAnswer: "संज्ञा = किसी व्यक्ति, वस्तु या स्थान का नाम (जैसे: लड़का, किताब, दिल्ली)। सर्वनाम = संज्ञा के स्थान पर प्रयुक्त शब्द (जैसे: वह, यह, मैं)।",
      explanation: "संज्ञा = नाम वाचक। सर्वनाम = संज्ञा का स्थान लेता है।",
    },
    {
      q: "समास के 4 भेदों के नाम लिखिए और एक-एक उदाहरण दीजिए।",
      type: "subjective",
      sampleAnswer: "1. तत्पुरुष समास: राजा का पुत्र (राजपुत्र)। 2. कर्मधारय समास: नीला कमल (नीलकमल)। 3. द्वंद्व समास: राम-लखन। 4. बहुव्रीहि समास: नीलकंठ (नीला गला वाला)।",
      explanation: "समास = दो या अधिक शब्दों का संयोग। चार मुख्य भेद हैं।",
    },
    {
      q: "क्या अंतर है 'पर्यायवाची' और 'विलोम' में? उदाहरण सहित समझाइए।",
      type: "subjective",
      sampleAnswer: "पर्यायवाची = एक ही अर्थ वाले शब्द (जैसे: जल, पानी, नीर, अंबु)। विलोम = विपरीत अर्थ वाले शब्द (जैसे: दिन-रात, अंधेरा-उजाला)।",
      explanation: "पर्यायवाची = समानार्थक। विलोम = विपरीतार्थक।",
    },
  ],
};

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

function generateMCQFromMaterial(material: string, topic: string): QuizQuestion[] {
  const sentences = splitIntoSentences(material);
  const questions: QuizQuestion[] = [];

  for (const sentence of sentences.slice(0, 5)) {
    const words = sentence.split(/\s+/).filter((w) => w.length > 4);
    if (words.length < 3) continue;

    const keyPhrase = words.slice(0, 3).join(" ");
    const distractors = [
      "This concept is unrelated to the topic",
      "This is a misconception about the subject",
      "This contradicts the study material",
    ].sort(() => Math.random() - 0.5);

    const correctIdx = Math.floor(Math.random() * 4);
    const options = [...distractors];
    options.splice(correctIdx, 0, `The correct answer relates to: ${keyPhrase}`);

    questions.push({
      q: `Based on your notes on "${topic}": Which statement is correct?`,
      type: "mcq",
      options,
      answer: correctIdx,
      sampleAnswer: `Based on the material: ${sentence}`,
      explanation: sentence,
    });
  }

  return questions;
}

function generateSubjectiveFromMaterial(material: string, topic: string): QuizQuestion[] {
  const sentences = splitIntoSentences(material);
  const questions: QuizQuestion[] = [];

  if (sentences.length >= 1) {
    questions.push({
      q: `Explain in your own words: What is ${topic}? Use your notes to answer.`,
      type: "subjective",
      sampleAnswer: sentences[0],
      explanation: `Key point from your notes: ${sentences[0]}`,
    });
  }

  if (sentences.length >= 3) {
    questions.push({
      q: `List the key points you studied about ${topic}. Write at least 3 points from your notes.`,
      type: "subjective",
      sampleAnswer: sentences.slice(0, 3).join(". ") + ".",
      explanation: "Your notes contained multiple key concepts on this topic.",
    });
  }

  questions.push({
    q: `Write a short summary (2-3 sentences) of what you studied about ${topic}.`,
    type: "subjective",
    sampleAnswer: material.slice(0, 200),
    explanation: "A good summary captures the main ideas from your study material.",
  });

  questions.push({
    q: `How well do you understand ${topic}? What was easy and what was difficult?`,
    type: "subjective",
    sampleAnswer: `I understand ${topic} well. The easy parts were... and the difficult parts were...`,
    explanation: "Self-reflection helps identify areas for improvement.",
  });

  return questions;
}

export function getQuizQuestions(
  subject: string,
  topic: string,
  material?: string
): QuizQuestion[] {
  const subj = subject.toLowerCase();
  const pool =
    bank[subj] ??
    bank[
      ["science", "physics", "chemistry", "biology", "evs"].includes(subj)
        ? "science"
        : subj
    ] ??
    [];

  const hasMaterial = material && material.trim().length > 20;

  if (hasMaterial) {
    const materialSubjective = generateSubjectiveFromMaterial(material!, topic);

    const all = materialSubjective;
    return pick(all, 3);
  }

  if (pool.length > 0) {
    const subjectives = pool.filter((q) => q.type === "subjective");

    const picked = pick(subjectives, 2);

    const topicCheck: QuizQuestion = {
      q: `What topic did you study today? Explain what you learned.`,
      type: "subjective",
      sampleAnswer: `I studied ${topic} and learned the key concepts.`,
      explanation: `The goal you set and completed was: ${topic}.`,
    };

    return [...picked, topicCheck].slice(0, 3);
  }

  return [
    {
      q: `What topic did you study today? Explain in detail.`,
      type: "subjective",
      sampleAnswer: topic,
      explanation: `You studied: ${topic}`,
    },
    {
      q: `What are the key concepts you learned from ${topic}?`,
      type: "subjective",
      sampleAnswer: `Key concepts from ${topic} include the main principles and definitions covered in the material.`,
      explanation: `Reflection on: ${topic}`,
    },
    {
      q: `Write a short summary of what you studied about ${topic}.`,
      type: "subjective",
      sampleAnswer: `I studied ${topic} and learned key concepts from the material.`,
      explanation: `Reflection on: ${topic}`,
    },
  ];
}
