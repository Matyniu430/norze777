import React, { useEffect } from 'react';
import ClientLayout from "@/Layouts/ClientLayout";
import confirmatioCheckIcon from "../../../assets/checkout-confirmation-checkmark.svg";
import Checkbox from "@/Components/Checkbox";
import { Link } from "@inertiajs/react";
import { CDN_URL, WEBSITE_URL } from "@/Constants/Consts";
import { useWindowSize } from "@uidotdev/usehooks";
import { formatNumber, getUrlPath } from "@/Utils/utils";
import CheckoutSuccessAddress from "@/Components/CheckoutSuccessAddress";
import CheckoutSuccessMap from "@/Components/CheckoutSuccessMap";

type CheckoutItem = {
    name: string,
    total: number,
    quantity: number,
    description: string,
    image: string
}

type ShippingAddressDetails = {
    city: string,
    country: string,
    line1: string,
    line2?: string,
    postal_code: string,
    state?: string,
    name: string
}

export type Shipping = {
    addressDetails: ShippingAddressDetails,
    cost: number,
    method: string
}

type Customer = {
    email: string,
    phone: string,
    id: string
}

interface Props {
    checkoutItems: CheckoutItem[],
    subtotal: number,
    total: number,
    shipping: Shipping,
    customer: Customer,
}

