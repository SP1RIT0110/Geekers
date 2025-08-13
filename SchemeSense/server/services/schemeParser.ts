import { type Scheme } from "@shared/schema";
import { randomUUID } from "crypto";

export class SchemeParser {
  /**
   * Create user-specific schemes based on their profile and what AI commonly recommends
   */
  static createUserSpecificSchemes(userProfile: {
    occupation: string;
    age: number;
    salary: number;
    state: string;
  }, aiRecommendation: string): Scheme[] {
    const schemes: Scheme[] = [];
    
    // Student-specific schemes
    if (userProfile.occupation.toLowerCase().includes('student') || userProfile.age <= 25) {
      schemes.push({
        id: 'national-scholarship-portal',
        name: 'National Scholarship Portal (NSP)',
        description: 'Comprehensive scholarship platform offering multiple schemes for students across India.',
        category: 'Education',
        benefit: '₹10,000 to ₹2,00,000 annually',
        deadline: 'October 31 (Annual)',
        eligibility: ['Merit-based selection', 'Family income criteria', 'Regular student', 'Indian citizen'],
        maxIncome: 800000,
        minAge: 16,
        maxAge: 30,
        states: [userProfile.state, 'All States'],
        occupations: ['Student'],
        isActive: true,
      });
      
      schemes.push({
        id: 'pm-vidya-lakshmi',
        name: 'PM Vidya Lakshmi Education Loan',
        description: 'Centralized portal for education loans with subsidized interest rates.',
        category: 'Education',
        benefit: 'Education loans up to ₹40 lakhs',
        deadline: 'Year Round',
        eligibility: ['Admission to recognized institution', 'Merit-based', 'Income criteria applies'],
        maxIncome: 450000,
        minAge: 17,
        maxAge: 35,
        states: [userProfile.state, 'All States'],
        occupations: ['Student'],
        isActive: true,
      });
      
      schemes.push({
        id: 'pradhan-mantri-kaushal-vikas',
        name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
        description: 'Skill development program offering free training and certification.',
        category: 'Employment',
        benefit: 'Free training + ₹8,000 stipend',
        deadline: 'Ongoing',
        eligibility: ['Age 18-45', 'Unemployed/underemployed', 'Indian citizen'],
        maxIncome: 500000,
        minAge: 18,
        maxAge: 45,
        states: [userProfile.state, 'All States'],
        occupations: ['Student', 'Unemployed'],
        isActive: true,
      });
    }
    
    // Software Engineer / IT Professional schemes
    if (userProfile.occupation.toLowerCase().includes('software') || userProfile.occupation.toLowerCase().includes('engineer') || userProfile.occupation.toLowerCase().includes('it')) {
      schemes.push({
        id: 'startup-india-initiative',
        name: 'Startup India Initiative',
        description: 'Government program promoting tech entrepreneurship with tax benefits and funding support.',
        category: 'Business',
        benefit: '100% tax exemption for 3 years + Funding support',
        deadline: 'Year Round',
        eligibility: ['Tech/Innovation startup', 'Annual turnover < ₹100 crores', 'Incorporated within 10 years'],
        maxIncome: null,
        minAge: 21,
        maxAge: null,
        states: [userProfile.state, 'All States'],
        occupations: ['Software Engineer', 'IT Professional', 'Entrepreneur'],
        isActive: true,
      });
      
      if (userProfile.state === 'Karnataka') {
        schemes.push({
          id: 'karnataka-startup-policy',
          name: 'Karnataka Startup Policy 2022-27',
          description: 'State-specific benefits for tech startups including additional tax incentives.',
          category: 'Business',
          benefit: 'Additional state tax benefits + Infrastructure support',
          deadline: 'Year Round',
          eligibility: ['Startup registered in Karnataka', 'Tech/Innovation focus', 'Job creation commitment'],
          maxIncome: null,
          minAge: 21,
          maxAge: null,
          states: ['Karnataka'],
          occupations: ['Software Engineer', 'IT Professional', 'Entrepreneur'],
          isActive: true,
        });
      }
      
      schemes.push({
        id: 'digital-india-employment',
        name: 'Digital India Land Records Modernization',
        description: 'Employment opportunities for IT professionals in government digitization projects.',
        category: 'Employment',
        benefit: '₹75,000 project-based employment',
        deadline: 'April 15, 2025',
        eligibility: ['Bachelor\'s in CS/IT', '2+ years experience', 'Age 21-35', 'Indian citizen'],
        maxIncome: 2000000,
        minAge: 21,
        maxAge: 35,
        states: [userProfile.state, 'All States'],
        occupations: ['Software Engineer', 'IT Professional'],
        isActive: true,
      });
    }
    
    // Farmer schemes
    if (userProfile.occupation.toLowerCase().includes('farmer') || userProfile.occupation.toLowerCase().includes('agriculture')) {
      schemes.push({
        id: 'pm-kisan-samman-nidhi',
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        description: 'Direct income support providing ₹6,000 per year to landholding farmers.',
        category: 'Agriculture',
        benefit: '₹6,000 per year (3 installments)',
        deadline: 'Year Round',
        eligibility: ['Landholding farmers', 'Valid land documents', 'Aadhaar mandatory', 'Bank account'],
        maxIncome: null,
        minAge: 18,
        maxAge: null,
        states: [userProfile.state, 'All States'],
        occupations: ['Farmer', 'Agriculture Worker'],
        isActive: true,
      });
      
      schemes.push({
        id: 'crop-insurance-pmfby',
        name: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Comprehensive crop insurance covering all crops against natural calamities.',
        category: 'Agriculture',
        benefit: '90% premium subsidy',
        deadline: 'Before each sowing season',
        eligibility: ['All farmers (landowner/tenant)', 'Crop loan or self-financing', 'Valid documents'],
        maxIncome: null,
        minAge: 18,
        maxAge: null,
        states: [userProfile.state, 'All States'],
        occupations: ['Farmer', 'Agriculture Worker'],
        isActive: true,
      });
      
      schemes.push({
        id: 'kisan-credit-card-scheme',
        name: 'Kisan Credit Card (KCC)',
        description: 'Easy credit access for farmers at subsidized 4% interest rate.',
        category: 'Agriculture',
        benefit: 'Credit at 4% interest with government subsidy',
        deadline: 'Year Round',
        eligibility: ['Landowner farmers', 'Tenant farmers', 'Crop cultivation/allied activities'],
        maxIncome: null,
        minAge: 18,
        maxAge: null,
        states: [userProfile.state, 'All States'],
        occupations: ['Farmer', 'Agriculture Worker'],
        isActive: true,
      });
    }
    
    // Universal schemes for all income groups
    if (userProfile.salary <= 1800000) {
      schemes.push({
        id: 'pmay-urban-subsidy',
        name: 'Pradhan Mantri Awas Yojana (Urban)',
        description: 'Housing subsidy scheme for first-time home buyers in urban areas.',
        category: 'Housing',
        benefit: 'Interest subsidy up to ₹2,67,280',
        deadline: 'March 31, 2025',
        eligibility: ['Family income ₹6-18 lakh', 'First-time buyer', 'Age 18-70', 'Urban property'],
        maxIncome: 1800000,
        minAge: 18,
        maxAge: 70,
        states: [userProfile.state, 'All States'],
        occupations: ['All Occupations'],
        isActive: true,
      });
    }
    
    // Healthcare for lower income groups
    if (userProfile.salary <= 180000) {
      schemes.push({
        id: 'ayushman-bharat-pmjay',
        name: 'Ayushman Bharat - PM Jan Arogya Yojana',
        description: 'World\'s largest health insurance providing ₹5 lakh coverage per family.',
        category: 'Healthcare',
        benefit: '₹5 lakh health insurance per family per year',
        deadline: 'Year Round',
        eligibility: ['SECC 2011 beneficiaries', 'Rural and urban poor families', 'Priority households'],
        maxIncome: 180000,
        minAge: null,
        maxAge: null,
        states: [userProfile.state, 'All States'],
        occupations: ['All Occupations'],
        isActive: true,
      });
    }
    
    // Business/Entrepreneur schemes
    if (userProfile.occupation.toLowerCase().includes('entrepreneur') || userProfile.occupation.toLowerCase().includes('business') || userProfile.salary >= 500000) {
      schemes.push({
        id: 'mudra-loan-scheme',
        name: 'Pradhan Mantri MUDRA Yojana',
        description: 'Collateral-free micro-financing for small business and startups.',
        category: 'Business',
        benefit: 'Loans from ₹50,000 to ₹10 lakhs without collateral',
        deadline: 'Year Round',
        eligibility: ['Small business/startup', 'Non-agricultural activities', 'Indian citizen', 'Business plan'],
        maxIncome: 1000000,
        minAge: 18,
        maxAge: null,
        states: [userProfile.state, 'All States'],
        occupations: ['Entrepreneur', 'Small Business Owner', 'Self Employed'],
        isActive: true,
      });
      
      schemes.push({
        id: 'stand-up-india-scheme',
        name: 'Stand Up India Scheme',
        description: 'Bank loans for SC/ST and women entrepreneurs to promote entrepreneurship.',
        category: 'Business',
        benefit: 'Loans between ₹10 lakh to ₹1 crore',
        deadline: 'Year Round',
        eligibility: ['SC/ST or Women entrepreneur', 'Age 18+', 'New enterprise in manufacturing/services/trading'],
        maxIncome: null,
        minAge: 18,
        maxAge: null,
        states: [userProfile.state, 'All States'],
        occupations: ['Entrepreneur', 'Self Employed'],
        isActive: true,
      });
    }
    
    console.log(`Created ${schemes.length} user-specific schemes for ${userProfile.occupation} in ${userProfile.state}`);
    return schemes;
  }

