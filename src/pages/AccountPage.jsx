import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import Layout from "../components/Layout";

export default function AccountPage() {
    const { user, logout, deleteAccount } = useUserStore();
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="px-6 py-4">
                <h2 className="text-2xl font-bold mb-4">내 계정</h2>

                <div className="mb-4 space-y-2 text-lg">
                    <div className="flex justify-between">
                        <span className="font-semibold">이메일</span>
                        <span className="font-bold">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">유저 코드</span>
                        <span className="font-bold">{user?.code}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold mt-6 mb-3">계정 관리</h3>

                <ul className="space-y-3 text-lg font-semibold">
                    <li
                        className="cursor-pointer"
                        onClick={() => navigate("/account/edit")}
                    >
                        회원 정보 수정
                    </li>
                    <li
                        className="cursor-pointer"
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        로그아웃
                    </li>
                    <li
                        className="cursor-pointer text-red-600"
                        onClick={() => {
                            if (confirm("정말 탈퇴하시겠습니까?")) {
                                deleteAccount();
                                navigate("/");
                            }
                        }}
                    >
                        회원 탈퇴
                    </li>
                </ul>
            </div>
        </Layout>
    );
}
