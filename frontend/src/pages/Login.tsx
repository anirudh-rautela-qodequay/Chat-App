import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Radio } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Phone } from "lucide-react";
import API from "../api/Api_Config";
import { useAuth } from "../contexts/AuthContext";
import { requestFCMToken } from "../utils/firebase";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fcm_token, setFcm_token] = useState<string>("");
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const token = await requestFCMToken();
        console.log("Fcm token", token);
        setFcm_token(token);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchFcmToken();
  }, []);
  const onFinish = async (data: {
    email: string;
    password: string;
    fcm_token: string;
  }) => {
    // console.log(data)
    data.fcm_token = fcm_token;
    setLoading(true);
    try {
      const res = await API.Auth.Login({ data });
      if (res.status === 200) {
        localStorage.setItem("ChatAppToken", res?.data?.data?.token);
        setCurrentUser(res?.data?.data);
        message.success(res?.data?.message || "Successfully logged in!");
        navigate("/");
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          "Failed to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };
  const [loginType, setLoginType] = useState<"email" | "mobile">("email");
  return (
    <div className=" mx-auto mt-8">
      <Card title="Login" className="shadow-md min-w-[30vw]">
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Login With">
            <Radio.Group
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="email">Email</Radio.Button>
              <Radio.Button value="mobile">Mobile No</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* Email Field */}
          {loginType === "email" && (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<Mail size={16} className="text-gray-400" />}
                placeholder="Enter your email"
              />
            </Form.Item>
          )}

          {/* Mobile Field */}
          {loginType === "mobile" && (
            <Form.Item
              label="Mobile Number"
              name="mobile_no"
              rules={[
                { required: true, message: "Please input your mobile number!" },
                {
                  pattern: /^\d{10}$/,
                  message: "Mobile number must be exactly 10 digits.",
                },
              ]}
            >
              <Input
                prefix={<Phone size={16} className="text-gray-400" />}
                placeholder="Enter your mobile number"
                maxLength={10}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<Lock size={16} className="text-gray-400" />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log in
            </Button>
          </Form.Item>

          <div className="text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600">
              Register now!
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
