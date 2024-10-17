import AdminOrder from "@/Components/AdminOrder";
import AppLayout from "@/Layouts/AppLayout";
import React from "react";

type CustomerDetails = {
    email: string;
    name: string;
    phone: string;
};

type Payment = {
    total: number; 
    status: string;
};

type Fulfillment = {
    status: boolean;
    deliveryMethod: string;
};

export type OrderT = {
    date: {
        display: string;
        calendar: string;
    };
    id: string;
    customer: CustomerDetails;
    payment: Payment;
    fulfillment: Fulfillment;
};

interface Props {
    orders: OrderT[]
}

export default function Orders({orders} : Props) {
    return (
        <AppLayout
            title="Dashboard - Orders"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Orders
                </h2>
            )}
        >
            <div className="py-12 px-3 lg:px-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-y-6">
                    {orders.map((order,i) => (
                        <AdminOrder 
                            order={order}
                            key={`${order} ${i}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    )
}