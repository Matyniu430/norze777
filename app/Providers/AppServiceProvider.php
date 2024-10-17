<?php

namespace App\Providers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(Request $request): void
    {
        $this->deleteExpiredCarts();
        $this->getStripeCheckoutSession($request);
    }

    private function getStripeCheckoutSession(Request $request)
    {
        $customer_id = $request->cookie('customer_id');
        $checkout_session = $request->cookie('checkout_session');
        if ($customer_id && !$checkout_session) {
            $decrypted_customer_id = Crypt::decryptString($customer_id, false);
            $parts = explode('|', $decrypted_customer_id);
            $customer_id = isset($parts[1]) ? $parts[1] : null;
            $stripe = new \Stripe\StripeClient(env("STRIPE_SECRET"));
            $checkout_session = $stripe->checkout->sessions->all(
                [
                    'limit' => 1,
                    'customer' => $customer_id,
                    'status' => 'open'
                ]
            );
            if (count($checkout_session) > 0) {
                $checkout_session_cookie = cookie('checkout_session', $checkout_session->id, 0);
                return response()->noContent()->withCookie($checkout_session_cookie);
            }
        }
    }

    private function deleteExpiredCarts()
    {   
        $current_timestamp = now()->timestamp;
        $sessions = DB::table('sessions')->get();
        $carts = DB::table('carts')->get();
        $current_session_id = Session::getId();
        foreach ($sessions as $session) {
            if ($current_session_id === $session->id) {
                if ($session->last_activity + 604800 <= $current_timestamp) {
                    foreach ($carts as $cart) {
                        if ($cart->session_id === $session->id) {
                            Cart::where('id', $cart->id)->first()->delete();
                        }
                    }
                }
            }
        }
    }
}
