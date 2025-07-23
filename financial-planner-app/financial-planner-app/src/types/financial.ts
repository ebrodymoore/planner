export interface PersonalInfo {
  name: string;
  dateOfBirth: string;
  maritalStatus: string;
  dependents: number;
  dependentAges: string;
  state: string;
  country: string;
  employmentStatus: string;
  industry: string;
  profession: string;
  communicationMethod: string;
  meetingFrequency: string;
}

export interface Income {
  annualIncome: number;
  stability: string;
  growthExpectation: string;
  spouseIncome: number;
  rentalIncome: number;
  businessIncome: number;
  investmentIncome: number;
  otherIncome: number;
  otherIncomeDescription: string;
  retirementAge: number;
  majorIncomeChanges: string;
}

export interface Expenses {
  // Housing
  housingPayment: number;
  housingType: string;
  propertyTaxes: number;
  hoaFees: number;
  homeInsurance: number;
  utilities: number;
  internetCablePhone: number;
  
  // Transportation
  autoInsurance: number;
  gasoline: number;
  vehicleMaintenance: number;
  vehicleRegistration: number;
  parkingTolls: number;
  publicTransportation: number;
  
  // Healthcare
  healthInsurance: number;
  dentalInsurance: number;
  visionInsurance: number;
  medicalCopays: number;
  outOfPocketHealthcare: number;
  
  // Personal & Living
  foodGroceries: number;
  diningEntertainment: number;
  clothing: number;
  personalCare: number;
  subscriptionsMemberships: number;
  cellPhone: number;
  petExpenses: number;
  childCareSchool: number;
  
  // Irregular/Annual
  annualVacation: number;
  holidayGifts: number;
  professionalExpenses: number;
  homeMaintenance: number;
  charitableDonations: number;
  lifeInsurancePremiums: number;
  taxPreparation: number;
  
  // Analysis
  fixedVsVariableRatio: string;
  seasonalVariations: string;
  recentExpenseChanges: string;
  potentialReductions: string;
}

export interface Assets {
  checking: number;
  savings: number;
  emergencyTarget: string;
  retirement401k: number;
  ira: number;
  taxableAccounts: number;
  homeValue: number;
}

export interface AutoLoan {
  balance: number;
  rate: number;
  term: string;
  description: string;
}

export interface CreditCard {
  name: string;
  balance: number;
  limit: number;
  rate: number;
}

export interface StudentLoan {
  balance: number;
  rate: number;
  servicer: string;
  type: string;
}

export interface Liabilities {
  mortgageBalance: number;
  mortgageRate: number;
  mortgageYears: number;
  autoLoans: AutoLoan[];
  creditCards: CreditCard[];
  studentLoans: StudentLoan[];
}

export interface Goals {
  retirementPriority: number;
  emergencyPriority: number;
  debtPriority: number;
  retirementAge: number;
  retirementIncome: number;
}

export interface Preferences {
  secondHome: string;
  secondHomeBudget: number;
  businessInterest: string;
  businessCapital: number;
}

export interface RiskAssessment {
  experienceLevel: string;
  largestLoss: string;
  portfolioDrop: string;
  timeline: string;
}

// New comprehensive interfaces
export interface EmployerBenefits {
  match401kAvailable: boolean;
  match401kDetails: string;
  current401kContributionRate: number;
  loan401kOutstanding: number;
  pensionAvailable: boolean;
  pensionExpectedBenefit: number;
  stockPurchasePlan: boolean;
  fsaContribution: number;
  otherBenefits: string;
}

export interface Insurance {
  // Health
  healthInsuranceType: string;
  healthPremiumCost: number;
  annualDeductible: number;
  outOfPocketMax: number;
  hsaEligible: boolean;
  networkRestrictions: string;
  prescriptionCoverage: string;
  
  // Dental & Vision
  dentalInsurance: string;
  dentalPremium: number;
  visionInsurance: string;
  visionPremium: number;
  
  // Life Insurance
  employerLifeInsurance: number;
  supplementalLifeInsurance: number;
  privateLifeInsurance: number;
  lifeInsuranceType: string;
  lifeInsurancePremium: number;
  beneficiaryUpdated: string;
  
