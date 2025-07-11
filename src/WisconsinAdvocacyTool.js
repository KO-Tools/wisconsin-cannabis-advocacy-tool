import React, { useState, useEffect } from 'react';
import { Search, Mail, User, MapPin, Phone, ChevronDown, ChevronUp, AlertCircle, Leaf } from 'lucide-react';
import Papa from 'papaparse';

// Constants
const CONFIG = {
  LOAD_TIMEOUT: 5000,
  MAX_NAME_LENGTH: 50,
  MAX_ADDRESS_LENGTH: 200,
  CSV_PARSE_OPTIONS: {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  }
};

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
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedLetter, setExpandedLetter] = useState(null);
  const [legislatorData, setLegislatorData] = useState({
    legislators: [],
    senators: [],
    districts: []
  });

  // Add error logging function
  const logError = (error, context) => {
    console.error(`Production Error in ${context}:`, error);
  };

  // Load CSV data on component mount
  useEffect(() => {
    const loadLegislatorData = async () => {
      setDataLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.LOAD_TIMEOUT);

        // Load all three CSV files
        const [legislatorsResponse, senatorsResponse, districtsResponse] = await Promise.all([
          fetch('/wisconsin_assembly.csv', { signal: controller.signal }),
          fetch('/wisconsin_senators.csv', { signal: controller.signal }),
          fetch('/wisconsin_districts.csv', { signal: controller.signal })
        ]);

        clearTimeout(timeoutId);

        if (!legislatorsResponse.ok || !senatorsResponse.ok || !districtsResponse.ok) {
          throw new Error('Failed to load legislator data');
        }

        const [legislatorsText, senatorsText, districtsText] = await Promise.all([
          legislatorsResponse.text(),
          senatorsResponse.text(),
          districtsResponse.text()
        ]);

        // Use Papa Parse for robust CSV parsing
        const legislatorsResult = Papa.parse(legislatorsText, CONFIG.CSV_PARSE_OPTIONS);
        const senatorsResult = Papa.parse(senatorsText, CONFIG.CSV_PARSE_OPTIONS);
        const districtsResult = Papa.parse(districtsText, CONFIG.CSV_PARSE_OPTIONS);

        if (legislatorsResult.errors.length > 0 || senatorsResult.errors.length > 0 || districtsResult.errors.length > 0) {
          logError({
            legislators: legislatorsResult.errors,
            senators: senatorsResult.errors,
            districts: districtsResult.errors
          }, 'CSV parsing');
        }

        // Validate and clean data
        const legislators = validateLegislatorData(legislatorsResult.data);
        const senators = validateLegislatorData(senatorsResult.data);
        const districts = validateDistrictData(districtsResult.data);

        console.log(`Loaded ${legislators.length} legislators, ${senators.length} senators, and ${districts.length} district mappings`);
        
        setLegislatorData({ legislators, senators, districts });
        setDataLoading(false);
      } catch (error) {
        const errorMessage = error.name === 'AbortError' 
          ? 'Loading legislator data took too long. Please refresh and try again.'
          : 'Unable to load legislator data. Please check your connection and refresh.';
        
        setError(errorMessage);
        setDataLoading(false);
        logError(error, 'loadLegislatorData');
      }
    };

    loadLegislatorData();
  }, []);

  // Data validation functions
  const validateLegislatorData = (data) => {
    return data
      .filter(row => row['First Name'] && row['Last Name'] && row['Email'])
      .map(row => ({
        ...row,
        Email: validateEmail(row.Email) ? row.Email : '',
        Phone: formatPhoneNumber(row.Phone || ''),
        Photo: row.Photo || generatePlaceholderPhoto(row),
        Party: row.Party === 'R' ? 'Republican' : row.Party === 'D' ? 'Democrat' : row.Party
      }));
  };

  const validateDistrictData = (data) => {
    return data
      .filter(row => row.Zip_Code && row.Senate_District && row.Assembly_District)
      .map(row => ({
        ...row,
        Zip_Code: String(row.Zip_Code).padStart(5, '0') // Ensure 5-digit zip codes
      }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (phone) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone; // Return original if can't format
  };

  const generatePlaceholderPhoto = (legislator) => {
    const initials = `${legislator['First Name'][0]}${legislator['Last Name'][0]}`;
    const color = legislator.Party === 'R' || legislator.Party === 'Republican' ? '4A90E2' : '7ED321';
    return `https://via.placeholder.com/150x200/${color}/ffffff?text=${initials}`;
  };

  // Extract zip code from address
  const extractZipCode = (address) => {
    const zipRegex = /\b(\d{5})(?:-\d{4})?\b/;
    const match = address.match(zipRegex);
    return match ? match[1] : null;
  };

  const advocacyLetters = {
    economic: {
      title: "Economic Benefits Focus",
      subject: "Support Cannabis Legalization for Wisconsin's Economic Growth and Business Protection",
      gradient: "from-emerald-500 to-teal-600",
      icon: "💰",
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
      gradient: "from-blue-500 to-indigo-600",
      icon: "⚖️",
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
      gradient: "from-green-500 to-emerald-600",
      icon: "🏥",
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
      gradient: "from-purple-500 to-pink-600",
      icon: "🗽",
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

  // Updated validateForm function with enhanced ZIP code validation
  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.address.trim()) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (formData.firstName.length > CONFIG.MAX_NAME_LENGTH || formData.lastName.length > CONFIG.MAX_NAME_LENGTH) {
      setError(`Names must be ${CONFIG.MAX_NAME_LENGTH} characters or less.`);
      return false;
    }
    if (formData.address.length > CONFIG.MAX_ADDRESS_LENGTH) {
      setError(`Address must be ${CONFIG.MAX_ADDRESS_LENGTH} characters or less.`);
      return false;
    }
    if (!formData.address.toLowerCase().includes('wisconsin') && !formData.address.toLowerCase().includes('wi')) {
      setError('Please enter a Wisconsin address.');
      return false;
    }
    
    // Enhanced ZIP code validation
    const zipCode = extractZipCode(formData.address);
    if (!zipCode) {
      setError('Please include a valid 5-digit ZIP code in your Wisconsin address (e.g., 53703).');
      return false;
    }
    
    return true;
  };

  const findRepresentatives = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Extract zip code from address
      const zipCode = extractZipCode(formData.address);
      
      if (!zipCode) {
        setError('Please include a valid 5-digit ZIP code in your address.');
        setLoading(false);
        return;
      }

      // Find district mapping for this zip code
      const districtMapping = legislatorData.districts.find(
        d => d.Zip_Code === zipCode
      );

      if (!districtMapping) {
        setError(`Unable to find legislative districts for ZIP code ${zipCode}. Please verify your address and try again.`);
        setLoading(false);
        return;
      }

      // Find the senator and representative based on the district mapping
      const senator = legislatorData.senators.find(s => 
        s['First Name'] === districtMapping.Senator_First_Name && 
        s['Last Name'] === districtMapping.Senator_Last_Name
      );

      const representative = legislatorData.legislators.find(l => 
        l['First Name'] === districtMapping.Representative_First_Name && 
        l['Last Name'] === districtMapping.Representative_Last_Name
      );

      if (!senator || !representative) {
        setError('Unable to match your representatives. Please try again or contact support.');
        setLoading(false);
        return;
      }

      setRepresentatives({
        senator: senator,
        representative: representative
      });
      
      setCurrentStep(2);
    } catch (err) {
      setError('Unable to find your representatives. Please check your address and try again.');
      logError(err, 'findRepresentatives');
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
    const emails = [representatives.senator.Email, representatives.representative.Email]
      .filter(email => email && validateEmail(email))
      .join(',');
    
    if (!emails) {
      setError('Unable to generate email - representative contact information is missing.');
      return;
    }

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

  // Show loading screen while data is being loaded
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg font-medium">Loading Wisconsin legislator data...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing your advocacy tool</p>
        </div>
      </div>
    );
  }

  // Show error screen if data failed to load
  if (!dataLoading && legislatorData.districts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Data</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the Wisconsin legislator data. Please refresh the page to try again.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-2xl hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                Contact Your Wisconsin Representatives
              </h1>
              <p className="text-gray-600 text-lg mt-1">Make your voice heard on cannabis legalization</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="mb-12" role="navigation" aria-label="Progress">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-110' 
                      : 'bg-white text-gray-400 shadow-md'
                  }`}
                  aria-current={currentStep === step ? 'step' : undefined}
                  aria-label={`Step ${step}`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-24 h-2 mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gray-200'
                  }`} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-32 mt-4">
            <span className="text-sm font-medium text-gray-600">Your Info</span>
            <span className="text-sm font-medium text-gray-600">Representatives</span>
            <span className="text-sm font-medium text-gray-600">Send Letter</span>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-sm" role="alert">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: User Information */}
        {currentStep === 1 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Your Information</h2>
              <p className="text-gray-600">We'll find your Wisconsin representatives based on your address</p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-3">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    maxLength={CONFIG.MAX_NAME_LENGTH}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-200"
                    placeholder="Enter your first name"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-3">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    maxLength={CONFIG.MAX_NAME_LENGTH}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-200"
                    placeholder="Enter your last name"
                    aria-required="true"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Wisconsin Address (including ZIP code) *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  maxLength={CONFIG.MAX_ADDRESS_LENGTH}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 transition-all duration-200"
                  placeholder="123 Main St, Madison, WI 53703"
                  aria-required="true"
                  aria-describedby="address-help"
                />
                <p id="address-help" className="mt-2 text-sm text-gray-500">
                  Please include your 5-digit ZIP code so we can find your exact representatives
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={findRepresentatives}
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 mx-auto transform hover:scale-105 transition-all duration-200 shadow-lg"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" aria-hidden="true"></div>
                    <span>Finding Representatives...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" aria-hidden="true" />
                    <span>Find My Representatives</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Representatives Display */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/50">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wisconsin Representatives</h2>
                <p className="text-gray-600">These are your elected officials who will receive your advocacy letter</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Senator */}
                {representatives.senator && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <img
                          src={representatives.senator.Photo}
                          alt={`${representatives.senator["First Name"]} ${representatives.senator["Last Name"]}`}
                          className="w-24 h-32 mx-auto rounded-2xl object-cover shadow-lg"
                          onError={(e) => {
                            e.target.src = generatePlaceholderPhoto(representatives.senator);
                          }}
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          SENATOR
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-1">
                        {representatives.senator["First Name"]} {representatives.senator["Last Name"]}
                      </h3>
                      <p className="text-gray-600 mb-1 font-medium">State Senator, District {representatives.senator.District}</p>
                      <p className="text-sm text-gray-500 mb-6">{representatives.senator.Party}</p>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-center space-x-3 bg-white/70 rounded-xl p-3">
                          <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" aria-hidden="true" />
                          <span className="break-all text-gray-700 font-medium">{representatives.senator.Email}</span>
                        </div>
                        {representatives.senator.Phone && (
                          <div className="flex items-center justify-center space-x-3 bg-white/70 rounded-xl p-3">
                            <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" aria-hidden="true" />
                            <span className="text-gray-700 font-medium">{representatives.senator.Phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Representative */}
                {representatives.representative && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <img
                          src={representatives.representative.Photo}
                          alt={`${representatives.representative["First Name"]} ${representatives.representative["Last Name"]}`}
                          className="w-24 h-32 mx-auto rounded-2xl object-cover shadow-lg"
                          onError={(e) => {
                            e.target.src = generatePlaceholderPhoto(representatives.representative);
                          }}
                        />
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          ASSEMBLY
                        </div>
                      </div>
                      <h3 className="font-bold text-xl text-gray-800 mb-1">
                        {representatives.representative["First Name"]} {representatives.representative["Last Name"]}
                      </h3>
                      <p className="text-gray-600 mb-1 font-medium">State Representative, District {representatives.representative.District}</p>
                      <p className="text-sm text-gray-500 mb-6">{representatives.representative.Party}</p>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-center space-x-3 bg-white/70 rounded-xl p-3">
                          <Mail className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
                          <span className="break-all text-gray-700 font-medium">{representatives.representative.Email}</span>
                        </div>
                        {representatives.representative.Phone && (
                          <div className="flex items-center justify-center space-x-3 bg-white/70 rounded-xl p-3">
                            <Phone className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
                            <span className="text-gray-700 font-medium">{representatives.representative.Phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Disclaimer */}
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <p className="text-sm text-amber-800 text-center">
                  <strong>Note:</strong> This tool uses ZIP code-based lookup. In rare cases, please verify your representatives at{' '}
                  <a href="https://legis.wisconsin.gov/Pages/leg-list.aspx" className="underline font-semibold hover:text-amber-900" target="_blank" rel="noopener noreferrer">
                    legis.wisconsin.gov
                  </a>
                </p>
              </div>
            </div>

            {/* Letter Selection */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/50">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Message</h2>
                <p className="text-gray-600">Select the advocacy letter that best represents your position</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {Object.entries(advocacyLetters).map(([key, letter]) => (
                  <div key={key} className={`bg-gradient-to-br ${letter.gradient} rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{letter.icon}</span>
                          <h3 className="font-bold text-lg text-gray-800">{letter.title}</h3>
                        </div>
                        <button
                          onClick={() => setExpandedLetter(expandedLetter === key ? null : key)}
                          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                          aria-expanded={expandedLetter === key}
                          aria-controls={`letter-preview-${key}`}
                          aria-label={`${expandedLetter === key ? 'Hide' : 'Show'} preview of ${letter.title}`}
                        >
                          {expandedLetter === key ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {expandedLetter === key && (
                        <div 
                          id={`letter-preview-${key}`}
                          className="mb-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-700 max-h-48 overflow-y-auto border"
                        >
                          <pre className="whitespace-pre-wrap font-sans leading-relaxed">{letter.content.slice(0, 400)}...</pre>
                        </div>
                      )}
                      
                      <button
                        onClick={() => selectLetter(key)}
                        className={`w-full px-6 py-3 bg-gradient-to-r ${letter.gradient} text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                      >
                        Use This Letter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Send Email */}
        {currentStep === 3 && selectedLetter && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Send</h2>
              <p className="text-gray-600">Your advocacy letter is ready to be sent to your representatives</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h3 className="font-bold text-xl mb-6 text-center">
                  Selected Letter: 
                  <span className={`ml-2 bg-gradient-to-r ${advocacyLetters[selectedLetter].gradient} bg-clip-text text-transparent`}>
                    {advocacyLetters[selectedLetter].title}
                  </span>
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-6 border">
                    <h4 className="font-semibold mb-3 text-gray-800">Subject:</h4>
                    <p className="text-gray-700 leading-relaxed">{advocacyLetters[selectedLetter].subject}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 border">
                    <h4 className="font-semibold mb-3 text-gray-800">Recipients:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 bg-white rounded-xl p-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-gray-700">
                          <strong>Senator:</strong> {representatives.senator["First Name"]} {representatives.senator["Last Name"]} ({representatives.senator.Email})
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 bg-white rounded-xl p-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-gray-700">
                          <strong>Representative:</strong> {representatives.representative["First Name"]} {representatives.representative["Last Name"]} ({representatives.representative.Email})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={generateEmail}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-teal-700 flex items-center justify-center space-x-3 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Mail className="w-5 h-5" aria-hidden="true" />
                  <span>Email My Representatives</span>
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-8 py-4 border-2 border-emerald-500 text-emerald-600 font-bold rounded-2xl hover:bg-emerald-50 flex items-center justify-center space-x-3 transition-all duration-200"
                >
                  <User className="w-5 h-5" aria-hidden="true" />
                  <span>Send Another Letter</span>
                </button>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                <p className="text-sm text-gray-700 text-center leading-relaxed">
                  <strong>Next Steps:</strong> Your default email client will open with the letter pre-filled. 
                  Review the content, make any personal additions if desired, and send to make your voice heard!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Leaf className="w-6 h-6" />
            <p className="text-lg font-semibold">
              Powered by Kind Oasis | Supporting Wisconsin's Cannabis Advocacy
            </p>
          </div>
          <p className="text-emerald-100 text-sm">
            This tool is provided for educational and advocacy purposes. 
            Please ensure your communications comply with all applicable laws and regulations.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WisconsinAdvocacyTool;