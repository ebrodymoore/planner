import React, { useState, useEffect } from 'react';
import { Download, Upload, RotateCcw, Eye } from 'lucide-react';

const FinancialPlanningPrototype = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('financialPlanningData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('financialPlanningData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setFormData(importedData);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setFormData({});
      localStorage.removeItem('financialPlanningData');
    }
  };

  const generateClaudeJson = () => {
    return {
      client_profile: {
        personal_info: {
          name: formData.personal?.name || "",
          age: parseInt(formData.personal?.age) || 0,
          marital_status: formData.personal?.maritalStatus || "",
          dependents: {
            count: parseInt(formData.personal?.dependents) || 0,
            ages: formData.personal?.dependentAges?.split(',').map(age => parseInt(age.trim())).filter(age => !isNaN(age)) || []
          },
          location: {
            state: formData.personal?.state || "",
            country: "United States"
          },
          employment: {
            status: formData.personal?.employmentStatus || "",
            industry: formData.personal?.industry || "",
            profession: formData.personal?.profession || ""
          }
        }
      },
      income: {
        primary: {
          annual_gross: parseInt(formData.income?.annualIncome) || 0,
          stability: formData.income?.stability || "",
          growth_expectation: formData.income?.growthExpectation || ""
        },
        additional_sources: {
          spouse_income: parseInt(formData.income?.spouseIncome) || 0,
          rental_income: parseInt(formData.income?.rentalIncome) || 0,
          investment_income: parseInt(formData.income?.investmentIncome) || 0
        },
        timeline: {
          expected_retirement_age: parseInt(formData.income?.retirementAge) || 65
        }
      },
      expenses: {
        housing: {
          monthly_payment: parseInt(formData.expenses?.housingPayment) || 0,
          type: formData.expenses?.housingType || ""
        },
        living_expenses: {
          monthly_food_groceries: parseInt(formData.expenses?.food) || 0,
          monthly_utilities: parseInt(formData.expenses?.utilities) || 0,
          monthly_transportation: parseInt(formData.expenses?.transportation) || 0,
          monthly_entertainment: parseInt(formData.expenses?.entertainment) || 0
        }
      },
      assets: {
        liquid: {
          checking_balance: parseInt(formData.assets?.checking) || 0,
          savings_balance: parseInt(formData.assets?.savings) || 0,
          emergency_fund_target: formData.assets?.emergencyTarget || ""
        },
        investments: {
          "401k_balance": parseInt(formData.assets?.retirement401k) || 0,
          ira_balance: parseInt(formData.assets?.ira) || 0,
          taxable_accounts: parseInt(formData.assets?.taxableAccounts) || 0
        },
        real_estate: {
          primary_residence: parseInt(formData.assets?.homeValue) || 0
        }
      },
      liabilities: {
        mortgage_debt: {
          primary_balance: parseInt(formData.liabilities?.mortgageBalance) || 0,
          primary_rate: parseFloat(formData.liabilities?.mortgageRate) || 0,
          years_remaining: parseInt(formData.liabilities?.mortgageYears) || 0
        },
        auto_loans: Array.isArray(formData.liabilities?.autoLoans) ? formData.liabilities.autoLoans.map(loan => ({
          balance: parseInt(loan.balance) || 0,
          rate: parseFloat(loan.rate) || 0,
          term: loan.term || "",
          description: loan.description || ""
        })) : [],
        credit_cards: Array.isArray(formData.liabilities?.creditCards) ? formData.liabilities.creditCards.map(card => ({
          name: card.name || "",
          balance: parseInt(card.balance) || 0,
          limit: parseInt(card.limit) || 0,
          rate: parseFloat(card.rate) || 0
        })) : [],
        student_loans: Array.isArray(formData.liabilities?.studentLoans) ? formData.liabilities.studentLoans.map(loan => ({
          balance: parseInt(loan.balance) || 0,
          rate: parseFloat(loan.rate) || 0,
          servicer: loan.servicer || "",
          type: loan.type || ""
        })) : []
      },
      financial_goals: {
        priority_ranking: {
          retirement_security: parseInt(formData.goals?.retirementPriority) || 1,
          emergency_fund: parseInt(formData.goals?.emergencyPriority) || 2,
          debt_elimination: parseInt(formData.goals?.debtPriority) || 3
        },
        specific_goals: {
          retirement: {
            target_age: parseInt(formData.goals?.retirementAge) || 65,
            desired_annual_income: parseInt(formData.goals?.retirementIncome) || 0
          }
        }
      },
      specific_life_goals: {
        real_estate: {
          second_home_interest: formData.preferences?.secondHome || "",
          second_home_budget: parseInt(formData.preferences?.secondHomeBudget) || 0
        },
        business: {
          entrepreneurship_interest: formData.preferences?.businessInterest || "",
          business_capital_needed: parseInt(formData.preferences?.businessCapital) || 0
        }
      },
      risk_assessment: {
        investment_experience: {
          experience_level: formData.risk?.experienceLevel || "",
          largest_loss: formData.risk?.largestLoss || ""
        },
        risk_tolerance: {
          portfolio_drop_20_percent: formData.risk?.portfolioDrop || "",
          investment_timeline: formData.risk?.timeline || ""
        }
      },
      current_market_context: {
        request_date: new Date().toISOString().split('T')[0],
        market_conditions: "Please use current market data and economic conditions"
      },
      analysis_requirements: {
        comprehensive_assessment: true,
        priority_recommendations: 5,
        implementation_timeline: "12 months",
        regulatory_compliance: "fiduciary_standard"
      }
    };
  };

  const sections = [
    { title: "Personal Information", key: "personal" },
    { title: "Income", key: "income" },
    { title: "Expenses", key: "expenses" },
    { title: "Assets", key: "assets" },
    { title: "Liabilities", key: "liabilities" },
    { title: "Goals", key: "goals" },
    { title: "Life Preferences", key: "preferences" },
    { title: "Risk Assessment", key: "risk" }
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border rounded px-3 py-2"
          value={formData.personal?.name || ''}
          onChange={(e) => updateFormData('personal', 'name', e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          className="border rounded px-3 py-2"
          value={formData.personal?.age || ''}
          onChange={(e) => updateFormData('personal', 'age', e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={formData.personal?.maritalStatus || ''}
          onChange={(e) => updateFormData('personal', 'maritalStatus', e.target.value)}
        >
          <option value="">Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
        <input
          type="number"
          placeholder="Number of Dependents"
          className="border rounded px-3 py-2"
          value={formData.personal?.dependents || ''}
          onChange={(e) => updateFormData('personal', 'dependents', e.target.value)}
        />
        <input
          type="text"
          placeholder="Dependent Ages (comma separated)"
          className="border rounded px-3 py-2"
          value={formData.personal?.dependentAges || ''}
          onChange={(e) => updateFormData('personal', 'dependentAges', e.target.value)}
        />
        <input
          type="text"
          placeholder="State"
          className="border rounded px-3 py-2"
          value={formData.personal?.state || ''}
          onChange={(e) => updateFormData('personal', 'state', e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={formData.personal?.employmentStatus || ''}
          onChange={(e) => updateFormData('personal', 'employmentStatus', e.target.value)}
        >
          <option value="">Employment Status</option>
          <option value="employed_full_time">Employed Full-time</option>
          <option value="employed_part_time">Employed Part-time</option>
          <option value="self_employed">Self-employed</option>
          <option value="retired">Retired</option>
        </select>
        <input
          type="text"
          placeholder="Industry"
          className="border rounded px-3 py-2"
          value={formData.personal?.industry || ''}
          onChange={(e) => updateFormData('personal', 'industry', e.target.value)}
        />
      </div>
    </div>
  );

  const renderIncome = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Income Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Annual Gross Income"
          className="border rounded px-3 py-2"
          value={formData.income?.annualIncome || ''}
          onChange={(e) => updateFormData('income', 'annualIncome', e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={formData.income?.stability || ''}
          onChange={(e) => updateFormData('income', 'stability', e.target.value)}
        >
          <option value="">Income Stability</option>
          <option value="very_stable">Very Stable</option>
          <option value="somewhat_stable">Somewhat Stable</option>
          <option value="variable">Variable</option>
        </select>
        <input
          type="number"
          placeholder="Spouse Income"
          className="border rounded px-3 py-2"
          value={formData.income?.spouseIncome || ''}
          onChange={(e) => updateFormData('income', 'spouseIncome', e.target.value)}
        />
        <input
          type="number"
          placeholder="Investment Income"
          className="border rounded px-3 py-2"
          value={formData.income?.investmentIncome || ''}
          onChange={(e) => updateFormData('income', 'investmentIncome', e.target.value)}
        />
        <input
          type="number"
          placeholder="Expected Retirement Age"
          className="border rounded px-3 py-2"
          value={formData.income?.retirementAge || ''}
          onChange={(e) => updateFormData('income', 'retirementAge', e.target.value)}
        />
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Monthly Expenses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Housing Payment"
          className="border rounded px-3 py-2"
          value={formData.expenses?.housingPayment || ''}
          onChange={(e) => updateFormData('expenses', 'housingPayment', e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={formData.expenses?.housingType || ''}
          onChange={(e) => updateFormData('expenses', 'housingType', e.target.value)}
        >
          <option value="">Housing Type</option>
          <option value="own_with_mortgage">Own with Mortgage</option>
          <option value="own_outright">Own Outright</option>
          <option value="rent">Rent</option>
        </select>
        <input
          type="number"
          placeholder="Food/Groceries"
          className="border rounded px-3 py-2"
          value={formData.expenses?.food || ''}
          onChange={(e) => updateFormData('expenses', 'food', e.target.value)}
        />
        <input
          type="number"
          placeholder="Utilities"
          className="border rounded px-3 py-2"
          value={formData.expenses?.utilities || ''}
          onChange={(e) => updateFormData('expenses', 'utilities', e.target.value)}
        />
        <input
          type="number"
          placeholder="Transportation Costs"
          className="border rounded px-3 py-2"
          value={formData.expenses?.transportation || ''}
          onChange={(e) => updateFormData('expenses', 'transportation', e.target.value)}
        />
        <input
          type="number"
          placeholder="Entertainment"
          className="border rounded px-3 py-2"
          value={formData.expenses?.entertainment || ''}
          onChange={(e) => updateFormData('expenses', 'entertainment', e.target.value)}
        />
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Assets</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Checking Account"
          className="border rounded px-3 py-2"
          value={formData.assets?.checking || ''}
          onChange={(e) => updateFormData('assets', 'checking', e.target.value)}
        />
        <input
          type="number"
          placeholder="Savings Account"
          className="border rounded px-3 py-2"
          value={formData.assets?.savings || ''}
          onChange={(e) => updateFormData('assets', 'savings', e.target.value)}
        />
        <input
          type="number"
          placeholder="401(k) Balance"
          className="border rounded px-3 py-2"
          value={formData.assets?.retirement401k || ''}
          onChange={(e) => updateFormData('assets', 'retirement401k', e.target.value)}
        />
        <input
          type="number"
          placeholder="IRA Balance"
          className="border rounded px-3 py-2"
          value={formData.assets?.ira || ''}
          onChange={(e) => updateFormData('assets', 'ira', e.target.value)}
        />
        <input
          type="number"
          placeholder="Taxable Investment Accounts"
          className="border rounded px-3 py-2"
          value={formData.assets?.taxableAccounts || ''}
          onChange={(e) => updateFormData('assets', 'taxableAccounts', e.target.value)}
        />
        <input
          type="number"
          placeholder="Home Value"
          className="border rounded px-3 py-2"
          value={formData.assets?.homeValue || ''}
          onChange={(e) => updateFormData('assets', 'homeValue', e.target.value)}
        />
      </div>
    </div>
  );

  const renderLiabilities = () => {
    const getAutoLoans = () => Array.isArray(formData.liabilities?.autoLoans) ? formData.liabilities.autoLoans : [];
    const getCreditCards = () => Array.isArray(formData.liabilities?.creditCards) ? formData.liabilities.creditCards : [];
    const getStudentLoans = () => Array.isArray(formData.liabilities?.studentLoans) ? formData.liabilities.studentLoans : [];

    const addAutoLoan = () => {
      const autoLoans = getAutoLoans();
      updateFormData('liabilities', 'autoLoans', [...autoLoans, { balance: '', rate: '', term: '', description: '' }]);
    };

    const removeAutoLoan = (index) => {
      const autoLoans = getAutoLoans();
      updateFormData('liabilities', 'autoLoans', autoLoans.filter((_, i) => i !== index));
    };

    const updateAutoLoan = (index, field, value) => {
      const autoLoans = getAutoLoans();
      const updated = [...autoLoans];
      updated[index] = { ...updated[index], [field]: value };
      updateFormData('liabilities', 'autoLoans', updated);
    };

    const addCreditCard = () => {
      const creditCards = getCreditCards();
      updateFormData('liabilities', 'creditCards', [...creditCards, { name: '', balance: '', limit: '', rate: '' }]);
    };

    const removeCreditCard = (index) => {
      const creditCards = getCreditCards();
      updateFormData('liabilities', 'creditCards', creditCards.filter((_, i) => i !== index));
    };

    const updateCreditCard = (index, field, value) => {
      const creditCards = getCreditCards();
      const updated = [...creditCards];
      updated[index] = { ...updated[index], [field]: value };
      updateFormData('liabilities', 'creditCards', updated);
    };

    const addStudentLoan = () => {
      const studentLoans = getStudentLoans();
      updateFormData('liabilities', 'studentLoans', [...studentLoans, { balance: '', rate: '', servicer: '', type: '' }]);
    };

    const removeStudentLoan = (index) => {
      const studentLoans = getStudentLoans();
      updateFormData('liabilities', 'studentLoans', studentLoans.filter((_, i) => i !== index));
    };

    const updateStudentLoan = (index, field, value) => {
      const studentLoans = getStudentLoans();
      const updated = [...studentLoans];
      updated[index] = { ...updated[index], [field]: value };
      updateFormData('liabilities', 'studentLoans', updated);
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Liabilities</h3>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Primary Mortgage</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Mortgage Balance"
              className="border rounded px-3 py-2"
              value={formData.liabilities?.mortgageBalance || ''}
              onChange={(e) => updateFormData('liabilities', 'mortgageBalance', e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Mortgage Rate (%)"
              className="border rounded px-3 py-2"
              value={formData.liabilities?.mortgageRate || ''}
              onChange={(e) => updateFormData('liabilities', 'mortgageRate', e.target.value)}
            />
            <input
              type="number"
              placeholder="Years Remaining"
              className="border rounded px-3 py-2"
              value={formData.liabilities?.mortgageYears || ''}
              onChange={(e) => updateFormData('liabilities', 'mortgageYears', e.target.value)}
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Auto Loans</h4>
            <button
              onClick={addAutoLoan}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Auto Loan
            </button>
          </div>
          {getAutoLoans().map((loan, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 p-3 bg-gray-50 rounded">
              <input
                type="number"
                placeholder="Balance"
                className="border rounded px-2 py-1"
                value={loan.balance || ''}
                onChange={(e) => updateAutoLoan(index, 'balance', e.target.value)}
              />
              <input
                type="number"
                placeholder="Rate (%)"
                className="border rounded px-2 py-1"
                value={loan.rate || ''}
                onChange={(e) => updateAutoLoan(index, 'rate', e.target.value)}
              />
              <input
                type="text"
                placeholder="Term"
                className="border rounded px-2 py-1"
                value={loan.term || ''}
                onChange={(e) => updateAutoLoan(index, 'term', e.target.value)}
              />
              <input
                type="text"
                placeholder="Description"
                className="border rounded px-2 py-1"
                value={loan.description || ''}
                onChange={(e) => updateAutoLoan(index, 'description', e.target.value)}
              />
              <button
                onClick={() => removeAutoLoan(index)}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          {getAutoLoans().length === 0 && (
            <p className="text-gray-500 text-sm">No auto loans added.</p>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Credit Cards</h4>
            <button
              onClick={addCreditCard}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Credit Card
            </button>
          </div>
          {getCreditCards().map((card, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 p-3 bg-gray-50 rounded">
              <input
                type="text"
                placeholder="Card Name"
                className="border rounded px-2 py-1"
                value={card.name || ''}
                onChange={(e) => updateCreditCard(index, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Balance"
                className="border rounded px-2 py-1"
                value={card.balance || ''}
                onChange={(e) => updateCreditCard(index, 'balance', e.target.value)}
              />
              <input
                type="number"
                placeholder="Limit"
                className="border rounded px-2 py-1"
                value={card.limit || ''}
                onChange={(e) => updateCreditCard(index, 'limit', e.target.value)}
              />
              <input
                type="number"
                placeholder="APR (%)"
                className="border rounded px-2 py-1"
                value={card.rate || ''}
                onChange={(e) => updateCreditCard(index, 'rate', e.target.value)}
              />
              <button
                onClick={() => removeCreditCard(index)}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          {getCreditCards().length === 0 && (
            <p className="text-gray-500 text-sm">No credit cards added.</p>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Student Loans</h4>
            <button
              onClick={addStudentLoan}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Add Student Loan
            </button>
          </div>
          {getStudentLoans().map((loan, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 p-3 bg-gray-50 rounded">
              <input
                type="number"
                placeholder="Balance"
                className="border rounded px-2 py-1"
                value={loan.balance || ''}
                onChange={(e) => updateStudentLoan(index, 'balance', e.target.value)}
              />
              <input
                type="number"
                placeholder="Rate (%)"
                className="border rounded px-2 py-1"
                value={loan.rate || ''}
                onChange={(e) => updateStudentLoan(index, 'rate', e.target.value)}
              />
              <input
                type="text"
                placeholder="Servicer"
                className="border rounded px-2 py-1"
                value={loan.servicer || ''}
                onChange={(e) => updateStudentLoan(index, 'servicer', e.target.value)}
              />
              <select
                className="border rounded px-2 py-1"
                value={loan.type || ''}
                onChange={(e) => updateStudentLoan(index, 'type', e.target.value)}
              >
                <option value="">Loan Type</option>
                <option value="federal">Federal</option>
                <option value="private">Private</option>
                <option value="parent_plus">Parent PLUS</option>
                <option value="grad_plus">Grad PLUS</option>
              </select>
              <button
                onClick={() => removeStudentLoan(index)}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          {getStudentLoans().length === 0 && (
            <p className="text-gray-500 text-sm">No student loans added.</p>
          )}
        </div>
      </div>
    );
  };

  const renderGoals = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Financial Goals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Target Retirement Age"
          className="border rounded px-3 py-2"
          value={formData.goals?.retirementAge || ''}
          onChange={(e) => updateFormData('goals', 'retirementAge', e.target.value)}
        />
        <input
          type="number"
          placeholder="Desired Retirement Income"
          className="border rounded px-3 py-2"
          value={formData.goals?.retirementIncome || ''}
          onChange={(e) => updateFormData('goals', 'retirementIncome', e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={formData.goals?.retirementPriority || ''}
          onChange={(e) => updateFormData('goals', 'retirementPriority', e.target.value)}
        >
          <option value="">Retirement Priority (1-8)</option>
          {[1,2,3,4,5,6,7,8].map(num => <option key={num} value={num}>{num}</option>)}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={formData.goals?.emergencyPriority || ''}
          onChange={(e) => updateFormData('goals', 'emergencyPriority', e.target.value)}
        >
          <option value="">Emergency Fund Priority (1-8)</option>
          {[1,2,3,4,5,6,7,8].map(num => <option key={num} value={num}>{num}</option>)}
        </select>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Life Goals & Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="border rounded px-3 py-2"
          value={formData.preferences?.secondHome || ''}
          onChange={(e) => updateFormData('preferences', 'secondHome', e.target.value)}
        >
          <option value="">Second Home Interest</option>
          <option value="no_interest">No Interest</option>
          <option value="someday">Someday Maybe</option>
          <option value="considering">Actively Considering</option>
          <option value="planning_5yr">Planning Within 5 Years</option>
        </select>
        <input
          type="number"
          placeholder="Second Home Budget"
          className="border rounded px-3 py-2"
          value={formData.preferences?.secondHomeBudget || ''}
          onChange={(e) => updateFormData('preferences', 'secondHomeBudget', e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={formData.preferences?.businessInterest || ''}
          onChange={(e) => updateFormData('preferences', 'businessInterest', e.target.value)}
        >
          <option value="">Entrepreneurship Interest</option>
          <option value="no_interest">No Interest</option>
          <option value="someday">Someday Maybe</option>
          <option value="considering">Seriously Considering</option>
          <option value="planning_2yr">Planning Within 2 Years</option>
        </select>
        <input
          type="number"
          placeholder="Business Capital Needed"
          className="border rounded px-3 py-2"
          value={formData.preferences?.businessCapital || ''}
          onChange={(e) => updateFormData('preferences', 'businessCapital', e.target.value)}
        />
      </div>
    </div>
  );

  const renderRisk = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Risk Assessment</h3>
      <div className="grid grid-cols-1 gap-4">
        <select
          className="border rounded px-3 py-2"
          value={formData.risk?.experienceLevel || ''}
          onChange={(e) => updateFormData('risk', 'experienceLevel', e.target.value)}
        >
          <option value="">Investment Experience Level</option>
          <option value="beginner">Beginner</option>
          <option value="some_experience">Some Experience</option>
          <option value="experienced">Experienced</option>
          <option value="very_experienced">Very Experienced</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          value={formData.risk?.portfolioDrop || ''}
          onChange={(e) => updateFormData('risk', 'portfolioDrop', e.target.value)}
        >
          <option value="">If portfolio dropped 20%, you would:</option>
          <option value="sell_everything">Sell everything</option>
          <option value="sell_some">Sell some</option>
          <option value="hold_steady">Hold steady</option>
          <option value="buy_more">Buy more</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          value={formData.risk?.timeline || ''}
          onChange={(e) => updateFormData('risk', 'timeline', e.target.value)}
        >
          <option value="">Investment Timeline</option>
          <option value="less_than_5_years">Less than 5 years</option>
          <option value="5-10_years">5-10 years</option>
          <option value="10-20_years">10-20 years</option>
          <option value="20+_years">20+ years</option>
        </select>
      </div>
    </div>
  );

  const sectionComponents = [
    renderPersonalInfo,
    renderIncome,
    renderExpenses,
    renderAssets,
    renderLiabilities,
    renderGoals,
    renderPreferences,
    renderRisk
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Planning Questionnaire</h1>
        
        <div className="flex flex-wrap gap-2 mt-4 p-4 bg-gray-50 rounded">
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Download size={16} />
            Export Data
          </button>
          
          <label className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
            <Upload size={16} />
            Import Data
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
          
          <button
            onClick={clearData}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <RotateCcw size={16} />
            Clear All
          </button>
          
          <button
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            <Eye size={16} />
            {showJson ? 'Hide' : 'Show'} JSON
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {sections.map((section, index) => (
            <button
              key={section.key}
              onClick={() => setCurrentSection(index)}
              className={`px-3 py-2 rounded text-sm ${
                currentSection === index 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}. {section.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 p-6 border rounded-lg">
        {sectionComponents[currentSection]()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        <span className="text-gray-600">
          {currentSection + 1} of {sections.length}
        </span>
        
        <button
          onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
          disabled={currentSection === sections.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showJson && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Claude API JSON Output</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(generateClaudeJson(), null, 2)}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(generateClaudeJson(), null, 2));
              alert('JSON copied to clipboard!');
            }}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Copy JSON to Clipboard
          </button>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 text-center">
        ✓ Data automatically saved to browser storage
      </div>
    </div>
  );
};

export default FinancialPlanningPrototype;