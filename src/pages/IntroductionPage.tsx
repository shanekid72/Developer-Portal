import { ExternalLink, Terminal, Book, Code } from 'lucide-react';
import ScrollRevealContainer from '../components/ScrollRevealContainer';

const IntroductionPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <ScrollRevealContainer>
        <div className="mb-8" id="intro">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Book className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Introduction to RaaS
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome to the RaaS (Remittance as a Service) Developer Portal. Build powerful remittance applications with our comprehensive API suite.
          </p>
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12" id="what-is-raas">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            What is RaaS?
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              <strong>RaaS (Remittance as a Service)</strong> is a comprehensive platform that enables you to 
              integrate cross-border money transfer capabilities into your applications. Our API provides 
              access to real-time exchange rates, compliance checks, and secure transaction processing 
              across multiple corridors worldwide.
            </p>
            <p>
              With RaaS, you can build applications that allow your users to send money internationally 
              with confidence, leveraging our robust infrastructure and regulatory compliance frameworks.
            </p>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12" id="key-features">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Real-time Exchange Rates */}
            <div className="flip-card h-[200px] w-full perspective-1000">
              <div className="flip-card-inner relative w-full h-full transform-style-3d hover:rotate-y-180">
                {/* Front */}
                <div className="flip-card-front absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">💱</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Real-time Exchange Rates
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Access live exchange rates for 180+ currencies with transparent pricing
                      </p>
                    </div>
                  </div>
                </div>
                {/* Back */}
                <div className="flip-card-back absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 rotate-y-180 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
                    Real-time Exchange Rates
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Our API provides up-to-the-minute exchange rates for over 180 currencies worldwide. 
                    Get competitive rates with transparent fee structures, allowing your customers to 
                    make informed decisions about their international transfers.
                  </p>
                </div>
              </div>
            </div>

            {/* Global Coverage */}
            <div className="flip-card h-[200px] w-full perspective-1000">
              <div className="flip-card-inner relative w-full h-full transform-style-3d hover:rotate-y-180">
                {/* Front */}
                <div className="flip-card-front absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🌍</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Global Coverage
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Send money to 200+ countries and territories worldwide
                      </p>
                    </div>
                  </div>
                </div>
                {/* Back */}
                <div className="flip-card-back absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 rotate-y-180 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
                    Global Coverage
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Our extensive network covers more than 200 countries and territories, enabling your 
                    customers to send money to virtually anywhere in the world. With multiple payout 
                    options in each destination, we ensure funds reach recipients quickly and securely.
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance & Security */}
            <div className="flip-card h-[200px] w-full perspective-1000">
              <div className="flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-3d hover:rotate-y-180">
                {/* Front */}
                <div className="flip-card-front absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🔒</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Compliance & Security
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Built-in AML/KYC checks and regulatory compliance frameworks
                      </p>
                    </div>
                  </div>
                </div>
                {/* Back */}
                <div className="flip-card-back absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 rotate-y-180 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
                    Compliance & Security
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Our platform includes comprehensive AML/KYC checks and adheres to global regulatory 
                    standards. We handle the complex compliance requirements so you can focus on your 
                    core business while maintaining the highest security standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Multiple Payment Methods */}
            <div className="flip-card h-[200px] w-full perspective-1000">
              <div className="flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-3d hover:rotate-y-180">
                {/* Front */}
                <div className="flip-card-front absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex items-center">
                <div className="flex items-start space-x-4">
                    <div className="text-2xl">💳</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Multiple Payment Methods
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Support for bank transfers, digital wallets, cash pickup, and more
                    </p>
                    </div>
                  </div>
                </div>
                {/* Back */}
                <div className="flip-card-back absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 rotate-y-180 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
                    Multiple Payment Methods
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Offer your customers flexibility with diverse payment and payout options including 
                    bank transfers, digital wallets, cash pickup locations, and mobile money. Our API 
                    seamlessly integrates with various payment methods to suit different preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12" id="integration-process">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Integration Process
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Integrating with RaaS is a straightforward process designed to get you up and running quickly:
            </p>
            
            <ol>
              <li>
                <strong>Sign up for API access</strong> - Register for a developer account and receive your API credentials
              </li>
              <li>
                <strong>Explore our documentation</strong> - Familiarize yourself with our API endpoints and integration options
              </li>
              <li>
                <strong>Test in sandbox environment</strong> - Use our sandbox environment to test your integration without real money transfers
              </li>
              <li>
                <strong>Go live</strong> - Once testing is complete, switch to production credentials and start processing real remittances
              </li>
            </ol>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12" id="remittance-flow">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Remittance Flow
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The RaaS platform provides a complete end-to-end remittance flow that covers the entire process from quote generation to transaction confirmation:
            </p>
          </div>
          
          <div className="mt-6 relative">
            <div className="absolute left-5 h-full w-0.5 bg-primary-200 dark:bg-primary-800"></div>
            
            <div className="mb-8 ml-12 relative">
              <div className="absolute -left-12 mt-1.5 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create a Quote
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get real-time exchange rates and fees for a specific corridor and amount
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 overflow-x-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs font-medium">POST</span>
                  <code className="text-sm">/amr/ras/api/v1_0/ras/quote</code>
                </div>
                <pre className="text-xs text-gray-800 dark:text-gray-200">
{`{
  "sending_country_code": "AE",
  "sending_currency_code": "AED",
  "receiving_country_code": "PK",
  "receiving_currency_code": "PKR",
  "sending_amount": 300,
  "receiving_mode": "BANK",
  "type": "SEND",
  "instrument": "REMITTANCE"
}`}
                </pre>
              </div>
            </div>
            
            <div className="mb-8 ml-12 relative">
              <div className="absolute -left-12 mt-1.5 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create a Transaction
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Submit details of sender, receiver, and the transaction using the quote ID
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 overflow-x-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs font-medium">POST</span>
                  <code className="text-sm">/amr/ras/api/v1_0/ras/createtransaction</code>
                </div>
                <pre className="text-xs text-gray-800 dark:text-gray-200">
{`{
  "type": "SEND",
  "source_of_income": "SLRY",
  "purpose_of_txn": "SAVG",
  "instrument": "REMITTANCE",
  "message": "Agency transaction",
  "sender": { "customer_number": "7841001220007002" },
  "receiver": {
    "first_name": "Receiver Name",
    "last_name": "Receiver Lastname",
    "bank_details": { /* bank details */ }
  },
  "transaction": { 
    "quote_id": "Q12345678",
    "agent_transaction_ref_number": "Q12345678" 
  }
}`}
                </pre>
              </div>
            </div>
            
            <div className="mb-8 ml-12 relative">
              <div className="absolute -left-12 mt-1.5 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Confirm the Transaction
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Process the transaction after all details have been verified
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 overflow-x-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs font-medium">POST</span>
                  <code className="text-sm">/amr/ras/api/v1_0/ras/confirmtransaction</code>
                </div>
                <pre className="text-xs text-gray-800 dark:text-gray-200">
{`{
  "transaction_ref_number": "T987654321"
}`}
                </pre>
              </div>
            </div>
            
            <div className="ml-12 relative">
              <div className="absolute -left-12 mt-1.5 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Track and Manage
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Monitor transaction status and retrieve transaction details when needed
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 overflow-x-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs font-medium">GET</span>
                  <code className="text-sm">/amr/ras/api/v1_0/ras/enquire-transaction?transaction_ref_number=T987654321</code>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12" id="api-endpoints">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            API Endpoints Overview
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Remittance API
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Core remittance functionality for creating and managing cross-border transfers
              </p>
              <div className="flex flex-wrap gap-2">
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono text-gray-800 dark:text-gray-200">
                  POST /ras/quote
                </code>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono text-gray-800 dark:text-gray-200">
                  POST /ras/createtransaction
                </code>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono text-gray-800 dark:text-gray-200">
                  POST /ras/confirmtransaction
                </code>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Customer API
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Manage customer profiles, KYC verification, and compliance checks
              </p>
              <div className="flex flex-wrap gap-2">
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono text-gray-800 dark:text-gray-200">
                  POST /customer/validate
                </code>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono text-gray-800 dark:text-gray-200">
                  POST /onBoarding/customer
                </code>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono text-gray-800 dark:text-gray-200">
                  GET /customer/{"{id}"}
                </code>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Masters API
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Access reference data like banks, branches, codes, and service corridors
              </p>
              <div className="flex flex-wrap gap-2">
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono text-gray-800 dark:text-gray-200">
                  GET /masters/v1/codes
                </code>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono text-gray-800 dark:text-gray-200">
                  GET /masters/v1/banks
                </code>
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono text-gray-800 dark:text-gray-200">
                  GET /masters/v1/rates
                </code>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-8" id="supported-countries">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Supported Corridors
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { code: 'PK', name: 'Pakistan', currency: 'PKR' },
              { code: 'IN', name: 'India', currency: 'INR' },
              { code: 'EG', name: 'Egypt', currency: 'EGP' },
              { code: 'CN', name: 'China', currency: 'CNY' },
              { code: 'LK', name: 'Sri Lanka', currency: 'LKR' },
              { code: 'PH', name: 'Philippines', currency: 'PHP' },
              { code: 'BD', name: 'Bangladesh', currency: 'BDT' },
              { code: 'NP', name: 'Nepal', currency: 'NPR' }
            ].map((country) => (
              <div 
                key={country.code}
                className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
              >
                <span className="text-xl mr-3">
                  {country.code === 'PK' ? '🇵🇰' :
                   country.code === 'IN' ? '🇮🇳' :
                   country.code === 'EG' ? '🇪🇬' :
                   country.code === 'CN' ? '🇨🇳' :
                   country.code === 'LK' ? '🇱🇰' :
                   country.code === 'PH' ? '🇵🇭' :
                   country.code === 'BD' ? '🇧🇩' :
                   country.code === 'NP' ? '🇳🇵' : '🌐'}
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{country.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{country.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-8" id="get-started">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Getting Started
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p>
              Ready to start integrating? Follow these steps:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                  <Terminal className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  API Documentation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Review our detailed API documentation to understand the available endpoints
                </p>
                <a href="/api-reference" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  View API Reference
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Authentication
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Learn how to authenticate with our API and secure your requests
                </p>
                <a href="/authentication" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Authentication Guide
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Sandbox Testing
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Test your integration in our sandbox environment before going live
                </p>
                <a href="#" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Sandbox Guide
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section>
          <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-8 border border-primary-200 dark:border-primary-800">
            <h2 className="text-2xl font-semibold text-primary-900 dark:text-primary-100 mb-4">
              Ready to get started?
            </h2>
            <p className="text-primary-800 dark:text-primary-200 mb-6 text-lg">
              Sign up for API access and begin integrating remittance functionality into your applications today.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/api-reference" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-base font-medium transition-colors duration-200">
                Explore the API
              </a>
              <a href="#" className="px-6 py-3 bg-white hover:bg-gray-50 text-primary-600 border border-primary-200 rounded-md text-base font-medium transition-colors duration-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-primary-400 dark:border-primary-800">
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>
    </div>
  );
};

export default IntroductionPage; 