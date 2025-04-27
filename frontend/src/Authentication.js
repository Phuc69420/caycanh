import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "./services/authService";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Authentication = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showGoogleForm, setShowGoogleForm] = useState(false);
    const [googleData, setGoogleData] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        username: '',
        password: '',
        password_confirmation: ''
    });

    useEffect(() => {
        setIsLogin(location.pathname !== "/dang-ky");
    }, [location]);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Get name and email from Google
            const decoded = jwtDecode(credentialResponse.credential);
            console.log('Google User Data:', decoded);
            
            // First try to login with Google credentials
            try {
                const loginResponse = await authService.googleLogin({
                    email: decoded.email,
                    name: decoded.name
                });

                if (loginResponse.thanh_cong) {
                    // User exists, login successful
                    toast.success('🎉 ' + loginResponse.thong_bao);
                    navigate('/');
                    return;
                }
            } catch (loginError) {
                // If 404, user doesn't exist - continue to registration form
                if (loginError.response?.status !== 404) {
                    // If any other error, show it and return
                    toast.error('❌ ' + (loginError.thong_bao || 'Đăng nhập thất bại'));
                    return;
                }
            }
            
            // If we get here, user doesn't exist - show registration form
            setGoogleData({
                email: decoded.email,
                name: decoded.name
            });
            setShowGoogleForm(true);
            
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('Đăng nhập Google thất bại');
        }
    };

    const handleGoogleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.phone || !formData.address) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.googleRegister({
                email: googleData.email,
                name: googleData.name,
                phone: formData.phone,
                address: formData.address
            });

            if (response.thanh_cong) {
                toast.success('🎉 ' + response.thong_bao);
                navigate('/');
            }
        } catch (error) {
            console.error('Google registration error:', error);
            if (error.loi) {
                Object.values(error.loi).forEach(messages => {
                    messages.forEach(message => toast.error(message));
                });
            } else {
                toast.error('❌ ' + (error.thong_bao || 'Đăng ký thất bại'));
            }
        } finally {
            setLoading(false);
        }
    };

    const validateField = (name, value) => {
        switch(name) {
            case 'username':
                return !value || value.length > 10 ? 'Tên đăng nhập không được để trống và tối đa 10 ký tự' : '';
            case 'password':
                return !value || value.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : '';
            case 'fullName':
                return !value || value.length > 100 ? 'Họ tên không được để trống và tối đa 100 ký tự' : '';
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !value || !emailRegex.test(value) || value.length > 100 ? 'Email không hợp lệ hoặc vượt quá 100 ký tự' : '';
            case 'phone':
                const phoneRegex = /^\d{10}$/;
                return !value || !phoneRegex.test(value) ? 'Số điện thoại phải có 10 chữ số' : '';
            case 'address':
                return !value || value.length > 255 ? 'Địa chỉ không được để trống và tối đa 255 ký tự' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));

        // Validate password confirmation
        if (name === 'password' || name === 'password_confirmation') {
            if (name === 'password' && formData.password_confirmation) {
                setErrors(prev => ({
                    ...prev,
                    password_confirmation: value !== formData.password_confirmation ? 'Mật khẩu xác nhận không khớp' : ''
                }));
            }
            if (name === 'password_confirmation') {
                setErrors(prev => ({
                    ...prev,
                    password_confirmation: value !== formData.password ? 'Mật khẩu xác nhận không khớp' : ''
                }));
            }
        } else {
            // Validate other fields on change
            const fieldError = validateField(name, value);
            if (fieldError) {
                setErrors(prev => ({
                    ...prev,
                    [name]: fieldError
                }));
            }
        }
    };

    const validateForm = (data) => {
        const errors = [];
        
        if (!data.username || data.username.length > 10) {
            errors.push('Tên đăng nhập không được để trống và tối đa 10 ký tự');
        }

        if (!data.password || data.password.length < 6) {
            errors.push('Mật khẩu phải có ít nhất 6 ký tự');
        }

        if (!isLogin) {
            if (!data.fullName || data.fullName.length > 100) {
                errors.push('Họ tên không được để trống và tối đa 100 ký tự');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email || !emailRegex.test(data.email) || data.email.length > 100) {
                errors.push('Email không hợp lệ hoặc vượt quá 100 ký tự');
            }

            const phoneRegex = /^\d{10}$/;
            if (!data.phone || !phoneRegex.test(data.phone)) {
                errors.push('Số điện thoại phải có 10 chữ số');
            }

            if (!data.address || data.address.length > 255) {
                errors.push('Địa chỉ không được để trống và tối đa 255 ký tự');
            }

            if (data.password !== data.password_confirmation) {
                errors.push('Xác nhận mật khẩu không khớp');
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Log form data before validation
        console.log('📝 Form Data:', {
            ...formData,
            password: '[HIDDEN]',
            password_confirmation: '[HIDDEN]'
        });

        const validationErrors = validateForm(formData);
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                console.log('🔒 Attempting login...');
                const response = await authService.dangNhap({
                    username: formData.username,
                    password: formData.password
                });

                if (response.thanh_cong) {
                    console.log('✅ Login successful, navigating to home...');
                    toast.success('🎉 ' + response.thong_bao);
                    navigate('/');
                }
            } else {
                console.log('📝 Attempting registration...');
                const response = await authService.dangKy(formData);
                
                if (response.thanh_cong) {
                    console.log('✅ Registration successful, navigating to login...');
                    toast.success('🎉 ' + response.thong_bao);
                    navigate('/dang-nhap');
                }
            }
        } catch (error) {
            console.error('❌ Form submission error:', {
                type: isLogin ? 'Login' : 'Registration',
                error: error
            });
            if (error.loi) {
                // Handle validation errors from backend
                Object.values(error.loi).forEach(messages => {
                    messages.forEach(message => toast.error(message));
                });
            } else {
                toast.error('❌ ' + (error.thong_bao || 'Có lỗi xảy ra'));
            }
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (name, label, type = "text", placeholder) => (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <input
                type={type}
                className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleInputChange}
            />
            {errors[name] && (
                <div className="invalid-feedback">
                    {errors[name]}
                </div>
            )}
        </div>
    );

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="shadow-lg rounded p-4" style={{ width: "400px", backgroundColor: "#fff" }}>
                <h3 className="text-center mb-4">
                    {showGoogleForm ? "Hoàn tất đăng ký" : (isLogin ? "Đăng nhập" : "Đăng ký")}
                </h3>

                {showGoogleForm ? (
                    <form onSubmit={handleGoogleFormSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={googleData.email}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Họ và tên</label>
                            <input
                                type="text"
                                className="form-control"
                                value={googleData.name}
                                disabled
                            />
                        </div>
                        {renderInput("phone", "Số điện thoại", "text", "Nhập số điện thoại")}
                        {renderInput("address", "Địa chỉ", "text", "Nhập địa chỉ")}
                        <button 
                            type="submit" 
                            className="btn btn-success w-100"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                        </button>
                    </form>
                ) : (
                    <>
                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
                                    {renderInput("fullName", "Họ và tên", "text", "Nhập họ và tên")}
                                    {renderInput("email", "Email", "email", "Nhập email")}
                                    {renderInput("phone", "Số điện thoại", "text", "Nhập số điện thoại")}
                                    {renderInput("address", "Địa chỉ", "text", "Nhập địa chỉ")}
                                </>
                            )}
                            {renderInput("username", "Tên đăng nhập", "text", "Nhập tên đăng nhập")}
                            {renderInput("password", "Mật khẩu", "password", "Nhập mật khẩu")}
                            {!isLogin && renderInput("password_confirmation", "Xác nhận mật khẩu", "password", "Nhập lại mật khẩu")}
                            
                            <button type="submit" className="btn btn-success w-100 mt-2" disabled={loading}>
                                {loading ? 'Đang xử lý...' : (isLogin ? "Đăng nhập" : "Đăng ký")}
                            </button>
                        </form>
                        <div className="text-center my-2">hoặc</div>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                toast.error('Đăng nhập Google thất bại');
                            }}
                        />
                    </>
                )}
                <div className="text-center mt-3">
                    {isLogin ? (
                        <>
                            <span>Chưa có tài khoản? </span>
                            <button
                                className="btn btn-link p-0"
                                style={{ fontWeight: "600", textDecoration: "none", color: "#28a745" }}
                                onClick={() => navigate('/dang-ky')}
                            >
                                Đăng ký ngay
                            </button>
                        </>
                    ) : (
                        <>
                            <span>Đã có tài khoản? </span>
                            <button
                                className="btn btn-link p-0"
                                style={{ fontWeight: "600", textDecoration: "none", color: "#28a745" }}
                                onClick={() => navigate('/dang-nhap')}
                            >
                                Đăng nhập ngay
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Authentication;