  // Disability
  shortTermDisability: string;
  stdCoveragePercentage: number;
  stdEliminationPeriod: string;
  longTermDisability: string;
  ltdCoveragePercentage: number;
  ltdEliminationPeriod: string;
  ownVsAnyOccupation: string;
  
  // Property
  propertyInsuranceType: string;
  propertyInsurancePremium: number;
  propertyCoverageAmount: number;
  personalPropertyCoverage: number;
  liabilityCoverageAmount: number;
  umbrellaPolicy: boolean;
  umbrellaCoverageAmount: number;
  
  // Auto
  autoInsurancePremium: number;
  liabilityCoverage: string;
  comprehensiveDeductible: number;
  uninsuredMotoristCoverage: boolean;
  rentalCarCoverage: boolean;
  
  // Analysis
  perceivedGaps: string;
  recentClaims: string;
  insuranceReviewFrequency: string;
}

export interface TaxSituation {
  filingStatus: string;
  adjustedGrossIncome2023: number;
  totalTaxLiability2023: number;
  refundOrOwed2023: number;
  currentFederalTaxBracket: string;
  stateIncomeTaxRate: number;
  marginalVsEffectiveUnderstanding: string;
  
  // Withholding
  w4AllowancesStatus: string;
  additionalWithholding: number;
  quarterlyEstimatedPayments: number;
  withholdingAdequacy: string;
  
  // Tax-Advantaged Accounts
  currentTaxAdvantagedAccounts: string[];
  rothVsTraditionalStrategy: string;
  backdoorRothExperience: string;
  megaBackdoorRothAvailable: string;
  
  // Advanced Strategies
  taxLossHarvesting: string;
  charitableGivingStrategy: string;
  businessDeductions: string;
  itemizedVsStandard: string;
  
  // Side Income
  income1099: number;
  rentalPropertyIncome: number;
  investmentIncomeAmount: number;
  cryptoActivities: string;
  stateTaxConsiderations: string;
  
  // Planning
  taxProfessionalUsed: string;
  taxPlanningVsPreparation: string;
  futureTaxRateExpectations: string;
  taxLawChangesImpact: string;
}

export interface EstatePlanning {
  // Basic Estate Documents
  will: string;
  willLastUpdated: string;
  powerOfAttorney: string;
  advanceDirective: string;
  guardianshipDesignation: string;
  estatePlanningAttorney: string;
  
  // Trust Planning
  revocableTrust: string;
  irrevocableTrusts: string;
  trustBeneficiaries: string;
  trustSuccessor: string;
  
  // Tax Planning
  estimatedNetWorth: number;
  estateTaxConcern: string;
  giftTaxStrategy: string;
  charitableGiving: string;
  
  // Business Succession
  businessOwner: boolean;
  businessType: string;
  businessValue: number;
  successionPlan: string;
  keyPersonInsurance: string;
  
  // Digital Assets & Final Instructions
  digitalAssets: string[];
  digitalExecutor: string;
  passwordManager: string;
  funeralPreferences: string;
  importantDocumentsLocation: string;
  
  // Estate Planning Review
  lastReviewDate: string;
  majorLifeChanges: string;
  estatePlanningConcerns: string;
}

export interface Behavioral {
  // Money Personality
  moneyPersonality: string;
  spendingTriggers: string;
  financialDecisionMaking: string;
  moneyDiscussion: string;
  
  // Financial Habits
  budgetingApproach: string;
  billPaymentStyle: string;
  financialCheckFrequency: string;
  impulsePurchases: string;
  
  // Investment Psychology
  marketVolatilityReaction: string;
  investmentResearchHabits: string;
  lossVsGainSensitivity: string;
  investmentTimeHorizonThinking: string;
  
  // Financial History & Learning
  financialEducationBackground: string;
  majorFinancialMistakes: string;
  financialRoleModels: string;
  moneyStressLevel: string;
  financialGoalMotivation: string;
  
