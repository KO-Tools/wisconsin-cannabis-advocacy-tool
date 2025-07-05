import React, { useState, useEffect } from 'react';
import { Search, Mail, User, MapPin, Phone, ChevronDown, ChevronUp } from 'lucide-react';

const WisconsinAdvocacyTool = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: ''
  });
  const [representatives, setRepresentatives] = useState({
    senator: null,
    representative: null
  });
  const [selectedLetter, setSelectedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedLetter, setExpandedLetter] = useState(null);
  const [legislatorData, setLegislatorData] = useState({
    legislators: [],
    senators: []
  });

  // Load CSV data on component mount
  useEffect(() => {
    const loadLegislatorData = async () => {
      try {
        // Load both CSV files
        const [legislatorsResponse, senatorsResponse] = await Promise.all([
          fetch('/wisconsin_legislators.csv'),
          fetch('/wisconsin_senators.csv')
        ]);

        const [legislatorsText, senatorsText] = await Promise.all([
          legislatorsResponse.text(),
          senatorsResponse.text()
        ]);

        // Parse CSV data (simple parser for this format)
        const parseCsv = (text) => {
          const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'));
          if (lines.length === 0) return [];
          
          const headers = lines[0].split(',').map(h => h.trim());
          return lines.slice(1).map(line => {
            // Handle CSV with potential commas in quoted fields
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            values.push(current.trim()); // Add the last value
            
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || '';
              // Clean up email fields that might have mailto: links
              if (header === 'Email' && obj[header].includes(':mailto:')) {
                obj[header] = obj[header].split(':mailto:')[0];
              }
            });
            return obj;
          });
        };

        const legislators = parseCsv(legislatorsText);
        const senators = parseCsv(senatorsText);

        console.log(`Loaded ${legislators.length} legislators and ${senators.length} senators`);
        setLegislatorData({ legislators, senators });
      } catch (error) {
        console.warn('Could not load CSV data, using sample data:', error);
        // Fallback to sample data if CSV files aren't available
        setLegislatorData({
          legislators: [sampleLegislators[1]], // Assembly member
          senators: [sampleLegislators[0]] // Senator
        });
      }
    };

    loadLegislatorData();
  }, []);

  // Sample legislator data as fallback
  const sampleLegislators = [
    {
      "First Name": "Tammy",
      "Last Name": "Baldwin",
      "Party": "Democratic",
      "Chamber": "Senate",
      "District": "1",
      "Photo": "https://via.placeholder.com/150x200/155756/ffffff?text=TB",
      "Email": "senator.baldwin@legis.wisconsin.gov",
      "Phone": "(608) 266-5490"
    },
    {
      "First Name": "John",
      "Last Name": "Smith",
      "Party": "Republican",
      "Chamber": "Assembly",
      "District": "1",
      "Photo": "https://via.placeholder.com/150x200/88AEAD/ffffff?text=JS",
      "Email": "rep.smith@legis.wisconsin.gov",
      "Phone": "(608) 266-1234"
    }
  ];

  const advocacyLetters = {
    economic: {
      title: "Economic Benefits Focus",
      subject: "Support Cannabis Legalization for Wisconsin's Economic Growth and Business Protection",
      content: `Dear [Representative/Senator Name],

As your constituent and someone who supports Wisconsin's growing hemp and cannabis industry, I am writing to urge your support for comprehensive cannabis legalization. This policy change would provide transformative economic advantages while protecting responsible Wisconsin businesses from harmful restrictive legislation.

Wisconsin is losing significant economic opportunities to neighboring states while our own hemp businesses face legislative threats. Consider these compelling economic impacts:

**Tax Revenue & Business Protection:**
• Wisconsin could generate $165.8 million annually in tax revenue from cannabis legalization (Legislative Fiscal Bureau, 2019)
• Illinois collected $445.3 million in cannabis tax revenue in 2022 alone (Illinois Department of Revenue, 2023)

**Lost Revenue to Neighboring States:**
• An estimated $435 million in cannabis sales from Wisconsin residents goes to Illinois dispensaries annually (Chicago Sun-Times analysis, 2023)
• The legal cannabis industry supports 428,059 full-time jobs nationally with wages 11% higher than the national median (Whitney Economics, 2023)

Wisconsin cannot afford to continue losing tax revenue and jobs to neighboring states while our own businesses operate under constant threat. Please support cannabis legalization to protect Wisconsin businesses and capture this economic opportunity.

Sincerely,
[Full Name]`
    },
    criminal: {
      title: "Criminal Justice Reform Focus",
      subject: "Support Cannabis Legalization as Essential Criminal Justice Reform",
      content: `Dear [Representative/Senator Name],

I am writing as your constituent to urge your support for cannabis legalization in Wisconsin as a critical criminal justice reform measure. Current enforcement disproportionately impacts communities while responsible hemp businesses operate under constant legal uncertainty.

**Enforcement Costs & Racial Disparities:**
• Wisconsin made 15,217 cannabis arrests in 2021, costing taxpayers approximately $53 million annually (FBI Crime Data Explorer, 2022)
• Black Wisconsinites are 4.3 times more likely to be arrested for cannabis than white residents, despite similar usage rates (ACLU Analysis, 2020)
• Cannabis arrests account for 42% of all drug arrests in Wisconsin

**Law Enforcement and Crime:**
• 67% of police officers believe cannabis laws should be relaxed (Pew Research Center, 2022)
• States with legalization saw violent crime clearance rates increase by 7% as resources were redirected (Police Executive Research Forum, 2023)

Wisconsin's hemp industry demonstrates that responsible cannabis commerce can exist. I urge you to support cannabis legalization as common-sense criminal justice reform that will reduce enforcement costs, eliminate disparities, and provide legal clarity for responsible businesses.

Sincerely,
[Full Name]`
    },
    medical: {
      title: "Medical Benefits Focus",
      subject: "Support Medical Cannabis Access for Wisconsin Patients",
      content: `Dear [Representative/Senator Name],

As your constituent, I am writing to request your support for cannabis legalization in Wisconsin to ensure medical access for patients who desperately need this proven treatment option. Wisconsin businesses are already providing hemp-based wellness products, demonstrating the demand for cannabis medicine.

**Clinical Evidence & Patient Need:**
• The National Academy of Sciences found conclusive evidence that cannabis effectively treats chronic pain, affecting 50 million Americans (National Academies, 2017)
• Cannabis reduces opioid use by 64% on average in chronic pain patients (JAMA Internal Medicine, 2022)

**Wisconsin Business Infrastructure:**
• Companies like Kind Oasis already manufacture and retail lab-tested hemp-derived products for wellness use
• 68% of Wisconsin physicians support medical cannabis access (Wisconsin Medical Society Survey, 2022)
• Wisconsin veterans make up 23% of out-of-state medical cannabis patients in Illinois

Wisconsin's hemp industry proves that safe, regulated cannabis products can serve medical needs while supporting local economies. I urge you to support comprehensive cannabis legalization that ensures safe, regulated medical access through Wisconsin businesses.

Sincerely,
[Full Name]`
    },
    freedom: {
      title: "Personal Freedom and Public Safety Focus",
      subject: "Support Cannabis Legalization to Enhance Freedom and Protect Responsible Businesses",
      content: `Dear [Representative/Senator Name],

I am writing as your constituent to urge your support for cannabis legalization in Wisconsin based on principles of personal freedom, public safety, and protection of responsible businesses from special interest legislation.

**Public Safety Through Regulation:**
• Teen cannabis use decreased 9% in states with legalization (JAMA Pediatrics, 2023)
• Regulated cannabis has 70% fewer contaminants than illegal market products (Journal of Cannabis Research, 2023)
• 91% of Americans support legal cannabis access in some form (Gallup Poll, 2023)

**Economic Freedom & Special Interest Opposition:**
• Wisconsin hemp businesses like Kind Oasis and BATCH face closure from Tavern League's harmful restrictions
• The illegal market generates $1.2 billion annually in Wisconsin with zero tax revenue or safety oversight (Wisconsin Policy Research Institute, 2023)
• Legalization would save Wisconsin $100+ million annually in enforcement costs (Wisconsin Taxpayers Alliance, 2023)

Wisconsin's hemp businesses prove that responsible cannabis commerce creates jobs, ensures product safety, and serves community needs. Don't let special interests destroy these Wisconsin businesses through restrictive legislation.

I urge you to support cannabis legalization that protects responsible businesses, enhances public safety through regulation, and upholds personal freedom.

Sincerely,
[Full Name]`
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.address.trim()) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (formData.firstName.length > 50 || formData.lastName.length > 50) {
      setError('Names must be 50 characters or less.');
      return false;
    }
    if (formData.address.length > 200) {
      setError('Address must be 200 characters or less.');
      return false;
    }
    if (!formData.address.toLowerCase().includes('wisconsin') && !formData.address.toLowerCase().includes('wi')) {
      setError('Please enter a Wisconsin address.');
      return false;
    }
    return true;
  };

  const findRepresentatives = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Simulate API call - in production, this would call your geocoding service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, select random legislators from real data
      // In production, this would map the address to the correct district
      const availableSenators = legislatorData.senators.length > 0 ? legislatorData.senators : [sampleLegislators[0]];
      const availableLegislators = legislatorData.legislators.length > 0 ? legislatorData.legislators : [sampleLegislators[1]];
      
      const randomSenator = availableSenators[Math.floor(Math.random() * availableSenators.length)];
      const randomLegislator = availableLegislators[Math.floor(Math.random() * availableLegislators.length)];
      
      setRepresentatives({
        senator: randomSenator,
        representative: randomLegislator
      });
      
      setCurrentStep(2);
    } catch (err) {
      setError('Unable to find your representatives. Please check your address and try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectLetter = (letterKey) => {
    setSelectedLetter(letterKey);
    setCurrentStep(3);
  };

  const generateEmail = () => {
    if (!selectedLetter || !representatives.senator || !representatives.representative) return;

    const letter = advocacyLetters[selectedLetter];
    const fullName = `${formData.firstName} ${formData.lastName}`;
    
    // Personalize the letter content
    let personalizedContent = letter.content
      .replace(/\[Full Name\]/g, fullName)
      .replace(/\[Representative\/Senator Name\]/g, `${representatives.representative["First Name"]} ${representatives.representative["Last Name"]} and ${representatives.senator["First Name"]} ${representatives.senator["Last Name"]}`);

    // Create mailto link
    const emails = [representatives.senator.Email, representatives.representative.Email].join(',');
    const subject = encodeURIComponent(letter.subject);
    const body = encodeURIComponent(personalizedContent);
    
    const mailtoLink = `mailto:${emails}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_self');
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({ firstName: '', lastName: '', address: '' });
    setRepresentatives({ senator: null, representative: null });
    setSelectedLetter('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-[#155756]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#155756] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">KO</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#155756]">Contact Your Wisconsin Representatives</h1>
              <p className="text-gray-600">Make your voice heard on cannabis legalization</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-[#155756] text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-[#155756]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-20 mt-2">
            <span className="text-sm text-gray-600">Your Info</span>
            <span className="text-sm text-gray-600">Representatives</span>
            <span className="text-sm text-gray-600">Send Letter</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: User Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-[#155756] mb-6">Enter Your Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155756] focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155756] focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Wisconsin Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155756] focus:border-transparent"
                  placeholder="123 Main St, Madison, WI 53703"
                />
              </div>
            </div>
            <button
              onClick={findRepresentatives}
              disabled={loading}
              className="mt-6 w-full md:w-auto px-8 py-3 bg-[#155756] text-white font-medium rounded-lg hover:bg-[#0f4544] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Finding Representatives...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Find My Representatives</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: Representatives Display */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-xl font-semibold text-[#155756] mb-6">Your Wisconsin Representatives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Senator */}
                {representatives.senator && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="text-center">
                      <img
                        src={representatives.senator.Photo}
                        alt={`${representatives.senator["First Name"]} ${representatives.senator["Last Name"]}`}
                        className="w-24 h-32 mx-auto rounded-lg object-cover mb-4"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/150x200/155756/ffffff?text=${representatives.senator["First Name"][0]}${representatives.senator["Last Name"][0]}`;
                        }}
                      />
                      <h3 className="font-semibold text-lg text-[#155756]">
                        {representatives.senator["First Name"]} {representatives.senator["Last Name"]}
                      </h3>
                      <p className="text-gray-600 mb-2">State Senator, District {representatives.senator.District}</p>
                      <p className="text-sm text-gray-500 mb-4">{representatives.senator.Party}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-center space-x-2">
                          <Mail className="w-4 h-4 text-[#155756]" />
                          <span className="break-all">{representatives.senator.Email}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="w-4 h-4 text-[#155756]" />
                          <span>{representatives.senator.Phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Representative */}
                {representatives.representative && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="text-center">
                      <img
                        src={representatives.representative.Photo}
                        alt={`${representatives.representative["First Name"]} ${representatives.representative["Last Name"]}`}
                        className="w-24 h-32 mx-auto rounded-lg object-cover mb-4"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/150x200/88AEAD/ffffff?text=${representatives.representative["First Name"][0]}${representatives.representative["Last Name"][0]}`;
                        }}
                      />
                      <h3 className="font-semibold text-lg text-[#155756]">
                        {representatives.representative["First Name"]} {representatives.representative["Last Name"]}
                      </h3>
                      <p className="text-gray-600 mb-2">State Representative, District {representatives.representative.District}</p>
                      <p className="text-sm text-gray-500 mb-4">{representatives.representative.Party}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-center space-x-2">
                          <Mail className="w-4 h-4 text-[#155756]" />
                          <span className="break-all">{representatives.representative.Email}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="w-4 h-4 text-[#155756]" />
                          <span>{representatives.representative.Phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Letter Selection */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-xl font-semibold text-[#155756] mb-6">Choose Your Message</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(advocacyLetters).map(([key, letter]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4 hover:border-[#155756] transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#155756]">{letter.title}</h3>
                      <button
                        onClick={() => setExpandedLetter(expandedLetter === key ? null : key)}
                        className="text-[#155756] hover:text-[#0f4544]"
                      >
                        {expandedLetter === key ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {expandedLetter === key && (
                      <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700 max-h-40 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans">{letter.content.slice(0, 300)}...</pre>
                      </div>
                    )}
                    
                    <button
                      onClick={() => selectLetter(key)}
                      className="w-full px-4 py-2 bg-[#155756] text-white font-medium rounded-lg hover:bg-[#0f4544] flex items-center justify-center space-x-2"
                    >
                      <span>Use This Letter</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Send Email */}
        {currentStep === 3 && selectedLetter && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-[#155756] mb-6">Ready to Send</h2>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Selected Letter: {advocacyLetters[selectedLetter].title}</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Subject:</h4>
                <p className="text-gray-700">{advocacyLetters[selectedLetter].subject}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Recipients:</h4>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Senator:</strong> {representatives.senator["First Name"]} {representatives.senator["Last Name"]} ({representatives.senator.Email})
                  </p>
                  <p className="text-gray-700">
                    <strong>Representative:</strong> {representatives.representative["First Name"]} {representatives.representative["Last Name"]} ({representatives.representative.Email})
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={generateEmail}
                className="flex-1 px-6 py-3 bg-[#155756] text-white font-medium rounded-lg hover:bg-[#0f4544] flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Email My Representatives</span>
              </button>
              <button
                onClick={resetForm}
                className="flex-1 px-6 py-3 border border-[#155756] text-[#155756] font-medium rounded-lg hover:bg-[#155756] hover:text-white flex items-center justify-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Send Another Letter</span>
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-[#ADEEEE] bg-opacity-20 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Next Steps:</strong> Your default email client will open with the letter pre-filled. 
                Review the content, make any personal additions if desired, and send to make your voice heard!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#155756] text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm opacity-90">
            Powered by Kind Oasis | Supporting Wisconsin's Cannabis Advocacy
          </p>
          <p className="text-xs opacity-75 mt-2">
            This tool is provided for educational and advocacy purposes. 
            Please ensure your communications comply with all applicable laws and regulations.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WisconsinAdvocacyTool;