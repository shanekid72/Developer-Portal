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