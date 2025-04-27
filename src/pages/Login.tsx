import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTokenStore } from "@/store/useTokenStore";
import { useAuthStore } from "@/store/useAuthStore";
import tambuli_alert_logo from "@/assets/tambuli_alert_logo.png"
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { message } from 'antd';
import { BASE_URL } from "@/lib/urls";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const setToken = useTokenStore().setToken
    const setIsAuthenticated = useAuthStore().setIsAuthenticated

    const postLogin = async ({ email, password }: { email: string; password: string; }) => {
        const response = await fetch(`${BASE_URL}/api/user/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();
        return data.token;
    };


    const loginMutation = useMutation({
        mutationFn: postLogin,
        onSuccess: (token) => {
            setToken(token);
            setIsAuthenticated(true)
            messageApi.success("Welcome")
            navigate("/jvms/dashboard");
        },
        onError: (error) => {
            console.error("Login error:", error);
            messageApi.error(error.message || "Login Error")
        },
    });

    const handleLogin = () => {
        if (!emailRef.current || !passwordRef.current) return;

        loginMutation.mutate({
            email: emailRef.current.value,
            password: passwordRef.current.value,
        });

    };


    return (
        <>
            {contextHolder}
            <div className="bg-[url('/login.png')] bg-blue-500 bg-cover bg-center flex flex-col items-center justify-center gap-4 min-h-screen w-screen">
                <div className="bg-white p-14 rounded-xl flex flex-col gap-10 items-center justify-center w-[32rem] shadow-lg">
                    <div className="flex flex-col gap-3 items-center">
                        <div>
                            <img src={tambuli_alert_logo} alt="tambuli alert logo" />
                        </div>
                        <h2 className="font-semibold text-xl">Login Page</h2>
                        <p className="text-sm">Registered users can login to access the system.</p>
                    </div>
                    <div className="flex flex-col items-center w-full">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleLogin();
                            }}
                            className="flex flex-col w-full"
                        >
                            <input
                                placeholder="Username"
                                type="email"
                                id="username"
                                className="border rounded-md px-1.5 py-0.5 w-full mb-4 h-12 bg-[#EAEAEC]"
                                ref={emailRef}
                                required
                            />
                            <div className="relative w-full">
                                <input
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="border rounded-md px-1.5 py-0.5 w-full mb-7 h-12 bg-[#EAEAEC]"
                                    required
                                    minLength={5}
                                    ref={passwordRef}
                                />
                                <div
                                    className="absolute z-50 top-3.5 right-5"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setShowPassword(prev => !prev)
                                    }}>
                                    {
                                        showPassword ?
                                            <AiOutlineEyeInvisible size={20} /> :
                                            <AiOutlineEye size={20} />
                                    }
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="shadow w-full bg-black text-white rounded-lg hover:bg-gray-600 hover:text-white h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
