// RoutineMain.jsx
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import armImg from "../../assets/arm.png";

export default function RoutineMain() {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">개인 루틴</h1>

                <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center shadow">
                    <img src={armImg} alt="muscle" className="w-24 h-24"/>
                    <p className="text-lg font-semibold mb-2">나만의 루틴 생성하기</p>
                    <button
                        onClick={() => navigate("/routine/edit/new")}
                        className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full"
                    >
                        + 시작
                    </button>
                </div>
            </div>
        </Layout>
    );
}
