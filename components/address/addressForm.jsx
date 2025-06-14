'use client';
import { Input, Select } from "antd";
import { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { states } from "utils";

const libraries = ["places"];

export default function AddressForm({ places, setPlaces, error }) {
    const inputRef = useRef(null);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
        libraries,
    });

    useEffect(() => {
        if (!isLoaded || loadError) return;

        const options = {
            componentRestrictions: { country: "au" },
            fields: ["address_components"],
        };

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);
        autocomplete.addListener("place_changed", () => handlePlaceChanged(autocomplete));
    }, [isLoaded, loadError]);

    const handlePlaceChanged = async (address) => {
        if (!isLoaded) return;
        const place = address.getPlace();

        if (!place) {
            setPlaces({});
            return;
        }
        addressData(place);
    };

    const addressData = (data) => {
        const addressComponents = data?.address_components;

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

        setPlaces({
            addressLine: formattedAddress,
            postcode: componentMap.postal_code,
            suburb: componentMap.administrative_area_level_2,
            state: componentMap.administrative_area_level_1,
        });
    };

    const handleChange = (name, value) => {
        setPlaces((values) => ({ ...values, [name]: value }));
    };

    return (
        <div className="space-y-4">
            {/* Street Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                </label>
                <Input
                    ref={inputRef}
                    value={places?.addressLine || ''}
                    onChange={(e) => handleChange('addressLine', e.target.value)}
                    placeholder="Start typing your address..."
                    className="!rounded-lg !h-10"
                />
                {error?.addressLine && (
                    <p className="mt-1 text-sm text-red-500">{error.addressLine}</p>
                )}
            </div>

            {/* Suburb */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suburb
                </label>
                <Input
                    value={places?.suburb || ''}
                    onChange={(e) => handleChange('suburb', e.target.value)}
                    placeholder="Enter suburb"
                    className="!rounded-lg !h-10"
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
                    <Select
                        value={places?.state || undefined}
                        onChange={(value) => handleChange('state', value)}
                        placeholder="Select state"
                        className="w-full !rounded-lg"
                        options={states}
                    />
                    {error?.state && (
                        <p className="mt-1 text-sm text-red-500">{error.state}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postcode
                    </label>
                    <Input
                        value={places?.postcode || ''}
                        onChange={(e) => handleChange('postcode', e.target.value)}
                        placeholder="Enter postcode"
                        className="!rounded-lg !h-10"
                        maxLength={4}
                    />
                    {error?.postcode && (
                        <p className="mt-1 text-sm text-red-500">{error.postcode}</p>
                    )}
                </div>
            </div>
        </div>
    );
}