import React from "react";
import AdminCardContainer from "./AdminCardContainer";
import AdminCardField from "./AdminCardField";
import { formatNumber } from "@/Utils/utils";
import { OrderT } from "@/Pages/Admin/Orders/Index";

interface Props {
    order: OrderT
}

export default function AdminOrder({order} : Props) {
    return (
        <AdminCardContainer>
            <div className=" flex items-start w-full flex-wrap gap-x-8 gap-y-8 my-8 justify-between text-sm max-sm:flex-wrap">
                <div className="order-id-date">
                    <h3 className="font-bold">Order</h3>
                    <AdminCardField
                        fieldName="Id"
                        content={`#${order.id}`}
                    />
                    <AdminCardField
                        fieldName="Date"
                        content={order.date.display}
                    />
                </div>

                <div className="customer-info">
                    <h3 className="font-bold">Customer</h3>
                    <AdminCardField
                        fieldName="Email"
                        content={order.customer.email}
                    />
                    <AdminCardField
                        fieldName="Name"
                        content={order.customer.name}
                    />
                     <AdminCardField
                        fieldName="Phone Number"
                        content={order.customer.phone}
                    />
                </div>

                <div className="payment-info">
                    <h3 className="font-bold">Payment</h3>
                    <AdminCardField
                        fieldName="Total"
                        content={`zł ${formatNumber(order.payment.total)}`}
                    />
                    <AdminCardField
                        fieldName="Payment Status"
                        content={order.payment.status}
                    >
                        <button className={`${order.payment.status === 'paid' ? 'bg-[#affebf] text-[#014b40]' : 'bg-[#FFD6A4] text-[#5E4200]'} rounded-md py-0.5 px-2 border border-gray shadow-sm order-btn`}>{order.payment.status}</button>
                    </AdminCardField>
                </div>

                <div className="fulfillment-info">
                    <h3 className="font-bold">Fulfillment</h3>
                    <AdminCardField
                        fieldName="Fulfillment Status"
                        content={order.fulfillment.status ? "Fulfilled" : "Unfulfilled"}
                    >
                        <button className={`${order.fulfillment.status ? 'bg-[#affebf] text-[#014b40]' : 'bg-[#ffeb78] text-[#4f4700]'} rounded-md py-0.5 px-2 border border-gray shadow-sm order-btn"`}>{order.fulfillment.status ? "Fulfilled" : "Unfulfilled"}</button>
                    </AdminCardField>
                    <AdminCardField
                        fieldName="Delivery Method"
                        content={order.fulfillment.deliveryMethod}
                    />
                </div>
            </div>
        </AdminCardContainer>
    )
}