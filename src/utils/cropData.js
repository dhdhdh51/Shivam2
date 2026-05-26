// Crop database with fertilizer and watering advice
export const CROPS = [
  'Wheat (Gehun)',
  'Rice (Chawal)',
  'Maize (Makka)',
  'Sugarcane (Ganna)',
  'Cotton (Kapas)',
  'Mustard (Sarson)',
  'Soybean',
  'Chickpea (Chana)',
  'Tomato',
  'Onion (Pyaaz)',
  'Potato (Aloo)',
  'Brinjal (Baingan)',
  'Chilli (Mirch)',
  'Groundnut (Mungfali)',
];

export const SOIL_TYPES = ['Sandy', 'Clay', 'Loamy', 'Silty', 'Black Cotton'];

export const getCropAdvice = crop => {
  const advice = {
    'Wheat (Gehun)': {
      fertilizers: [
        {name: 'DAP (Diammonium Phosphate)', dose: '50 kg/acre at sowing'},
        {name: 'Urea', dose: '55 kg/acre in 2 splits (CRI + tillering)'},
        {name: 'MOP (Muriate of Potash)', dose: '20 kg/acre at sowing'},
      ],
      wateringFrequency: 'Every 10-15 days (6 irrigations total)',
      criticalStages: ['Crown Root Initiation (CRI)', 'Tillering', 'Jointing', 'Flowering', 'Grain Filling'],
      sowingTime: 'October - November',
      tips: 'First irrigation at CRI stage (20-25 days after sowing) is most critical.',
    },
    'Rice (Chawal)': {
      fertilizers: [
        {name: 'Urea', dose: '60 kg/acre in 3 splits'},
        {name: 'DAP', dose: '35 kg/acre as basal'},
        {name: 'Zinc Sulphate', dose: '10 kg/acre as basal'},
      ],
      wateringFrequency: 'Keep 2-5 cm standing water; drain 10 days before harvest',
      criticalStages: ['Transplanting', 'Tillering', 'Panicle Initiation', 'Flowering'],
      sowingTime: 'June - July',
      tips: 'Apply 1st urea dose 7 days after transplanting.',
    },
    'Maize (Makka)': {
      fertilizers: [
        {name: 'DAP', dose: '50 kg/acre at sowing'},
        {name: 'Urea', dose: '65 kg/acre in 3 splits'},
        {name: 'MOP', dose: '25 kg/acre at sowing'},
      ],
      wateringFrequency: 'Every 8-10 days; critical at tasseling & silking',
      criticalStages: ['Germination', 'V6 stage', 'Tasseling', 'Silking', 'Grain fill'],
      sowingTime: 'June - July (Kharif) / Feb - March (Rabi)',
      tips: 'Avoid water stress at tasseling stage — yield drops 50%.',
    },
    'Tomato': {
      fertilizers: [
        {name: 'FYM (Farm Yard Manure)', dose: '8-10 tons/acre at land prep'},
        {name: 'DAP', dose: '50 kg/acre as basal'},
        {name: 'Urea', dose: '40 kg/acre in 2 splits'},
        {name: 'MOP', dose: '30 kg/acre as basal'},
      ],
      wateringFrequency: 'Every 5-7 days; drip irrigation preferred',
      criticalStages: ['Transplanting', 'Flowering', 'Fruit Set', 'Fruit Development'],
      sowingTime: 'June-July (Kharif) / Oct-Nov (Rabi)',
      tips: 'Spray 0.5% Borax at flowering to improve fruit set.',
    },
    'Potato (Aloo)': {
      fertilizers: [
        {name: 'FYM', dose: '10 tons/acre at land prep'},
        {name: 'DAP', dose: '60 kg/acre as basal'},
        {name: 'Urea', dose: '50 kg/acre in 2 splits'},
        {name: 'MOP', dose: '50 kg/acre as basal'},
      ],
      wateringFrequency: 'Every 7-10 days; avoid waterlogging',
      criticalStages: ['Sprouting', 'Stolon Initiation', 'Tuber Bulking', 'Maturation'],
      sowingTime: 'October - November',
      tips: 'Earth up at 30 days to prevent tuber greening.',
    },
    'Cotton (Kapas)': {
      fertilizers: [
        {name: 'DAP', dose: '40 kg/acre as basal'},
        {name: 'Urea', dose: '55 kg/acre in 3 splits'},
        {name: 'MOP', dose: '25 kg/acre as basal'},
      ],
      wateringFrequency: 'Every 10-12 days; critical at boll formation',
      criticalStages: ['Germination', 'Squaring', 'Flowering', 'Boll Development'],
      sowingTime: 'April - June',
      tips: 'Apply foliar spray of 2% urea at squaring stage.',
    },
  };

  // Default advice for unlisted crops
  const defaultAdvice = {
    fertilizers: [
      {name: 'DAP', dose: '40-50 kg/acre at sowing'},
      {name: 'Urea', dose: '40-50 kg/acre in 2 splits'},
      {name: 'MOP', dose: '20 kg/acre at sowing'},
    ],
    wateringFrequency: 'Every 8-12 days depending on weather',
    criticalStages: ['Germination', 'Vegetative', 'Flowering', 'Harvest'],
    sowingTime: 'As per local agro-climatic zone',
    tips: 'Consult your local Krishi Vigyan Kendra (KVK) for specific advice.',
  };

  return advice[crop] || defaultAdvice;
};

export const getWateringDays = crop => {
  const wateringMap = {
    'Wheat (Gehun)': 12,
    'Rice (Chawal)': 3,
    'Maize (Makka)': 9,
    'Tomato': 6,
    'Potato (Aloo)': 8,
    'Cotton (Kapas)': 11,
    'Mustard (Sarson)': 14,
    'Onion (Pyaaz)': 7,
    'Sugarcane (Ganna)': 10,
    'Soybean': 10,
    'Chickpea (Chana)': 15,
  };
  return wateringMap[crop] || 10;
};
