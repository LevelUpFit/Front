import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import Layout from "../components/Layout";

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const handleChangePassword = () => {
        if (newPassword !== newPasswordConfirm) {
            alert("신규 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!isValidPassword(newPassword)) {
            alert("비밀번호는 영문+숫자 조합 8자 이상이어야 합니다.");
            return;
        }

        // TODO: 비밀번호 변경 API 연동
        alert("비밀번호가 변경되었습니다.");
        navigate("/mypage");
    };

    function isValidPassword(pw) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(pw);
    }

    return (
        <Layout>
            <div className="px-6 py-4">
                <p className="font-bold text-lg mb-2">이메일</p>
                <p className="text-xl font-bold mb-4">{user?.email}</p>

                <h2 className="text-2xl font-bold mb-4">비밀번호 변경</h2>

                <div className="mb-3">
                    <p className="font-semibold mb-1">기존 비밀번호</p>
                    <input
                        type="password"
                        placeholder="기존 비밀번호를 입력해주세요"
                        className="w-full p-3 rounded"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <p className="font-semibold mb-1">신규 비밀번호</p>
                    <input
                        type="password"
                        placeholder="신규 비밀번호를 입력해주세요"
                        className="w-full p-3 rounded"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="신규 비밀번호를 다시 입력해주세요"
                        className="w-full p-3 rounded"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleChangePassword}
                    className="w-full py-3 bg-white text-xl font-bold rounded"
                >
                    변경하기
                </button>
            </div>
        </Layout>
    );
}
