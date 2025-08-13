interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  citations?: string[];
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }>;
}

export class PerplexityService {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai';

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || '';
    if (!this.apiKey) {
      console.warn('PERPLEXITY_API_KEY not found in environment variables');
    }
  }

  async getSchemeRecommendations(userProfile: {
    name: string;
    occupation: string;
    age: number;
    salary: number;
    state: string;
  }): Promise<string> {
    if (!this.apiKey) {
      return `Based on your profile as a ${userProfile.age}-year-old ${userProfile.occupation} earning ₹${userProfile.salary.toLocaleString()} annually in ${userProfile.state}, I recommend focusing on schemes that match your demographics and income level. Look for employment opportunities, skill development programs, and housing schemes that are available for your income bracket.`;
    }

    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: `You are India's leading government scheme advisor with comprehensive knowledge of central and state government benefits. Provide highly personalized, actionable recommendations with specific scheme names, eligibility criteria, benefits amounts, and application processes. Focus on maximum financial benefit and practical applicability.

Guidelines:
- Prioritize schemes with highest financial impact for the user's profile
- Include both central and state-specific schemes 
- Provide specific scheme names, not just categories
- Mention exact benefit amounts, subsidies, and tax savings
- Include application deadlines and processes
- Consider income bracket, age, profession, and location
- Suggest lesser-known but valuable schemes
- Prioritize schemes the user is most likely to qualify for`
      },
      {
        role: 'user',
        content: `I am a ${userProfile.age}-year-old ${userProfile.occupation} in ${userProfile.state}, India, earning ₹${userProfile.salary.toLocaleString()} annually. 

Please provide:
1. TOP 5 government schemes I should apply for immediately (with specific names, benefits, and deadlines)
2. Income tax benefits and deductions I'm eligible for
3. State-specific schemes for ${userProfile.state} that match my profile
4. Professional development/skill schemes for ${userProfile.occupation}
5. Housing, insurance, or investment schemes for my income bracket

For each scheme, include:
- Exact scheme name
- Benefit amount/percentage
- Eligibility criteria
- Application process/website
- Deadline (if any)

Focus on schemes that will give me the maximum financial benefit based on my current situation.`
      }
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar',
          messages,
          max_tokens: 1000,
          temperature: 0.1,
          top_p: 0.9,
          stream: false,
          web_search_options: {
            search_context_size: 'high'
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Perplexity API error ${response.status}:`, errorText);
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data: PerplexityResponse = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content;
      }

      throw new Error('Invalid response from Perplexity API');
    } catch (error) {
      console.error('Error calling Perplexity API:', error);
      
      // Enhanced fallback for specific occupations
      if (userProfile.occupation.toLowerCase().includes('farmer')) {
        return `As a ${userProfile.age}-year-old farmer in ${userProfile.state} earning ₹${userProfile.salary.toLocaleString()}, you should focus on:

**TOP AGRICULTURAL SCHEMES:**
1. **PM-KISAN** - ₹6,000 annual direct benefit transfer for land-holding farmers
2. **Pradhan Mantri Fasal Bima Yojana** - Crop insurance with premium subsidy up to 90%
3. **Soil Health Card Scheme** - Free soil testing and nutrient management
4. **Kisan Credit Card** - Easy credit access at 4% interest rate with interest subvention
5. **PM Kisan Maan Dhan Yojana** - Pension scheme with ₹3,000 monthly pension after 60

**STATE-SPECIFIC (${userProfile.state}):**
- Check for state fertilizer subsidies and organic farming incentives
- Horticulture development schemes for fruit/vegetable cultivation
- Dairy development programs and livestock insurance

**IMMEDIATE ACTIONS:**
- Apply for PM-KISAN if not enrolled
- Get Soil Health Card for your land
- Consider crop insurance before sowing season
- Explore value addition and food processing schemes`;
      }
      
      return `Based on your profile as a ${userProfile.age}-year-old ${userProfile.occupation} earning ₹${userProfile.salary.toLocaleString()} annually in ${userProfile.state}, I recommend focusing on schemes that match your demographics and income level. Look for employment opportunities, skill development programs, and housing schemes that are available for your income bracket.`;
    }
  }
}

export const perplexityService = new PerplexityService();
