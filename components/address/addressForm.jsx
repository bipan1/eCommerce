'use client';
import { Input } from "antd";
import { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

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
        const place = address.getPlace()

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPlaces((values) => ({ ...values, [name]: value }));
    };

    return (
        <div className="mb-2">
            <div className="mb-4">
                <input onChange={handleChange} name="addressLine" value={places ? places.addressLine : ''} className="border w-full h-10 rounded-md px-4 text-lg focus:outline-none focus:ring-1 focus:ring-blue-500" ref={inputRef} type="text" />
                {error?.addressLine && <p className="text-red-500 mb-2">{error.addressLine}</p>}
            </div>

            <div className="grid lg:grid-cols-3 md:gird-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-4 mb-4">
                <div>
                    <Input
                        onChange={handleChange}
                        name="suburb"
                        type="text"
                        placeholder="City name"
                        size="large"
                        value={places ? places.suburb : ''}
                    />
                    {error?.suburb && <p className="mt-2 text-red-500">{error.suburb}</p>}
                </div>

                <div>
                    <Input onChange={handleChange} name="state" value={places ? places.state : ''} size="large" type='text' placeholder="State" />
                    {error?.state && <p className="mt-2 text-red-500">{error.state}</p>}
                </div>
                <div>
                    <Input onChange={handleChange} name="postcode" value={places ? places.postcode : ''} size="large" type='text' placeholder='Post code' />
                    {error?.postcode && <p className="mt-2 text-red-500"> {error.postcode}</p>}
                </div>
            </div>
        </div>
    )
}