import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useUserStore from "../stores/userStore";
import Layout from "../components/Layout";

// 아이콘 컴포넌트
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

// 커스텀 확인 모달
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel, isDestructive }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm border border-white/10 shadow-2xl transform scale-100 animate-fadeIn">
                <h3 className="text-lg font-bold text-white mb-3">확인</h3>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 bg-white/10 rounded-xl font-semibold text-gray-300 hover:bg-white/20 transition">취소</button>
                    <button onClick={onConfirm} className={`flex-1 py-3 rounded-xl font-bold text-white transition ${isDestructive ? 'bg-red-600 hover:bg-red-500' : 'bg-purple-600 hover:bg-purple-500'}`}>
                        {isDestructive ? '탈퇴하기' : '확인'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function AccountPage() {
    const { user, clearUser } = useUserStore();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 사용자 닉네임 또는 이메일의 첫 글자 추출 (아바타용)
    const displayName = user?.nickname || user?.email || "게스트";
    const initial = displayName[0].toUpperCase();
    const profileImage = user?.profile;
    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

    return (
        <Layout>
            <div className="max-w-md mx-auto">
                {/* 1. 프로필 섹션 */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-1 mb-4 shadow-lg shadow-purple-500/30">
                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center border-2 border-white/10 overflow-hidden">
                            {profileImage ? (
                                <img 
                                    src={`${IMAGE_BASE_URL}${profileImage}`} 
                                    alt="프로필" 
                                    className="w-[138%] h-[138%] object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-white">{initial}</span>
                            )}
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">{displayName}</h2>
                </div>

                {/* 2. 메뉴 섹션 */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-2">계정 관리</h3>
                    
                    <div className="flex flex-col gap-3">
                        {/* 회원 정보 수정 */}
                        <button
                            onClick={() => navigate("/account/edit")}
                            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group backdrop-blur-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400 group-hover:text-blue-300 transition-colors">
                                    <EditIcon />
                                </div>
                                <span className="text-base font-semibold text-gray-200 group-hover:text-white">회원 정보 수정</span>
                            </div>
                            <ChevronRight />
                        </button>

                        {/* 로그아웃 */}
                        <button
                            onClick={() => {
                                clearUser();
                                navigate("/login");
                            }}
                            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group backdrop-blur-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 group-hover:text-purple-300 transition-colors">
                                    <LogoutIcon />
                                </div>
                                <span className="text-base font-semibold text-gray-200 group-hover:text-white">로그아웃</span>
                            </div>
                            <ChevronRight />
                        </button>

                        {/* 회원 탈퇴 */}
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-red-500/10 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all group backdrop-blur-md mt-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-red-500/20 rounded-xl text-red-400 group-hover:text-red-300 transition-colors">
                                    <TrashIcon />
                                </div>
                                <span className="text-base font-semibold text-gray-200 group-hover:text-red-200">회원 탈퇴</span>
                            </div>
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                {/* 3. 하단 앱 버전 정보 */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-500">LevelUpFit v1.0.0</p>
                </div>
            </div>

            {/* 탈퇴 확인 모달 */}
            <ConfirmModal 
                isOpen={showDeleteModal}
                message="정말 탈퇴하시겠습니까? 계정 정보와 모든 운동 기록이 삭제됩니다."
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    // TODO: 실제 회원 탈퇴 API 호출 필요
                    clearUser();
                    navigate("/login");
                }}
                isDestructive={true}
            />
        </Layout>
    );
}