export default function CheckoutSucces({
    checkoutItems,
    subtotal,
    total,
    shipping,
    customer,
}: Props) {
    const size = useWindowSize();
    const width = size?.width || 0;
    return (
        <ClientLayout title="Potwierdzenie">
            <main className="min-[1000px]:flex overflow-x-hidden">
                <div className="w-full flex flex-col min-[1000px]:items-end min-[1000px]:max-w-[50vw] min-[1000px]:border-r border-gray py-[2.6rem] gap-[1.4rem] tablet:px-[2.1rem]">
                    <section className="max-[1000px]:px-[1.5rem] min-[1000px]:min-w-[max(70%,440px)] min-[1000px]:max-w-[700px] flex flex-col gap-[2.6rem]">
                        <div className="flex justify-start">
                            <div className="flex gap-[1.4rem]">
                                <img src={confirmatioCheckIcon} alt="" width="30" height="30" className="min-w-[3.5rem] min-h-[3.5rem]" />
                                <div>
                                    <p className="text-gray-750 text-[0.9rem]">Potwierdzenie #5251SADGA</p>
                                    <h2>{shipping.addressDetails.name}, Dziękujemy!</h2>
                                </div>
                            </div>
                        </div>
                        <div className="border border-gray rounded-md">
                            <CheckoutSuccessMap shipping={shipping} />
                            <div className="p-4 flex flex-col gap-4">
                                <h2 className="text-[1.1rem] font-bold">Twoje zamówienie zostało potwierdzone.</h2>
                                <span className="text-sm">Wkrótce otrzymasz e-mail z potwierdzeniem i numerem zamówienia.</span>
                            </div>
                            <div className="border-t border-gray flex items-center bg-gray-02 p-4">
                                <Checkbox className="focus:ring-blue-600 cursor-pointer" />
                                <label htmlFor="checkbox" className="pl-4 text-sm cursor-pointer" >Chcę otrzymywać e-maile z nowościami i ofertami</label>
                            </div>
                        </div>
                    </section>
                    <section className="max-[1000px]:px-[1.5rem] min-[1000px]:min-w-[max(70%,440px)] min-[1000px]:max-w-[700px]">
                        <div className="rounded-md w-full border border-gray p-4">
                            <h2 className="text-[1.1rem] font-bold">Szczegóły Zamówienia</h2>
                            <div className="flex gap-8 mt-4">
                                <div className="flex gap-4 flex-col">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-sm font-bold">Dane Kontaktowe</h3>
                                        <p className="text-sm">{customer.email}</p>
                                    </div>
                                    <CheckoutSuccessAddress heading="Adres Wysyłki">
                                        <>
                                            {shipping.addressDetails.name}
                                            <br />
                                            {shipping.addressDetails.line1}
                                            <br />
                                            {shipping.addressDetails.line2 ?
                                                <>{shipping.addressDetails.line2} <br /></> : null
                                            }
                                            {shipping.addressDetails.postal_code} {shipping.addressDetails.city}
                                            <br />
                                            {shipping.addressDetails.country}
                                            <br />
                                            {customer.phone}
                                        </>
                                    </CheckoutSuccessAddress>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-sm font-bold">Metoda Dostawy</h3>
                                        <p className="text-sm">{shipping.method}</p>
                                    </div>
                                </div>
                                <CheckoutSuccessAddress heading="Adres Rozliczeniowy">
                                    <>
                                        {shipping.addressDetails.name}
                                        <br />
                                        {shipping.addressDetails.line1}
                                        <br />
                                        {shipping.addressDetails.line2 ?
                                            <>{shipping.addressDetails.line2} <br /></> : null
                                        }
                                        {shipping.addressDetails.postal_code} {shipping.addressDetails.city}
                                        <br />
                                        {shipping.addressDetails.country}
                                    </>
                                </CheckoutSuccessAddress>
                            </div>
                        </div>
                    </section>
                    <section className="max-[1000px]:px-[1.5rem] min-[1000px]:min-w-[max(70%,440px)] min-[1000px]:max-w-[700px] flex flex-col justify-between gap-8 tablet:flex-row-reverse tablet:items-center">
                        <Link href={WEBSITE_URL} className="border border-gray font-bold rounded-md p-4 text-sm text-white text-center duration-100 block hover:bg-blue-800 bg-blue-600 w-full tablet:max-w-[180px]">Continue Shopping</Link>
                        <div>
                            <p className="text-[1rem] justify-center flex gap-4">
                                <span>Potrzebujesz pomocy?</span>
                                <span className="underline text-blue-600">
                                    <a href="mailto:mateuszrustowiczyt@gmail.com">Skontaktuj się</a>
                                </span>
                            </p>
                        </div>
                    </section>
                </div>
                {width >= 1000 ?
                    <div className="bg-gray-02 w-[50vw] px-[2.1rem]">
                        <div className="py-[2.1rem] sticky w-[444px] top-0 flex flex-col gap-[2.6rem]">
                            <aside className="flex flex-col gap-[2.1rem]">
                                <div>
                                    <div className='flex flex-col gap-4'>
                                        {checkoutItems.map((item, i) => (
                                            <div className="flex items-center text-sm justify-between" key={`${item}${i}`}>
                                                <div className="flex items-center">
                                                    <div className="border relative rounded-md border-gray w-[64px] h-[64px] flex justify-center">
                                                        <img src={`${CDN_URL}150xAUTO${getUrlPath(item.image).path}`} alt="delinium" className="object-contain max-w-[64px] min-h-[62px]" width="64px" height="64px" />
                                                        <div className="absolute bg-black/60 rounded-full w-[25px] h-[25px] text-white text-sm flex items-center justify-center top-[-12.5px] right-[-12.5px]">
                                                            {item.quantity}
                                                        </div>
                                                    </div>
                                                    <div className="pl-[1.4rem]">
                                                        <p>{item.name}</p>
                                                        <p className="text-gray-750">{item.description}</p>
                                                    </div>
                                                </div>
                                                <p>{formatNumber(item.total)} zł</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-sm">
                                    <div className="flex justify-between">
                                        <span>Suma częściowa</span>
                                        <span>zł {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mt-[1.1rem]">
                                        <span>Dostawa</span>
                                        <span>zł {shipping.cost ? shipping.cost.toFixed(2) : "DARMOWA"}</span>
                                    </div>
                                    <div className="flex justify-between mt-[1.5rem]">
                                        <span className="font-bold text-[1.4rem]">Łączna suma</span>
                                        <span>
                                            <div className="flex gap-[0.7rem] items-end">
                                                <abbr className="text-xs text-gray-750">PLN</abbr>
                                                <span className="font-bold text-[1.4rem]">zł {total.toFixed(2)}</span>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div> : null}
            </main>
        </ClientLayout>
    )
}