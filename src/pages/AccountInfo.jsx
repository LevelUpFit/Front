import useUserStore from "../stores/userStore";
import Layout from "../components/Layout";

export default function AccountInfo() {
    const { user, clearUser } = useUserStore();

    return (
        <Layout>
            {/* 내 계정 정보 */}
            <div className="text-left px-6"> {/* ← 좌우 여백 추가 */}
                <h2 className="text-2xl font-bold mb-4">내 계정</h2>
                <div className="space-y-2 font-semibold">
                    <div className="flex justify-between">
                        <span>이메일</span>
                        <span className="text-black">{user?.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>유저 코드</span>
                        <span className="text-black">w8t6y3</span>
                    </div>
                </div>
            </div>

            <div className="text-left px-6 mt-6"> {/* ← 위 여백과 좌우 여백 추가 */}
                <h2 className="text-2xl font-bold mb-4">계정 관리</h2>
                <div className="space-y-4 font-semibold">
                    <button className="w-full text-left">회원 정보 수정</button>
                    <button className="w-full text-left" onClick={clearUser}>로그아웃</button>
                    <button className="w-full text-left text-red-600">회원 탈퇴</button>
                </div>
            </div>

        </Layout>
    );
}
