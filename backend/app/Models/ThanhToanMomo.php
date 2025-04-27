<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ThanhToanMomo extends Model
{
    protected $table = 'thanhtoanmomo';

    protected $fillable = [
        'ma_don_hang',
        'trans_id',
        'amount',
        'request_id',
        'result_code',
        'message',
        'pay_type',
        'signature',
        'response_time',
        'raw_data'
    ];

    protected $casts = [
        'raw_data' => 'array',  // Tự động chuyển đổi JSON sang mảng
        'response_time' => 'datetime'
    ];

    /**
     * Liên kết với đơn hàng
     */
    public function donDatHang(): BelongsTo
    {
        return $this->belongsTo(DonDatHang::class, 'ma_don_hang', 'ma_don_hang');
    }

    public function setResponseTimeAttribute($value)
    {
        $this->attributes['response_time'] = is_numeric($value)
            ? \Carbon\Carbon::createFromTimestampMs($value)
            : $value;
    }
}