  /**
   * Parse AI recommendation text and extract scheme information to create dynamic schemes
   */
  static parseSchemeRecommendations(aiRecommendation: string, userProfile: {
    occupation: string;
    age: number;
    salary: number;
    state: string;
  }): Scheme[] {
    console.log('=== PARSING AI RECOMMENDATION ===');
    console.log('First 500 chars:', aiRecommendation.substring(0, 500));
    console.log('=== END DEBUG ===');
    
    const schemes: Scheme[] = [];
    
    // Split the recommendation into sections and lines
    const lines = aiRecommendation.split('\n');
    let currentScheme: Partial<Scheme> | null = null;
    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Detect section headers
      if (line.includes('**') && line.includes(':')) {
        currentSection = line.replace(/\*\*/g, '').replace(':', '').trim();
        console.log('Found section:', currentSection);
        continue;
      }
      
      // Look for numbered scheme items (1., 2., 3., etc.)  
      const numberedMatch = line.match(/^(\d+)\.\s*\*\*(.*?)\*\*\s*-?\s*(.*)/);
      if (numberedMatch) {
        console.log('Found numbered scheme:', numberedMatch[2]);
        
        // Save previous scheme if exists
        if (currentScheme && currentScheme.name) {
          schemes.push(this.finalizeScheme(currentScheme, userProfile));
        }
        
        // Start new scheme
        const [, , schemeName, description] = numberedMatch;
        currentScheme = {
          id: this.generateSchemeId(schemeName),
          name: schemeName.trim(),
          description: description.trim(),
          category: this.categorizeScheme(schemeName, currentSection),
          deadline: "Year Round",
          eligibility: [],
          isActive: true,
        };
        
        continue;
      }
      
      // Also look for schemes mentioned with **name** pattern without numbers
      const boldSchemeMatch = line.match(/\*\*(.*?)\*\*\s*-\s*(.*)/);
      if (boldSchemeMatch && !line.match(/^\d+\./)) {
        console.log('Found bold scheme:', boldSchemeMatch[1]);
        
        // Save previous scheme if exists
        if (currentScheme && currentScheme.name) {
          schemes.push(this.finalizeScheme(currentScheme, userProfile));
        }
        
        // Start new scheme
        const [, schemeName, description] = boldSchemeMatch;
        currentScheme = {
          id: this.generateSchemeId(schemeName),
          name: schemeName.trim(),
          description: description.trim(),
          category: this.categorizeScheme(schemeName, currentSection),
          deadline: "Year Round",
          eligibility: [],
          isActive: true,
        };
        
        continue;
      }
      
      // Look for benefit information (₹, Rs, benefit, amount, etc.)
      if (currentScheme && (line.includes('₹') || line.includes('Rs') || line.toLowerCase().includes('benefit'))) {
        const benefitMatch = line.match(/(₹[\d,]+|Rs[\d,]+|\d+%|up to ₹[\d,]+)/);
        if (benefitMatch) {
          currentScheme.benefit = benefitMatch[0];
        }
      }
      
      // Look for eligibility criteria
      if (currentScheme && (line.startsWith('-') || line.toLowerCase().includes('eligibility') || line.toLowerCase().includes('criteria'))) {
        if (!currentScheme.eligibility) currentScheme.eligibility = [];
        const cleanLine = line.replace(/^-\s*/, '').trim();
        if (cleanLine && !cleanLine.toLowerCase().includes('eligibility')) {
          (currentScheme.eligibility as string[]).push(cleanLine);
        }
      }
      
      // Look for deadline information
      if (currentScheme && (line.toLowerCase().includes('deadline') || line.toLowerCase().includes('before') || line.toLowerCase().includes('march') || line.toLowerCase().includes('december'))) {
        const deadlineMatch = line.match(/(march|april|may|june|july|august|september|october|november|december)\s+\d+|before\s+\w+|year\s+round|ongoing/gi);
        if (deadlineMatch) {
          currentScheme.deadline = deadlineMatch[0];
        }
      }
    }
    
