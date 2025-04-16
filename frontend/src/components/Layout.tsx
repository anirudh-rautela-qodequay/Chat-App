import React, { useEffect    } from "react";
import { Layout as AntLayout, Menu, message, Switch } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import {
   
  LogIn,
  UserPlus,
  Home,
  LogOut,
  DogIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAppTheme } from "../contexts/ThemeContext";
import API from "../api/Api_Config";
// import { Footer } from "antd/es/layout/layout";

const { Header, Content } = AntLayout;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const handleAuthError = () => {};

    // const handleServiceUnavailableError = () => {
    //   return <ServiceUnavailable />;
    // };
    window.addEventListener("authError", (e) => {
      const event = e as CustomEvent<string>;
      console.log("Auth error occurred:", event.detail);
      message.error(
        event.detail || "You dont have permissions to visit this page"
      );
      setCurrentUser(null);
      //  window.location.href = "/login";
      navigate("/login");
      // maybe redirect to login or show a message
    });

    // window.addEventListener("authError", handleAuthError);
    // window.addEventListener(
    //   "serviceUnavailableError",
    //   handleServiceUnavailableError
    // );

    return () => {
      window.removeEventListener("authError", handleAuthError);
      window.removeEventListener("serviceUnavailableError", handleAuthError);
    };
  }, []);
  const handleLogout = async () => {
    try {
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
 
  const { theme, updateTheme } = useAppTheme();
  return (
    <AntLayout className={`max-h-screen min-h-screen ${theme}`}>
      <Header className="flex items-center justify-between px-4 bg-my_bg    ">
        <div className="text-white text-xl font-bold">
          <Link to="/" className="text-my_text_color hover:text-gray-300">
            Chat App
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span>🌞</span>
          <Switch
            checked={theme === "dark"}
            onChange={() => updateTheme(theme === "light" ? "dark" : "light")}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
          <span>🌙</span>
          <Menu
            theme={theme}
            mode="horizontal"
            overflowedIndicator={
              <DownOutlined className="text-my_text_color" />
            }
            className="flex-1 justify-end bg-my_bg text-my_text_color border-b-0"
            items={[
              {
                key: "home",
                icon: <Home className="text-my_text_color" size={16} />,
                label: (
                  <Link className="text-my_text_color" to="/">
                    Home
                  </Link>
                ),
              },
              ...(currentUser
                ? [
                    // {
                    //   key: "create",
                    //   icon: <PenSquare size={16} />,
                    //   label: <Link to="/create-post">Create Post</Link>,
                    // },
                    {
                      key: "logout",
                      icon: <LogOut className="text-my_text_color" size={16} />,
                      label: (
                        <Link
                          to="#"
                          onClick={handleLogout}
                          className="text-my_text_color"
                        >
                          Logout
                        </Link>
                      ),
                    },
                   
                  ]
                : [
                    {
                      key: "login",
                      icon: <LogIn className="text-my_text_color" size={16} />,
                      label: (
                        <Link className="text-my_text_color" to="/login">
                          Login
                        </Link>
                      ),
                    },
                    {
                      key: "register",
                      icon: (
                        <UserPlus className="text-my_text_color" size={16} />
                      ),
                      label: (
                        <Link className="text-my_text_color" to="/register">
                          Register
                        </Link>
                      ),
                    },
                  ]),
            ]}
          />
        </div>
      </Header>
      <Content className=" flex bg-my_bg overflow-y-auto">
        <div className=" flex flex-1 ">{children}</div>
      </Content>
      {/* <Footer>sd</Footer> */}
    </AntLayout>
  );
};

export default Layout;
