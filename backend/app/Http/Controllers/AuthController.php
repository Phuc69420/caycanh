<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\TaiKhoan;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    private function generateToken(User $user)
    {
        // Generate a Bearer token
        $token = 'Bearer ' . base64_encode(Str::random(60));
        
        // Store raw token without 'Bearer ' prefix
        Token::create([
            'user_id' => $user->id,
            'token' => str_replace('Bearer ', '', $token)
        ]);

        return $token;
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'username' => 'required|string|max:10|unique:taikhoan',
                'password' => 'required|string|min:6|confirmed',
                'name' => 'required|string|max:100',
                'email' => 'required|string|email|max:100|unique:user',
                'phone' => 'required|string|max:10',
                'address' => 'required|string|max:255'
            ]);

            DB::beginTransaction();

            // Log the request data (excluding password)
            Log::info('Registration attempt', [
                'username' => $request->username,
                'name' => $request->name,
                'email' => $request->email
            ]);

            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address
            ]);

            TaiKhoan::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'user_id' => $user->id
            ]);

            // Assign customer role (role_id = 1)
            DB::table('userrole')->insert([
                'user_id' => $user->id,
                'role_id' => 1 // Customer role
            ]);

            $token = $this->generateToken($user);

            DB::commit();

            return response()->json([
                'thanh_cong' => true,
                'thong_bao' => 'Đăng ký thành công',
                'du_lieu' => [
                    'user' => $user,
                    'token' => $token,
                    'role' => 'customer'
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Validation error', ['errors' => $e->errors()]);
            return response()->json([
                'thanh_cong' => false,
                'thong_bao' => 'Dữ liệu không hợp lệ',
                'loi' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'thanh_cong' => false,
                'thong_bao' => 'Đăng ký thất bại',
                'loi' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'username' => 'required|string',
                'password' => 'required|string'
            ]);

            // Log the login attempt (excluding password)
            Log::info('Login attempt', [
                'username' => $request->username
            ]);

            $taiKhoan = TaiKhoan::where('username', $request->username)->first();

            if (!$taiKhoan || !Hash::check($request->password, $taiKhoan->password)) {
                return response()->json([
                    'thanh_cong' => false,
                    'thong_bao' => 'Thông tin đăng nhập không chính xác'
                ], 401);
            }

            $user = $taiKhoan->user;
            $userRoles = $user->roles()->with(['controls' => function($query) {
                $query->where('invisible', 0);
            }])->get();

            $visibleControls = [];
            foreach ($userRoles as $role) {
                foreach ($role->controls as $control) {
                    $visibleControls[] = $control->control_name;
                }
            }

            $token = $this->generateToken($user);

            return response()->json([
                'thanh_cong' => true,
                'thong_bao' => 'Đăng nhập thành công',
                'du_lieu' => [
                    'user' => $user,
                    'token' => $token,
                    'roles' => $userRoles->pluck('role_name'),
                    'visible_controls' => array_unique($visibleControls)
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Login validation error', ['errors' => $e->errors()]);
            return response()->json([
                'thanh_cong' => false,
                'thong_bao' => 'Dữ liệu không hợp lệ',
                'loi' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'thanh_cong' => false,
                'thong_bao' => 'Đăng nhập thất bại',
                'loi' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $bearerToken = $request->bearerToken();
        if ($bearerToken) {
            Token::where('token', str_replace('Bearer ', '', $bearerToken))->delete();
        }

        return response()->json([
            'thanh_cong' => true,
            'thong_bao' => 'Đăng xuất thành công'
        ]);
    }

    public function handleGoogleLogin(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email',
                'name' => 'required|string'
            ]);

            // Check if user exists by email
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                // User doesn't exist, return name and email for registration form
                return response()->json([
                    'thanh_cong' => false,
                    'thong_bao' => 'Người dùng chưa đăng ký',
                    'du_lieu' => [
                        'email' => $request->email,
                        'name' => $request->name,
                        'require_additional_info' => true
                    ]
                ], 404);
            }

            // User exists, generate token and login
            $token = $this->generateToken($user);
            
            $userRoles = $user->roles()->with(['controls' => function($query) {
                $query->where('invisible', 0);
            }])->get();

            $visibleControls = [];
            foreach ($userRoles as $role) {
                foreach ($role->controls as $control) {
                    $visibleControls[] = $control->control_name;
                }
            }

            return response()->json([
                'thanh_cong' => true,
                'thong_bao' => 'Đăng nhập thành công',
                'du_lieu' => [
                    'user' => $user,
                    'token' => $token,
                    'roles' => $userRoles->pluck('role_name'),
                    'visible_controls' => array_unique($visibleControls)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Google login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'thanh_cong' => false,
                'thong_bao' => 'Đăng nhập thất bại',
                'loi' => $e->getMessage()
            ], 500);
        }
    }

    public function handleGoogleRegister(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email|max:100|unique:user',
                'name' => 'required|string|max:100',
                'phone' => 'required|string|max:10',
                'address' => 'required|string|max:255'
            ]);

            DB::beginTransaction();

            // Create user without taikhoan
            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address
            ]);

            // Assign customer role (role_id = 1)
            DB::table('userrole')->insert([
                'user_id' => $user->id,
                'role_id' => 1 // Customer role
            ]);

            // Generate bearer token
            $token = $this->generateToken($user);

            DB::commit();

            return response()->json([
                'thanh_cong' => true,
                'thong_bao' => 'Đăng ký thành công',
                'du_lieu' => [
                    'user' => $user,
                    'token' => $token,
                    'roles' => ['customer'],
                    'visible_controls' => []
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Google registration error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'thanh_cong' => false,
                'thong_bao' => 'Đăng ký thất bại',
                'loi' => $e->getMessage()
            ], 500);
        }
    }
}