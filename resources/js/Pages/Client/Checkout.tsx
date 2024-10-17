import React from "react";
import { AddressElement, CustomCheckoutProvider, Elements, ExpressCheckoutElement, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ClientLayout from "@/Layouts/ClientLayout";
import { useWindowSize } from "@uidotdev/usehooks";

const stripePromise = loadStripe(
    'pk_test_51NYTo7JukPQOMVVVY2xgs54oYK3bsa6Hv1EBUg356mUyZ92LAA7569QL40Rr731nywtmkDoo9pCMRvXm3Cdlu4W700AZQHtmzA',{
    betas: ['custom_checkout_beta_3']
});

export default function Checkout() {
    const elementsOption = {
        mode: "payment",
        amount: 200,
        currency: "pln",
        appearance: {
            labels: 'floating',
        }
    }
    const size = useWindowSize();
    const width = size?.width || 0;
    return (
        <ClientLayout
            title="Realizacja Zakupu - Norze 777"
        >
            <main className="min-[1000px]:flex overflow-x-hidden">
                <div className="w-full flex flex-col min-[1000px]:items-end min-[1000px]:max-w-[50vw] min-[1000px]:border-r border-gray py-[2.6rem] gap-[1.4rem] tablet:px-[2.1rem]">
                    <section className="max-[1000px]:px-[1.5rem] min-[1000px]:min-w-[max(70%,440px)] pl-[3.8rem] min-[1000px]:max-w-[660px] flex flex-col gap-[2.6rem]">
                        <CustomCheckoutProvider stripe={stripePromise} options={{
                            clientSecret: ""
                        }}>
                        <Elements stripe={stripePromise} options={{
                            mode: "payment",
                            amount: 200,
                            currency: "pln",
                            appearance: {
                                labels: 'floating',
                                theme: 'flat',
                                variables: {
                                    borderRadius: '5px'
                                },
                                rules: {
                                    '.Input' : {
                                        'backgroundColor': "white",
                                        'border': "1px solid hsl(0, 0%, 87%)",
                                        'height': "50px"
                                    },
                                    '.Input:focus': {
                                        outline: 'none'
                                    }
                                }
                            }
                        }}>
                            <div>
                                <div className="flex flex-col justify-center items-center">
                                    <h2 className="text-[0.9rem] text-gray py-4">Ekspresowa realizacja Zakupu</h2>
                                    <ExpressCheckoutElement
                                        onConfirm={() => { }}
                                    />
                                </div>
                                <div className="flex justify-between items-center py-4">
                                    <hr className="w-[45%]"/>
                                    <p className="text-[0.9rem] text-gray">LUB</p>
                                    <hr className="w-[45%]"/>
                                </div>
                            </div>

                            <div>
                                <h2 className="font-bold text-[1.3rem] pb-[15px]">Kontakt</h2>
                                <AddressElement
                                    options={{
                                        mode: "shipping"
                                    }}
                                />
                            </div>
                        </Elements>
                        </CustomCheckoutProvider>
                    </section>
                </div>
                {width >= 1000 ?
                    <div className="bg-gray-02 w-[50vw] px-[2.1rem]">
                        <div className="py-[2.1rem] sticky w-[444px] top-0 flex flex-col gap-[2.6rem]">
                            <aside className="flex flex-col gap-[2.1rem]">
                                <div>
                                    <div className='flex flex-col gap-4'>

                                        <div className="flex items-center text-sm justify-between">
                                            <div className="flex items-center">
                                                <div className="border relative rounded-md border-gray w-[64px] h-[64px] flex justify-center">

                                                    <div className="absolute bg-black/60 rounded-full w-[25px] h-[25px] text-white text-sm flex items-center justify-center top-[-12.5px] right-[-12.5px]">

                                                    </div>
                                                </div>
                                                <div className="pl-[1.4rem]">
                                                    <p></p>
                                                    <p className="text-gray-750"></p>
                                                </div>
                                            </div>
                                            <p></p>
                                        </div>

                                    </div>
                                </div>
                                <div className="text-sm">
                                    <div className="flex justify-between">
                                        <span>Suma częściowa</span>
                                        <span>zł </span>
                                    </div>
                                    <div className="flex justify-between mt-[1.1rem]">
                                        <span>Wysyłka</span>
                                        <span>zł </span>
                                    </div>
                                    <div className="flex justify-between mt-[1.5rem]">
                                        <span className="font-bold text-[1.4rem]">Suma</span>
                                        <span>
                                            <div className="flex gap-[0.7rem] items-end">
                                                <abbr className="text-xs text-gray-750">PLN</abbr>
                                                <span className="font-bold text-[1.4rem]">zł</span>
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