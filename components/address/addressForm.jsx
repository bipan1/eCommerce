'use client';
import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { states } from "utils";

const libraries = ["places"];

export default function AddressForm({ places, setPlaces, error }) {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    console.log('Google Maps API Key available:', !!apiKey);
    
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries,
    });

    useEffect(() => {
        console.log('Google Maps API - Loading state:', { isLoaded, loadError });
        if (loadError) {
            console.error('Google Maps API Load Error:', loadError);
        }
    }, [isLoaded, loadError]);

    useEffect(() => {
        if (!isLoaded) {
            console.log('Google Maps API not loaded yet');
            return;
        }
        
        if (loadError) {
            console.error('Google Maps API failed to load:', loadError);
            return;
        }

        if (!inputRef.current) {
            console.log('Input reference not available');
            return;
        }

        if (isInitialized) {
            console.log('Autocomplete already initialized');
            return;
        }

        const timer = setTimeout(() => {
            try {
                console.log('Initializing Google Places Autocomplete');
                
                const options = {
                    componentRestrictions: { country: "au" },
                    fields: ["address_components", "formatted_address", "geometry", "place_id"],
                };

                if (inputRef.current && window.google && window.google.maps && window.google.maps.places) {
                    // Clean up any existing autocomplete
                    if (autocompleteRef.current) {
                        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
                    }

                    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);
                    autocompleteRef.current = autocomplete;
                    
                    autocomplete.addListener("place_changed", () => {
                        handlePlaceChanged(autocomplete);
                    });
                    
                    setIsInitialized(true);
                    console.log('Google Places Autocomplete initialized successfully');
                } else {
                    console.error('Google Maps API or input element not ready');
                }
            } catch (error) {
                console.error('Error initializing Google Places Autocomplete:', error);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [isLoaded, loadError, isInitialized]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (autocompleteRef.current && window.google && window.google.maps) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, []);

    const handlePlaceChanged = async (address) => {
        if (!isLoaded) return;
        
        try {
            const place = address.getPlace();
            console.log('Place selected:', place);

            if (!place || !place.address_components) {
                console.log('Invalid place data');
                return;
            }
            
            addressData(place);
        } catch (error) {
            console.error('Error handling place change:', error);
        }
    };

    // Function to map Google Maps state names to our state values
    const mapStateToValue = (stateName) => {
        const stateMapping = {
            'Victoria': 'vic',
            'New South Wales': 'nsw',
            'South Australia': 'sa',
            'Australian Capital Territory': 'act',
            'Northern Territory': 'nt',
            'Queensland': 'qld',
            'Tasmania': 'tas',
            'Western Australia': 'wa'
        };
        return stateMapping[stateName] || stateName.toLowerCase();
    };

    const addressData = (data) => {
        console.log('Processing address data:', data);
        
        const addressComponents = data?.address_components;
        if (!addressComponents) {
            console.log('No address components found');
            return;
        }

        const componentMap = {
            subPremise: "",
            premise: "",
            street_number: "",
            route: "",
            country: "",
            postal_code: "",
            administrative_area_level_2: "",
            administrative_area_level_1: "",
        };

        for (const component of addressComponents) {
            const componentType = component.types[0];
            if (componentMap.hasOwnProperty(componentType)) {
                componentMap[componentType] = component.long_name;
            }
        }

        const formattedAddress =
            `${componentMap.subPremise} ${componentMap.premise} ${componentMap.street_number} ${componentMap.route}`.trim();

        // Map the Google Maps state to our expected state value
        const googleState = componentMap.administrative_area_level_1;
        const mappedState = googleState ? mapStateToValue(googleState) : '';

        const newPlaces = {
            addressLine: formattedAddress,
            postcode: componentMap.postal_code,
            suburb: componentMap.administrative_area_level_2,
            state: mappedState,
        };
        
        console.log('Google state:', googleState);
        console.log('Mapped state:', mappedState);
        console.log('Setting places:', newPlaces);
        setPlaces(newPlaces);
    };

    const handleChange = (name, value) => {
        setPlaces((values) => ({ ...values, [name]: value }));
    };

    // Base styles for inputs to match Ant Design
    const inputStyles = "w-full h-10 px-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-400";
    const selectStyles = "w-full h-10 px-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 hover:border-gray-400";
    const selectPlaceholderStyles = places?.state ? "text-gray-700" : "text-gray-400";

    // Show error message if API key is missing
    if (!apiKey) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">
                        ⚠️ Google Maps API key is missing
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                        Please set NEXT_PUBLIC_GOOGLE_MAP_API_KEY in your environment variables
                    </p>
                </div>
                {renderFormFields()}
            </div>
        );
    }

    // Show error message if API failed to load
    if (loadError) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">
                        ⚠️ Google Maps API failed to load
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                        {loadError.message || 'Please check your API key and permissions'}
                    </p>
                </div>
                {renderFormFields()}
            </div>
        );
    }

    function renderFormFields() {
        return (
            <>
                {/* Street Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={places?.addressLine || ''}
                        onChange={(e) => handleChange('addressLine', e.target.value)}
                        placeholder={isLoaded && isInitialized ? "Start typing your address..." : "Enter address manually"}
                        className={inputStyles}
                    />
                    {!isLoaded && (
                        <p className="mt-1 text-sm text-gray-500">
                            Address autocomplete is not available. Please enter manually.
                        </p>
                    )}
                    {isLoaded && !isInitialized && (
                        <p className="mt-1 text-sm text-gray-500">
                            Initializing address autocomplete...
                        </p>
                    )}
                    {error?.addressLine && (
                        <p className="mt-1 text-sm text-red-500">{error.addressLine}</p>
                    )}
                </div>

                {/* Suburb */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Suburb
                    </label>
                    <input
                        type="text"
                        value={places?.suburb || ''}
                        onChange={(e) => handleChange('suburb', e.target.value)}
                        placeholder="Enter suburb"
                        className={inputStyles}
                    />
                    {error?.suburb && (
                        <p className="mt-1 text-sm text-red-500">{error.suburb}</p>
                    )}
                </div>

                {/* State and Postcode */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                        </label>
                        <select
                            value={places?.state || ''}
                            onChange={(e) => handleChange('state', e.target.value)}
                            className={`${selectStyles} ${selectPlaceholderStyles}`}
                        >
                            <option value="" disabled className="text-gray-400">Select state</option>
                            {states.map((state) => (
                                <option key={state.value} value={state.value} className="text-gray-700">
                                    {state.label}
                                </option>
                            ))}
                        </select>
                        {error?.state && (
                            <p className="mt-1 text-sm text-red-500">{error.state}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postcode
                        </label>
                        <input
                            type="text"
                            value={places?.postcode || ''}
                            onChange={(e) => handleChange('postcode', e.target.value)}
                            placeholder="Enter postcode"
                            maxLength={4}
                            className={inputStyles}
                        />
                        {error?.postcode && (
                            <p className="mt-1 text-sm text-red-500">{error.postcode}</p>
                        )}
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="space-y-4 pb-4">
            {renderFormFields()}
        </div>
    );
}