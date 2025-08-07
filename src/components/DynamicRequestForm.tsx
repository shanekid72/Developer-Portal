import React, { useState, useEffect } from 'react';

interface DynamicRequestFormProps {
  endpointTitle: string;
  currentRequestBody: string;
  onRequestBodyChange: (body: string) => void;
}

interface FormData {
  [key: string]: any;
}

interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  payoutModes: PayoutMode[];
}

interface PayoutMode {
  code: string;
  name: string;
  requiredFields: string[];
  optionalFields?: string[];
}

const DynamicRequestForm: React.FC<DynamicRequestFormProps> = ({
  endpointTitle,
  currentRequestBody,
  onRequestBodyChange
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('PK');
  const [selectedPayoutMode, setSelectedPayoutMode] = useState<string>('BANK');
  const [formData, setFormData] = useState<FormData>({});

  // Country configurations based on API documentation
  const countries: CountryConfig[] = [
    {
      code: 'PK',
      name: 'Pakistan',
      currency: 'PKR',
      payoutModes: [
        {
          code: 'BANK',
          name: 'Bank Transfer',
          requiredFields: ['account_type_code', 'iso_code', 'iban'],
          optionalFields: ['routing_code']
        },
        {
          code: 'WALLET',
          name: 'Digital Wallet',
          requiredFields: ['wallet_provider'],
          optionalFields: []
        }
      ]
    },
    {
      code: 'IN',
      name: 'India',
      currency: 'INR',
      payoutModes: [
        {
          code: 'BANK',
          name: 'Bank Transfer',
          requiredFields: ['account_type_code', 'routing_code'],
          optionalFields: ['iso_code']
        }
      ]
    },
    {
      code: 'BD',
      name: 'Bangladesh',
      currency: 'BDT',
      payoutModes: [
        {
          code: 'BANK',
          name: 'Bank Transfer',
          requiredFields: ['account_type_code', 'routing_code'],
          optionalFields: ['iso_code']
        },
        {
          code: 'WALLET',
          name: 'Digital Wallet',
          requiredFields: ['wallet_provider'],
          optionalFields: []
        },
        {
          code: 'CASH',
          name: 'Cash Pickup',
          requiredFields: ['bank_id', 'branch_id'],
          optionalFields: []
        }
      ]
    },
    {
      code: 'PH',
      name: 'Philippines',
      currency: 'PHP',
      payoutModes: [
        {
          code: 'BANK',
          name: 'Bank Transfer',
          requiredFields: ['account_type_code', 'routing_code'],
          optionalFields: ['iso_code']
        },
        {
          code: 'WALLET',
          name: 'Digital Wallet',
          requiredFields: ['wallet_provider'],
          optionalFields: []
        },
        {
          code: 'CASH',
          name: 'Cash Pickup',
          requiredFields: ['bank_id', 'branch_id'],
          optionalFields: []
        }
      ]
    }
  ];

  const selectedCountryConfig = countries.find(c => c.code === selectedCountry);
  const selectedPayoutModeConfig = selectedCountryConfig?.payoutModes.find(p => p.code === selectedPayoutMode);

  // Initialize form data from current request body (only once)
  useEffect(() => {
    try {
      const parsed = JSON.parse(currentRequestBody);
      setFormData(parsed);
    } catch (e) {
      // If parsing fails, use default structure
      setFormData({
        sending_country_code: "AE",
        sending_currency_code: "AED",
        receiving_country_code: selectedCountry,
        receiving_currency_code: selectedCountryConfig?.currency || "PKR",
        sending_amount: 300,
        receiving_mode: selectedPayoutMode,
        type: "SEND",
        instrument: "REMITTANCE"
      });
    }
  }, []); // Only run once on mount

  // Initialize request body based on selected country and mode
  useEffect(() => {
    let initialBody: any = {};
    
    if (endpointTitle === 'Create Quote') {
      // Base structure for Create Quote
      initialBody = {
        "sending_country_code": "AE",
        "sending_currency_code": "AED",
        "receiving_country_code": selectedCountry,
        "receiving_currency_code": selectedCountryConfig?.currency || "PKR",
        "sending_amount": 300,
        "receiving_mode": selectedPayoutMode,
        "type": "SEND",
        "instrument": "REMITTANCE"
      };
      
      // Add mode-specific fields for Create Quote
      if (selectedPayoutMode === 'BANK') {
        // For BANK mode, add bank_details to receiver
        if (selectedCountry === 'PK') {
          initialBody.receiver = {
            "bank_details": {
              "account_type_code": "SAVINGS",
              "iso_code": "PKR",
              "iban": "PK12ABCD1234567891234567"
            }
          };
        } else if (selectedCountry === 'IN') {
          initialBody.receiver = {
            "bank_details": {
              "account_type_code": "SAVINGS",
              "routing_code": "SBIN0000123"
            }
          };
        } else if (selectedCountry === 'BD') {
          initialBody.receiver = {
            "bank_details": {
              "account_type_code": "SAVINGS",
              "routing_code": "DBBLBDDH"
            }
          };
        } else if (selectedCountry === 'PH') {
          initialBody.receiver = {
            "bank_details": {
              "account_type_code": "SAVINGS",
              "routing_code": "BOPIPHMM"
            }
          };
        }
      } else if (selectedPayoutMode === 'WALLET') {
        // For WALLET mode, add wallet_details to receiver
        initialBody.receiver = {
          "wallet_details": {
            "wallet_provider": "JAZZCASH",
            "wallet_number": "+919586741508"
          }
        };
      } else if (selectedPayoutMode === 'CASH') {
        initialBody.bank_id = "11232";
        initialBody.branch_id = "22345";
      }
    } else if (endpointTitle === 'Create Transaction') {
      // Base structure for Create Transaction according to API documentation
      initialBody = {
        "sending_country_code": "AE",
        "sending_currency_code": "AED",
        "receiving_country_code": selectedCountry,
        "receiving_currency_code": selectedCountryConfig?.currency || "PKR",
        "sending_amount": 300,
        "receiving_mode": selectedPayoutMode,
        "type": "SEND",
        "instrument": "REMITTANCE",
        "quote_id": "1279125121873380",
        "transaction": {
          "quote_id": "1279125121873380"
        },
        "sender": {
          "customer_number": "CUST001",
          "first_name": "John",
          "last_name": "Doe",
          "mobile_number": "+971524524152",
          "nationality": "AE",
          "sender_address": {
            "address_line1": "123 Main Street",
            "city": "Dubai",
            "state": "Dubai",
            "country": "AE",
            "postal_code": "12345"
          },
          "id_details": {
            "id_type": "EMIRATES_ID",
            "id_number": "123456789012345"
          }
        },
        "receiver": {
          "first_name": "Anija",
          "last_name": "Smith",
          "mobile_number": "+919586741508",
          "nationality": selectedCountry,
          "relation_code": "32"
        },
        "source_of_income": "SLRY",
        "purpose_of_txn": "SAVG",
        "message": "Agency transaction"
      };
      
      // Add mode-specific fields for Create Transaction
      if (selectedPayoutMode === 'BANK') {
        // For BANK mode, add bank_details to receiver
        if (selectedCountry === 'PK') {
          initialBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "account_number": "1234567890",
            "iso_code": "PKR",
            "iban": "PK12ABCD1234567891234567"
          };
        } else if (selectedCountry === 'IN') {
          initialBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "account_number": "1234567890",
            "routing_code": "SBIN0000123"
          };
        } else if (selectedCountry === 'BD') {
          initialBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "account_number": "1234567890",
            "routing_code": "DBBLBDDH"
          };
        } else if (selectedCountry === 'PH') {
          initialBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "account_number": "1234567890",
            "routing_code": "BOPIPHMM"
          };
        }
      } else if (selectedPayoutMode === 'WALLET') {
        // For WALLET mode, add wallet_details to receiver
        initialBody.receiver.wallet_details = {
          "wallet_provider": "JAZZCASH",
          "wallet_number": "+919586741508"
        };
      } else if (selectedPayoutMode === 'CASH') {
        // For CASH mode, add bank_id and branch_id at root level
        initialBody.bank_id = "11232";
        initialBody.branch_id = "22345";
      }
    }
    
    onRequestBodyChange(JSON.stringify(initialBody, null, 2));
  }, [endpointTitle, selectedCountry, selectedCountryConfig, selectedPayoutMode, onRequestBodyChange]);

  // Update request body when form data changes
  useEffect(() => {
    if (Object.keys(formData).length === 0) return;
    
    // Create updated body immediately
    let updatedBody: any = {};
    
    if (endpointTitle === 'Create Quote') {
      // Base structure for Create Quote - only documented fields
      updatedBody = {
        "sending_country_code": "AE",
        "sending_currency_code": "AED",
        "receiving_country_code": selectedCountry,
        "receiving_currency_code": selectedCountryConfig?.currency || "PKR",
        "sending_amount": 300,
        "receiving_mode": selectedPayoutMode,
        "type": "SEND",
        "instrument": "REMITTANCE"
      };
      
      // Add mode-specific fields for Create Quote based on API documentation
      if (selectedPayoutMode === 'BANK') {
        // For BANK mode, add bank_details
        updatedBody.receiver = {
          "bank_details": {}
        };
        
        if (selectedCountry === 'PK') {
          updatedBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "iso_code": "PKR",
            "iban": "PK12ABCD1234567891234567"
          };
        } else if (selectedCountry === 'IN') {
          updatedBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "routing_code": "SBIN0000123"
          };
        } else if (selectedCountry === 'BD') {
          updatedBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "routing_code": "DBBLBDDH"
          };
        } else if (selectedCountry === 'PH') {
          updatedBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "routing_code": "BOPIPHMM"
          };
        }
      } else if (selectedPayoutMode === 'WALLET') {
        // For WALLET mode, add wallet_provider
        updatedBody.receiver = {
          "wallet_provider": "JAZZCASH"
        };
      } else if (selectedPayoutMode === 'CASH') {
        // For CASH mode, add bank_id and branch_id
        updatedBody.bank_id = "11232";
        updatedBody.branch_id = "22345";
      }
    } else if (endpointTitle === 'Create Transaction') {
      // Base structure for Create Transaction according to API documentation
      updatedBody = {
        "sending_country_code": "AE",
        "sending_currency_code": "AED",
        "receiving_country_code": selectedCountry,
        "receiving_currency_code": selectedCountryConfig?.currency || "PKR",
        "sending_amount": 300,
        "receiving_mode": selectedPayoutMode,
        "type": "SEND",
        "instrument": "REMITTANCE",
        "quote_id": "1279125121873380",
        "transaction": {
          "quote_id": "1279125121873380"
        },
        "sender": {
          "customer_number": "CUST001",
          "first_name": "John",
          "last_name": "Doe",
          "mobile_number": "+971524524152",
          "nationality": "AE",
          "sender_address": {
            "address_line1": "123 Main Street",
            "city": "Dubai",
            "state": "Dubai",
            "country": "AE",
            "postal_code": "12345"
          },
          "id_details": {
            "id_type": "EMIRATES_ID",
            "id_number": "123456789012345"
          }
        },
        "receiver": {
          "first_name": "Anija",
          "last_name": "Smith",
          "mobile_number": "+919586741508",
          "nationality": selectedCountry,
          "relation_code": "32"
        },
        "source_of_income": "SLRY",
        "purpose_of_txn": "SAVG",
        "message": "Agency transaction"
      };
      
      // Add mode-specific fields for Create Transaction
      if (selectedPayoutMode === 'BANK') {
        // For BANK mode, add bank_details to receiver
        if (selectedCountry === 'PK') {
          updatedBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "account_number": "1234567890",
            "iso_code": "PKR",
            "iban": "PK12ABCD1234567891234567"
          };
        } else if (selectedCountry === 'IN') {
          updatedBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "account_number": "1234567890",
            "routing_code": "SBIN0000123"
          };
        } else if (selectedCountry === 'BD') {
          updatedBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "account_number": "1234567890",
            "routing_code": "DBBLBDDH"
          };
        } else if (selectedCountry === 'PH') {
          updatedBody.receiver.bank_details = {
            "account_type_code": "SAVINGS",
            "account_number": "1234567890",
            "routing_code": "BOPIPHMM"
          };
        }
      } else if (selectedPayoutMode === 'WALLET') {
        // For WALLET mode, add wallet_details to receiver
        updatedBody.receiver.wallet_details = {
          "wallet_provider": "JAZZCASH",
          "wallet_number": "+919586741508"
        };
      } else if (selectedPayoutMode === 'CASH') {
        // For CASH mode, add bank_id and branch_id at root level
        updatedBody.bank_id = "11232";
        updatedBody.branch_id = "22345";
      }
    }
    
    onRequestBodyChange(JSON.stringify(updatedBody, null, 2));
  }, [formData, selectedCountry, selectedPayoutMode, selectedCountryConfig, onRequestBodyChange, endpointTitle]);

  // Only show for relevant endpoints - exclude authentication endpoints
  const relevantEndpoints = ['Create Quote', 'Create Transaction'];
  const excludedEndpoints = ['Get Access Token', 'Authentication'];
  if (!relevantEndpoints.includes(endpointTitle) || excludedEndpoints.includes(endpointTitle)) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Receiving Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                // Force immediate update of request body
                const newCountry = e.target.value;
                const countryConfig = countries.find(c => c.code === newCountry);
                
                // Make sure selected payout mode is available for the new country
                const availableModes = countryConfig?.payoutModes.map(m => m.code) || [];
                let newPayoutMode = selectedPayoutMode;
                if (!availableModes.includes(selectedPayoutMode)) {
                  newPayoutMode = availableModes[0] || 'BANK';
                  setSelectedPayoutMode(newPayoutMode);
                }
                
                // Create updated body immediately
                let updatedBody: any = {};
                
                if (endpointTitle === 'Create Quote') {
                  updatedBody = {
                    "sending_country_code": "AE",
                    "sending_currency_code": "AED",
                    "receiving_country_code": newCountry,
                    "receiving_currency_code": countryConfig?.currency || "PKR",
                    "sending_amount": 300,
                    "receiving_mode": newPayoutMode,
                    "type": "SEND",
                    "instrument": "REMITTANCE"
                  };
                  
                  // Add mode-specific fields for Create Quote based on API documentation
                  if (newPayoutMode === 'BANK') {
                    // For BANK mode, add bank_details
                    updatedBody.receiver = {
                      "bank_details": {}
                    };
                    
                    if (newCountry === 'PK') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "iso_code": "PKR",
                        "iban": "PK12ABCD1234567891234567"
                      };
                    } else if (newCountry === 'IN') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "routing_code": "SBIN0000123"
                      };
                    } else if (newCountry === 'BD') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "routing_code": "DBBLBDDH"
                      };
                    } else if (newCountry === 'PH') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "routing_code": "BOPIPHMM"
                      };
                    }
                  } else if (newPayoutMode === 'WALLET') {
                    // For WALLET mode, add wallet_provider
                    updatedBody.receiver = {
                      "wallet_provider": "JAZZCASH"
                    };
                  } else if (newPayoutMode === 'CASH') {
                    // For CASH mode, add bank_id and branch_id
                    updatedBody.bank_id = "11232";
                    updatedBody.branch_id = "22345";
                  }
                } else if (endpointTitle === 'Create Transaction') {
                  updatedBody = {
                    "sending_country_code": "AE",
                    "sending_currency_code": "AED",
                    "receiving_country_code": newCountry,
                    "receiving_currency_code": countryConfig?.currency || "PKR",
                    "sending_amount": 300,
                    "receiving_mode": newPayoutMode,
                    "type": "SEND",
                    "instrument": "REMITTANCE",
                    "quote_id": "1279125121873380",
                    "transaction": {
                      "quote_id": "1279125121873380"
                    },
                    "sender": {
                      "customer_number": "CUST001",
                      "first_name": "John",
                      "last_name": "Doe",
                      "mobile_number": "+971524524152",
                      "nationality": "AE",
                      "sender_address": {
                        "address_line1": "123 Main Street",
                        "city": "Dubai",
                        "state": "Dubai",
                        "country": "AE",
                        "postal_code": "12345"
                      },
                      "id_details": {
                        "id_type": "EMIRATES_ID",
                        "id_number": "123456789012345"
                      }
                    },
                    "receiver": {
                      "first_name": "Anija",
                      "last_name": "Smith",
                      "mobile_number": "+919586741508",
                      "nationality": newCountry,
                      "relation_code": "32"
                    },
                    "source_of_income": "SLRY",
                    "purpose_of_txn": "SAVG",
                    "message": "Agency transaction"
                  };
                  
                  // Add mode-specific fields for Create Transaction
                  if (newPayoutMode === 'BANK') {
                    // For BANK mode, add bank_details to receiver
                    if (newCountry === 'PK') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "account_number": "1234567890",
                        "iso_code": "PKR",
                        "iban": "PK12ABCD1234567891234567"
                      };
                    } else if (newCountry === 'IN') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "account_number": "1234567890",
                        "routing_code": "SBIN0000123"
                      };
                    } else if (newCountry === 'BD') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "account_number": "1234567890",
                        "routing_code": "DBBLBDDH"
                      };
                    } else if (newCountry === 'PH') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "account_number": "1234567890",
                        "routing_code": "BOPIPHMM"
                      };
                    }
                  } else if (newPayoutMode === 'WALLET') {
                    // For WALLET mode, add wallet_details to receiver
                    updatedBody.receiver.wallet_details = {
                      "wallet_provider": "JAZZCASH",
                      "wallet_number": "+919586741508"
                    };
                  } else if (newPayoutMode === 'CASH') {
                    // For CASH mode, add bank_id and branch_id at root level
                    updatedBody.bank_id = "11232";
                    updatedBody.branch_id = "22345";
                  }
                }
                
                onRequestBodyChange(JSON.stringify(updatedBody, null, 2));
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>

          {/* Payout Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payout Mode
            </label>
            <select
              value={selectedPayoutMode}
              onChange={(e) => {
                setSelectedPayoutMode(e.target.value);
                // Force immediate update of request body
                const newPayoutMode = e.target.value;
                
                // Create updated body immediately
                let updatedBody: any = {};
                
                if (endpointTitle === 'Create Quote') {
                  updatedBody = {
                    "sending_country_code": "AE",
                    "sending_currency_code": "AED",
                    "receiving_country_code": selectedCountry,
                    "receiving_currency_code": selectedCountryConfig?.currency || "PKR",
                    "sending_amount": 300,
                    "receiving_mode": newPayoutMode,
                    "type": "SEND",
                    "instrument": "REMITTANCE"
                  };
                  
                  // Add mode-specific fields for Create Quote based on API documentation
                  if (newPayoutMode === 'BANK') {
                    // For BANK mode, add bank_details
                    updatedBody.receiver = {
                      "bank_details": {}
                    };
                    
                    if (selectedCountry === 'PK') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "iso_code": "PKR",
                        "iban": "PK12ABCD1234567891234567"
                      };
                    } else if (selectedCountry === 'IN') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "routing_code": "SBIN0000123"
                      };
                    } else if (selectedCountry === 'BD') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "routing_code": "DBBLBDDH"
                      };
                    } else if (selectedCountry === 'PH') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "routing_code": "BOPIPHMM"
                      };
                    }
                  } else if (newPayoutMode === 'WALLET') {
                    // For WALLET mode, add wallet_provider
                    updatedBody.receiver = {
                      "wallet_provider": "JAZZCASH"
                    };
                  } else if (newPayoutMode === 'CASH') {
                    // For CASH mode, add bank_id and branch_id
                    updatedBody.bank_id = "11232";
                    updatedBody.branch_id = "22345";
                  }
                } else if (endpointTitle === 'Create Transaction') {
                  updatedBody = {
                    "sending_country_code": "AE",
                    "sending_currency_code": "AED",
                    "receiving_country_code": selectedCountry,
                    "receiving_currency_code": selectedCountryConfig?.currency || "PKR",
                    "sending_amount": 300,
                    "receiving_mode": newPayoutMode,
                    "type": "SEND",
                    "instrument": "REMITTANCE",
                    "quote_id": "1279125121873380",
                    "transaction": {
                      "quote_id": "1279125121873380"
                    },
                    "sender": {
                      "customer_number": "CUST001",
                      "first_name": "John",
                      "last_name": "Doe",
                      "mobile_number": "+971524524152",
                      "nationality": "AE",
                      "sender_address": {
                        "address_line1": "123 Main Street",
                        "city": "Dubai",
                        "state": "Dubai",
                        "country": "AE",
                        "postal_code": "12345"
                      },
                      "id_details": {
                        "id_type": "EMIRATES_ID",
                        "id_number": "123456789012345"
                      }
                    },
                    "receiver": {
                      "first_name": "Anija",
                      "last_name": "Smith",
                      "mobile_number": "+919586741508",
                      "nationality": selectedCountry,
                      "relation_code": "32"
                    },
                    "source_of_income": "SLRY",
                    "purpose_of_txn": "SAVG",
                    "message": "Agency transaction"
                  };
                  
                  // Add mode-specific fields for Create Transaction
                  if (newPayoutMode === 'BANK') {
                    // For BANK mode, add bank_details to receiver
                    if (selectedCountry === 'PK') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "account_number": "1234567890",
                        "iso_code": "PKR",
                        "iban": "PK12ABCD1234567891234567"
                      };
                    } else if (selectedCountry === 'IN') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "account_number": "1234567890",
                        "routing_code": "SBIN0000123"
                      };
                    } else if (selectedCountry === 'BD') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "account_number": "1234567890",
                        "routing_code": "DBBLBDDH"
                      };
                    } else if (selectedCountry === 'PH') {
                      updatedBody.receiver.bank_details = {
                        "account_type_code": "SAVINGS",
                        "account_number": "1234567890",
                        "routing_code": "BOPIPHMM"
                      };
                    }
                  } else if (newPayoutMode === 'WALLET') {
                    // For WALLET mode, add wallet_details to receiver
                    updatedBody.receiver.wallet_details = {
                      "wallet_provider": "JAZZCASH",
                      "wallet_number": "+919586741508"
                    };
                  } else if (newPayoutMode === 'CASH') {
                    // For CASH mode, add bank_id and branch_id at root level
                    updatedBody.bank_id = "11232";
                    updatedBody.branch_id = "22345";
                  }
                }
                
                onRequestBodyChange(JSON.stringify(updatedBody, null, 2));
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {selectedCountryConfig?.payoutModes.map(mode => (
                <option key={mode.code} value={mode.code}>
                  {mode.name} ({mode.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Receiver Information */}
        {/* Removed as per user request - only country and mode dropdowns are needed */}

          {/* Transaction Information */}
          {/* Removed as per user request - only country and mode dropdowns are needed */}

          {/* Sender Information */}
          {/* Removed as per user request - only country and mode dropdowns are needed */}

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Selected Configuration:</strong> {selectedCountryConfig?.name} ({selectedCountry}) - {selectedPayoutModeConfig?.name} ({selectedPayoutMode})
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
              Required fields for this combination: {selectedPayoutModeConfig?.requiredFields.join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default DynamicRequestForm; 