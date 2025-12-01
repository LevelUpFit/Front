// RoutineMain.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import armImg from "../../assets/arm.png";
import { getRoutine, getRoutineById, deleteRoutine } from "../../api/routine";
import useUserStore from "../../stores/userStore";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

function RoutineModal({
    isOpen,
    title,
    message,
    confirmText = "확인",
    cancelText,
    onConfirm,
    onCancel,
    variant = "default",
}) {
    if (!isOpen) return null;

    const confirmStyle =
        variant === "danger"
            ? "bg-red-600 hover:bg-red-500"
            : "bg-purple-600 hover:bg-purple-500";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-gray-900/95 p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm text-gray-300 whitespace-pre-line">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-white/10 transition"
                        >
                            {cancelText || "취소"}
                        </button>
                    )}
                    {onConfirm && (
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${confirmStyle}`}
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function RoutineMain() {
    const navigate = useNavigate();
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popupId, setPopupId] = useState(null); // 팝업 표시용
    const { getUserId } = useUserStore();
    const [modal, setModal] = useState({ isOpen: false });

    const fetchRoutines = async () => {
        const userId = getUserId();
        try {
            // 전체 루틴과 사용자 루틴 병합
            const [resAll, resUser] = await Promise.all([
                getRoutine(),
                userId ? getRoutineById(userId) : Promise.resolve({ data: { success: true, data: [] } })
            ]);
            
            const allRoutines = resAll.data?.success ? resAll.data.data : [];
            const userRoutines = resUser.data?.success ? resUser.data.data : [];
            
            // userId가 null이거나 로그인한 userId와 같은 루틴만 필터링
            const publicRoutines = allRoutines.filter(routine => 
                routine.userId === null || routine.userId === userId
            );
            
            // 중복 제거 (사용자 루틴 우선)
            const mergedRoutines = [...userRoutines];
            publicRoutines.forEach(routine => {
                if (!mergedRoutines.some(r => r.routineId === routine.routineId)) {
                    mergedRoutines.push(routine);
                }
            });
            
            setRoutines(mergedRoutines);
        } catch {
            setRoutines([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutines();
        // eslint-disable-next-line
    }, []);

    // 팝업 외부 클릭 시 닫기
    useEffect(() => {
        if (popupId === null) return;
        const handleClick = (e) => {
            // 팝업 또는 ...버튼이 아닌 곳 클릭 시 닫기
            if (
                !e.target.closest(".routine-popup") &&
                !e.target.closest(".routine-popup-btn")
            ) {
                setPopupId(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [popupId]);

    const closeModal = () => setModal({ isOpen: false });

    const showAlert = (title, message) => {
        setModal({
            isOpen: true,
            title,
            message,
            confirmText: "확인",
            onConfirm: closeModal,
        });
    };

    const handleDelete = (routineId) => {
        setModal({
            isOpen: true,
            title: "루틴 삭제",
            message: "정말 삭제하시겠습니까?",
            confirmText: "삭제",
            cancelText: "취소",
            variant: "danger",
            onCancel: closeModal,
            onConfirm: async () => {
                try {
                    await deleteRoutine(routineId);
                    setRoutines((prev) => prev.filter((r) => r.routineId !== routineId));
                    setPopupId(null);
                    closeModal();
                } catch (e) {
                    closeModal();
                    showAlert("삭제 실패", "삭제에 실패했습니다.");
                }
            },
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex min-h-[60vh] items-center justify-center text-gray-300">로딩 중...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            {modal.isOpen && <RoutineModal {...modal} />}
            <div className="space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-white">개인 루틴</h1>
                    <p className="text-sm text-purple-200">
                        나만의 루틴으로 다음 운동을 준비해 보세요.
                    </p>
                </div>
                {(!routines || routines.length === 0) ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-lg">
                        <img src={armImg} alt="muscle" className="h-24 w-24 opacity-80" />
                        <p className="mt-4 text-lg font-semibold text-white">나만의 루틴 생성하기</p>
                        <p className="mb-5 text-sm text-gray-300">
                            지금 루틴을 등록해 꾸준한 운동 루틴을 만들어 보세요.
                        </p>
                        <button
                            onClick={() => navigate("/routine/edit/new")}
                            className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-10 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                        >
                            + 시작
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4">
                            {routines
                                .slice()
                                .sort((a, b) => (a.exerciseOrder || 0) - (b.exerciseOrder || 0))
                                .map((routine) => (
                                    <div
                                        key={routine.routineId}
                                        className="relative flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-lg transition hover:border-purple-400"
                                        onClick={() => navigate(`/workout/info/${routine.routineId}`)}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
                                                {routine.thumbnailUrl ? (
                                                    <img
                                                        src={IMAGE_BASE_URL + routine.thumbnailUrl}
                                                        alt="thumb"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={armImg}
                                                        alt="default"
                                                        className="h-10 w-10 object-contain opacity-60"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="truncate text-lg font-bold text-white">{routine.name}</div>
                                                <div className="mt-1 text-sm text-purple-200 truncate">{routine.targetMuscle}</div>
                                            </div>
                                        </div>
                                        <button
                                            className="routine-popup-btn flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition hover:bg-white/20"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPopupId(popupId === routine.routineId ? null : routine.routineId);
                                            }}
                                        >
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                <circle cx="5" cy="12" r="2" fill="#FFFFFF" />
                                                <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
                                                <circle cx="19" cy="12" r="2" fill="#FFFFFF" />
                                            </svg>
                                        </button>
                                        {popupId === routine.routineId && (
                                            <div className="routine-popup absolute right-4 top-14 z-20 w-32 overflow-hidden rounded-xl border border-white/20 bg-gray-900/90 py-2 shadow-lg backdrop-blur-lg">
                                                <button
                                                    className="px-4 py-2 text-left text-sm text-gray-100 transition hover:bg-white/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPopupId(null);
                                                        navigate(`/routine/edit/${routine.routineId}`);
                                                    }}
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    className="px-4 py-2 text-left text-sm text-red-400 transition hover:bg-white/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(routine.routineId);
                                                    }}
                                                >
                                                    삭제
                                                </button>
                                                <div className="my-1 border-t border-white/10" />
                                                <button
                                                    className="px-4 py-2 text-left text-xs text-gray-400 transition hover:bg-white/5"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPopupId(null);
                                                    }}
                                                >
                                                    닫기
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                        <button
                            onClick={() => navigate("/routine/edit/new")}
                            className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-lg font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                        >
                            + 루틴 추가
                        </button>
                    </>
                )}
            </div>
        </Layout>
    );
}