  // Cognitive Biases
  cognitiveBiases: string[];
  changeAdaptability: string;
  procrastinationTendency: string;
  financialPersonalityInsights: string;
}

export interface CashFlow {
  // Take-Home Pay
  takeHomePay: number;
  payFrequency: string;
  irregularIncome: number;
  incomeStability: string;
  
  // Expenses
  essentialExpenses: number;
  discretionaryExpenses: number;
  housingCostPercentage: number;
  debtToIncomeRatio: number;
  expenseFlexibility: string;
  
  // Discretionary Spending
  largestDiscretionaryCategory: string;
  seasonalSpendingVariation: string;
  unexpectedExpenseHandling: string;
  
  // Savings & Investment
  currentSavingsAllocation: number;
  retirementContributions: number;
  emergencyFundMonths: string;
  savingsGoalProgress: string;
  
  // Cash Flow Management
  budgetingMethod: string;
  cashFlowTiming: string;
  automaticTransfers: string;
  bankAccountStrategy: string;
  cashFlowChallenges: string;
}

export interface LifeCareer {
  // Career Development
  currentCareerSatisfaction: string;
  expectedIncomeGrowthRate: number;
  promotionTimeline: string;
  jobSecurityLevel: string;
  industryOutlook: string;
  skillsDevelopment: string;
  careerGoals: string;
  
  // Family Planning
  maritalStatus: string;
  currentChildren: number;
  plannedChildren: string;
  childcareStrategy: string;
  elderCareResponsibilities: string;
  familyFinancialSupport: string;
  
  // Major Life Events
  anticipatedLifeEvents: string[];
  homeOwnershipPlans: string;
  geographicMobilityWillingness: string;
  entrepreneurialInterests: string;
  educationalGoals: string;
  
  // Retirement Vision
  idealRetirementAge: number;
  retirementLocation: string;
  retirementLifestyle: string;
  retirementActivities: string;
  legacyGoals: string;
  
  // Health & Longevity
  healthStatus: string;
  familyHealthHistory: string;
  lifeExpectancyPlanning: string;
  healthcareCostConcerns: string;
  
  // Life Philosophy
  workLifeBalance: string;
  personalValues: string;
  lifeGoalsPriorities: string;
}

export interface InvestmentPhilosophy {
  // Management Preferences
  investmentManagementStyle: string;
  rebalancingFrequency: string;
  investmentResearchInterest: string;
  
  // Asset Allocation
  currentAssetAllocationKnowledge: string;
  internationalInvestmentComfort: string;
  alternativeInvestmentInterest: string;
  esgSustainableInvestingInterest: string;
  
  // Account Details
  taxableAccountStrategy: string;
  retirement401kOptionsQuality: string;
  iraInvestmentApproach: string;
  
  // Special Circumstances
  anticipatedInheritance: number;
  expectedWindfalls: string;
  dependentSpecialNeeds: string;
  eldercareResponsibilities: string;
  businessSuccessionPlans: string;
  
  // Education & Communication
  educationResources: string[];
  communicationFrequency: string;
  decisionMakingStyle: string;
  
  // Final Questions
  mostImportantOutcome: string;
  biggestObstacle: string;
  additionalInformation: string;
}

export interface FormData {
  personal?: PersonalInfo;
  income?: Income;
  expenses?: Expenses;
  assets?: Assets;
  liabilities?: Liabilities;
  goals?: Goals;
  preferences?: Preferences;
  risk?: RiskAssessment;
  employerBenefits?: EmployerBenefits;
  insurance?: Insurance;
  taxSituation?: TaxSituation;
  estatePlanning?: EstatePlanning;
  behavioral?: Behavioral;
  cashFlow?: CashFlow;
  lifeCareer?: LifeCareer;
  investmentPhilosophy?: InvestmentPhilosophy;
}

export interface FinancialSection {
  title: string;
  key: keyof FormData;
  icon: string;
  description: string;
  completed: boolean;
}

export interface QuestionnaireProgress {
  currentSection: number;
  totalSections: number;
  completedSections: number[];
  overallProgress: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface SectionValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}