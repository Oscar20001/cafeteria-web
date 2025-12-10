'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalPayment() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-md mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-8 font-serif">Realizar Pago</h2>
        <p className="text-stone-600 mb-8">Paga tu consumo de forma segura con PayPal.</p>
        
        {/* 🔴 AQUÍ VA TU CLIENT ID DE PAYPAL */}
        {/* Reemplaza "test" con tu Client ID real que obtienes en developer.paypal.com */}
        <PayPalScriptProvider options={{ clientId: "test" }}>
            <PayPalButtons 
                style={{ layout: "vertical" }} 
                createOrder={(data, actions) => {
                    return actions.order.create({
                        intent: "CAPTURE", // Add the intent property
                        purchase_units: [
                            {
                                amount: {
                                    value: "10.00", // Example amount
                                    currency_code: "USD" // Add currency code
                                },
                            },
                        ],
                    });
                }}
            />
        </PayPalScriptProvider>
      </div>
    </section>
  );
}
