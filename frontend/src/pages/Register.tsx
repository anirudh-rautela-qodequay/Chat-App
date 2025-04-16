import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";
import { requestFCMToken } from "../utils/firebase";
import API from "../api/Api_Config";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    setLoading(true);
    // console.log(values);
    // Not required to convert into form data as headers will handle it
    // const formData = new FormData();

    // Object.entries(values).forEach(([key, value]) => {
    //   // Only append if value is not undefined or null
    //   if (value !== undefined && value !== null) {
    //     formData.append(key, value);
    //   }
    // });
    try {
      const res = await API.Auth.Register({ data });
      if (res.status === 201) {
        message.success(res?.data?.message || "Successfully registered!");
        navigate("/login");
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          "Failed to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto mt-8">
      <Card title="Register" className="shadow-md min-w-[30vw]">
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input
              prefix={<User size={16} className="text-gray-400" />}
              placeholder="Enter your name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<Mail size={16} className="text-gray-400" />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<Lock size={16} className="text-gray-400" />}
              placeholder="Enter your password"
            />
          </Form.Item>
          <Form.Item
            label="Mobile Number"
            name="mobile_no"
            rules={[
              { required: true, message: "Please enter your mobile number!" },
              {
                pattern: /^\d{10}$/,
                message: "Mobile Number must be exactly 10 digits.",
              },
            ]}
          >
            <Input
              prefix={<Phone size={16} className="text-gray-400" />}
              placeholder="Enter your mobile number"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login now!
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
