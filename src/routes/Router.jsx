import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";
import MyPage from "../pages/MyPage";
import FeedbackPage from "../pages/FeedbackPage";
import AccountPage from "../pages/AccountPage"; // ✅ 새로운 계정정보 컴포넌트
import ChangePasswordPage from "../pages/ChangePasswordPage"; // ✅ 비밀번호 변경

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/my" element={<MyPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/edit" element={<ChangePasswordPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
