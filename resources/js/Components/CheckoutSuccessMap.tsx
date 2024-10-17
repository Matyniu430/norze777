import { AdvancedMarker, APIProvider, Map, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useEffect, useState } from "react";
import mapPinIcon from '../../assets/map-pin.svg';
import closeIcon from '../../assets/close.svg';
import { Shipping } from "@/Pages/Client/CheckoutSuccess";

export default function CheckoutSuccessMap({shipping} : {shipping:Shipping}) {
    const geocodingApiLoaded = useMapsLibrary('geocoding');
    const [geocodingService, setGeocodingService] = useState<google.maps.Geocoder>();
    const [geocodingCoords, setGeocodingCoords] = useState<any>();
    const [isMsgVisible, setIsMsgVisible] = useState(true);
    useEffect(() => {
        if (!geocodingApiLoaded) {
            setGeocodingService(new google.maps.Geocoder());
        }
    }, [geocodingApiLoaded]);

    useEffect(() => {
        if (geocodingService) {
            const address = `${shipping.addressDetails.line1} ${shipping.addressDetails.city} ${shipping.addressDetails.postal_code} ${shipping.addressDetails.country}`;
            geocodingService.geocode({ address }, (results, status) => {
                if (results && status === "OK") {
                    setGeocodingCoords({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    })
                }
            })
        }
    }, [geocodingService])

    return (
        <APIProvider apiKey="AIzaSyAAbFGs6V2CpQdg-JmBDGUBSSGhNQfLyWc">
            {geocodingCoords ?
                <Map
                    style={{ width: '100%', height: '200px' }}
                    mapId="e92179a6932b473f"
                    defaultCenter={{ lat: geocodingCoords.lat + 0.002, lng: geocodingCoords.lng }}
                    defaultZoom={15}
                    gestureHandling="greedy"
                    options={{ disableDefaultUI: true }}
                >
                    <AdvancedMarker
                        clickable
                        onClick={() => { }}
                        position={{ lat: geocodingCoords.lat, lng: geocodingCoords.lng }}
                    >
                        <div className={`flex flex-col gap-4 max-w-[200px] w-[50vw] items-center ${isMsgVisible ? 'h-[121px]' : ''}`}>
                            {isMsgVisible ? (
                                <div className="w-full p-4 translate-y-[-20%] h-[100px] rounded-md shadow-absolute bg-white">
                                    <div className="mb-4 flex justify-end">
                                        <img onClick={() => setIsMsgVisible(false)} src={closeIcon} alt="close" className="cursor-pointer hover:scale-110" width="15" height="15" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-gray-750">Adres Wysyłki</p>
                                        <p className="mt-2 font-bold">{shipping.addressDetails.city}</p>
                                    </div>
                                </div>
                            ) : null}
                            <img
                                src={mapPinIcon}
                                onClick={() => setIsMsgVisible(!isMsgVisible)}
                                className="cursor-pointer"
                                width="20"
                                height="20"
                                style={isMsgVisible ? { transform: 'translateY(-100%)' } : {}}
                            />
                        </div>
                    </AdvancedMarker>
                </Map>
                : null}
        </APIProvider>
    )
}