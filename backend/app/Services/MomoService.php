<?php
// app/Services/MomoService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class MomoService
{
    private $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";


    public function createPayment(array $params)
    {
        $partnerCode = config('momo.partner_code');
        $accessKey = config('momo.access_key');
        $secretKey = config('momo.secret_key');
    
        $orderId = $params['orderId'] ?? time() . "";
        $requestId = $params['requestId'] ?? time() . "";
        $amount = $params['amount'];
        $orderInfo = $params['orderInfo'] ?? 'Thanh toán qua MoMo';
        $redirectUrl = $params['redirectUrl'];
        $ipnUrl = $params['ipnUrl'];
        $extraData = $params['extraData'] ?? '';
    
        $rawHash = "accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=captureWallet";
        $signature = hash_hmac("sha256", $rawHash, $secretKey);
    
        $payload = [
            'partnerCode' => $partnerCode,
            'partnerName' => "MoMoTest",
            'storeId'     => "MomoTestStore",
            'requestType' => "captureWallet",
            'ipnUrl'      => $ipnUrl,
            'redirectUrl' => $redirectUrl,
            'orderId'     => $orderId,
            'amount'      => $amount,
            'lang'        => 'vi',
            'orderInfo'   => $orderInfo,
            'requestId'   => $requestId,
            'extraData'   => $extraData,
            'signature'   => $signature
        ];
    
        $response = Http::withOptions([
            'verify' => false // ⚠️ BỎ QUA XÁC MINH SSL (chỉ dùng khi dev/test)
        ])->withHeaders([
            'Content-Type' => 'application/json',
        ])->post($this->endpoint, $payload);
    
        return $response->json();
    }
    
    // public function verifySignature($data): bool
    // {
    //     // TODO: Tạm thời bỏ qua việc kiểm tra chữ ký cho mục đích test.
    //     // Trong môi trường production, thực hiện kiểm tra chữ ký thật sự.
    //     return true;
    // }
    public function verifySignature($data): bool
{
    // Trong môi trường development, có thể tạm bỏ qua
    if (app()->environment('local')) {
        return true;
    }

    $secretKey = config('momo.secret_key');
    $rawHash = "accessKey=" . config('momo.access_key') . 
               "&amount=" . $data['amount'] . 
               "&extraData=" . ($data['extraData'] ?? '') . 
               "&message=" . $data['message'] . 
               "&orderId=" . $data['orderId'] . 
               "&orderInfo=" . $data['orderInfo'] . 
               "&partnerCode=" . $data['partnerCode'] . 
               "&payType=" . ($data['payType'] ?? '') . 
               "&requestId=" . $data['requestId'] . 
               "&responseTime=" . $data['responseTime'] . 
               "&resultCode=" . $data['resultCode'] . 
               "&transId=" . $data['transId'];

    $signature = hash_hmac('sha256', $rawHash, $secretKey);
    
    return $signature === $data['signature'];
}

    public function generateQrCode($payUrl)
    {
        return "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" . urlencode($payUrl);
    }
}
