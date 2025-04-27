<?php
// app/Http/Controllers/MomoPaymentController.php

    // app/Http/Controllers/MomoPaymentController.php
namespace App\Http\Controllers;

use App\Models\DonDatHang;
use App\Models\ThanhToanMomo;
use App\Services\MomoService;
use Illuminate\Http\Request;

class MomoPaymentController extends Controller
{
    protected $momo;

    public function __construct(MomoService $momo)
    {
        $this->momo = $momo;
    }

    public function createPayment(Request $request)
    {
        try {
            $orderId = $request->input('orderId');
            $amount = $request->input('amount');
    
            if (empty($orderId) || empty($amount)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Thiếu thông tin orderId hoặc amount'
                ], 400);
            }
    
            $data = $this->momo->createPayment([
                'orderId' => $orderId,
                'amount' => $amount,
                'redirectUrl' => route('momo.redirect'),
                'ipnUrl' => route('momo.ipn'),
                'orderInfo' => $request->input('orderInfo', 'Thanh toán đơn hàng ' . $orderId),
                'extraData' => '',
            ]);
    
            if (isset($data['payUrl'])) {
                return response()->json([
                    'status' => 'success',
                    'payUrl' => $data['payUrl'],
                ]);
            } elseif (isset($data['qrCodeUrl'])) {
                return response()->json([
                    'status' => 'success',
                    'qrCodeUrl' => $data['qrCodeUrl'],
                ]);
            }
    
            return response()->json([
                'status' => 'error',
                'message' => $data['message'] ?? 'Không lấy được payUrl từ MoMo.',
            ], 400);
    
        } catch (\Exception $e) {
            \Log::error('Create Payment Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }
    public function ipn(Request $request)
    {
        \DB::beginTransaction();
        try {
            \Log::info('IPN Data:', $request->all());
    
            if ($request->resultCode == 0) {
                $order = DonDatHang::findOrFail($request->orderId);
                
                // Cập nhật đơn hàng
                $order->update([
                    'phuong_thuc_thanh_toan' => 'QR_MOMO',
                    'tinh_trang_thanh_toan' => 'completed'
                ]);
    
                // Xử lý thời gian
                $responseTime = is_numeric($request->responseTime) 
                    ? \Carbon\Carbon::createFromTimestampMs($request->responseTime)
                    : $request->responseTime;
    
                // Lưu thanh toán
                $payment = ThanhToanMomo::create([
                    'ma_don_hang' => $order->ma_don_hang, // Sử dụng trực tiếp ID từ model
                    'trans_id' => $request->transId,
                    'amount' => $request->amount,
                    'request_id' => $request->requestId,
                    'result_code' => $request->resultCode,
                    'message' => $request->message,
                    'pay_type' => $request->payType ?? 'momo_wallet',
                    'signature' => $request->signature,
                    'response_time' => $responseTime,
                    'raw_data' => $request->all()
                ]);
    
                \DB::commit();
                \Log::info('Payment saved:', $payment->toArray());
            }
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('IPN Error: '.$e->getMessage());
            \Log::error('Stack Trace: '.$e->getTraceAsString());
        }
    }

// app/Http/Controllers/MomoPaymentController.php
        public function redirect(Request $request)
        {
            $frontendUrl = config('app.env') === 'local'    
                ? 'http://localhost:3000'
                : 'https://your-production-frontend.com';

            if ($request->get('resultCode') == 0) {
                return redirect()->to("{$frontendUrl}/thank-you?payment_status=success");
            } else {
                return redirect()->to("{$frontendUrl}/checkout?payment_status=failed");
            }
        }
            



}