    // Don't forget the last scheme
    if (currentScheme && currentScheme.name) {
      schemes.push(this.finalizeScheme(currentScheme, userProfile));
    }
    
    console.log(`Parsed ${schemes.length} schemes from AI recommendation`);
    
    // If no schemes were parsed from the text, create some based on user profile
    if (schemes.length === 0) {
      console.log('No schemes found in AI text, creating fallback schemes');
      schemes.push(...this.createFallbackSchemes(userProfile));
    }
    
    return schemes;
  }
  
  private static generateSchemeId(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30) + '-' + randomUUID().substring(0, 8);
  }
  
  private static categorizeScheme(schemeName: string, section: string): string {
    const name = schemeName.toLowerCase();
    const sectionLower = section.toLowerCase();
    
    if (name.includes('housing') || name.includes('awas') || name.includes('home') || sectionLower.includes('housing')) {
      return 'Housing';
    }
    if (name.includes('kisan') || name.includes('farm') || name.includes('crop') || name.includes('agriculture') || sectionLower.includes('agriculture')) {
      return 'Agriculture';
    }
    if (name.includes('startup') || name.includes('business') || name.includes('mudra') || name.includes('entrepreneur') || sectionLower.includes('business')) {
      return 'Business';
    }
    if (name.includes('skill') || name.includes('training') || name.includes('employment') || name.includes('job') || sectionLower.includes('employment')) {
      return 'Employment';
    }
    if (name.includes('scholarship') || name.includes('education') || name.includes('student') || sectionLower.includes('education')) {
      return 'Education';
    }
    if (name.includes('health') || name.includes('medical') || name.includes('ayushman') || sectionLower.includes('healthcare')) {
      return 'Healthcare';
    }
    if (name.includes('tech') || name.includes('digital') || name.includes('it') || sectionLower.includes('technology')) {
      return 'Technology';
    }
    
    return 'Government Scheme';
  }
  
  private static finalizeScheme(partialScheme: Partial<Scheme>, userProfile: {
    occupation: string;
    age: number;
    salary: number;
    state: string;
  }): Scheme {
    return {
      id: partialScheme.id!,
      name: partialScheme.name!,
      description: partialScheme.description || `Government scheme for ${userProfile.occupation.toLowerCase()}s in ${userProfile.state}`,
      category: partialScheme.category!,
      benefit: partialScheme.benefit || "Government benefit",
      deadline: partialScheme.deadline!,
      eligibility: (partialScheme.eligibility && (partialScheme.eligibility as string[]).length > 0) ? (partialScheme.eligibility as string[]) : [`Age ${userProfile.age} eligible`, `Income criteria applicable`],
      maxIncome: this.inferMaxIncome(partialScheme.name!, userProfile.salary),
      minAge: this.inferMinAge(partialScheme.name!),
      maxAge: this.inferMaxAge(partialScheme.name!),
      states: [userProfile.state, "All States"],
      occupations: [userProfile.occupation, "All Occupations"],
      isActive: true,
    };
  }
  
  private static inferMaxIncome(schemeName: string, userSalary: number): number | null {
    const name = schemeName.toLowerCase();
    
    // Housing schemes typically have income limits
    if (name.includes('awas') || name.includes('housing')) {
      return 1800000; // PMAY income limit
    }
    
    // Student/education schemes
    if (name.includes('scholarship') || name.includes('education')) {
      return 800000;
    }
    
    // Healthcare for poor
    if (name.includes('ayushman') || name.includes('health insurance')) {
      return 180000;
    }
    
    // Business loans
    if (name.includes('mudra') || name.includes('business')) {
      return 1000000;
    }
    
    // For high-income users, assume schemes are income-agnostic
    if (userSalary > 1000000) {
      return null;
    }
    
    return userSalary * 2; // Default: up to 2x user salary
  }
  
  private static inferMinAge(schemeName: string): number | null {
    const name = schemeName.toLowerCase();
    
    if (name.includes('student') || name.includes('scholarship')) {
      return 16;
    }
    
    if (name.includes('pension') || name.includes('senior')) {
      return 60;
    }
    
    return 18; // Default adult age
  }
  
  private static inferMaxAge(schemeName: string): number | null {
    const name = schemeName.toLowerCase();
    
    if (name.includes('youth') || name.includes('skill')) {
      return 45;
    }
    
    if (name.includes('student') || name.includes('scholarship')) {
      return 30;
    }
    
    return null; // No upper age limit
  }
  
  private static createFallbackSchemes(userProfile: {
    occupation: string;
    age: number;
    salary: number;
    state: string;
  }): Scheme[] {
    const fallbackSchemes: Scheme[] = [];
    
    // Always include housing for middle income
    if (userProfile.salary <= 1800000) {
      fallbackSchemes.push({
        id: 'pmay-fallback',
        name: 'Pradhan Mantri Awas Yojana',
        description: 'Housing subsidy scheme for first-time home buyers',
        category: 'Housing',
        benefit: '₹2,67,000 subsidy',
        deadline: 'Mar 31, 2025',
        eligibility: ['First-time home buyer', 'Income up to ₹18 lakh'],
        maxIncome: 1800000,
        minAge: 18,
        maxAge: null,
        states: [userProfile.state, 'All States'],
        occupations: [userProfile.occupation, 'All Occupations'],
        isActive: true,
      });
    }
    
    // Tech-specific schemes for IT professionals
    if (userProfile.occupation.toLowerCase().includes('software') || userProfile.occupation.toLowerCase().includes('engineer')) {
      fallbackSchemes.push({
        id: 'startup-india-fallback',
        name: 'Startup India Initiative',
        description: 'Government program to promote tech entrepreneurship',
        category: 'Business',
        benefit: 'Tax exemptions + Funding support',
        deadline: 'Year Round',
        eligibility: ['Tech startup', 'Innovation focused'],
        maxIncome: null,
        minAge: 21,
        maxAge: null,
        states: [userProfile.state, 'All States'],
        occupations: [userProfile.occupation, 'Entrepreneur'],
        isActive: true,
      });
    }
    
    return fallbackSchemes;
  }
}