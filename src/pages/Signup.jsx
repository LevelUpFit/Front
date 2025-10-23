import { useRef, useState } from "react";
import BackButton from "../components/BackButton";
import useUserStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { checkEmail, signup } from "../api/auth";

export default function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isEmailAvailable, setIsEmailAvailable] = useState(null); // null, true, false
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [gender, setGender] = useState("male");
    const [birth, setBirth] = useState("");
    const [level, setLevel] = useState("3"); // 초급(3), 중급(2), 상급(1)

    const emailRef = useRef();

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const checkEmailDuplication = async () => {
        if (!validateEmail(email)) {
            setIsEmailValid(false);
            return;
        }
        setIsEmailValid(true);
        setCheckingEmail(true);
        try {
            const res = await checkEmail(email);
            if (!res.ok) {
                setIsEmailAvailable(true); // 서버 오류 시 이메일 사용 가능으로 처리
                setIsEmailChecked(true);
                emailRef.current && emailRef.current.setAttribute("disabled", "true");
            }
        } catch (e) {
            setIsEmailAvailable(false);
            setIsEmailChecked(false);
        } finally {
            setCheckingEmail(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setIsEmailValid(true);
        setIsEmailAvailable(null);
        setIsEmailChecked(false); // 이메일이 변경되면 중복 확인 상태 초기화
    };

    const isPasswordValid = password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    const isPasswordMatch = password === confirm;

    const isFormValid = validateEmail(email) && isEmailChecked && isPasswordValid && isPasswordMatch && birth;
    
    const handleSignup = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        const signupData = {
            email,
            pwd: password,
            gender,
            dob: birth,
            level: parseInt(level),
        };

        try {
            const res = await signup(signupData);
            console.log("회원가입 응답:", res);
            if (!res.data.success) {
                alert(`회원가입 실패: ${res.message || "알 수 없는 오류"}`);
                return;
            }
            if (res.data.success) {
                alert("회원가입 성공!");
                navigate("/login");
            }
        } catch (e) {
            alert("서버 연결 실패");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white p-4 font-sans">
            <BackButton />
            <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <header className="text-center mb-6">
                    <img src={logo} alt="LevelUpFit 로고" className="w-40 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">회원가입</h1>
                    <p className="text-gray-300 mt-2">몇 가지 정보만 알려주세요</p>
                </header>

                <form onSubmit={handleSignup} className="space-y-4">
                    {/* 이메일 */}
                    <div>
                        <div className="flex space-x-2">
                            <input
                                ref={emailRef}
                                type="email"
                                placeholder="이메일"
                                className="flex-1 pl-4 pr-4 py-3 bg-white/10 border border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isEmailChecked}
                            />
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${isEmailChecked ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                                onClick={checkEmailDuplication}
                                disabled={checkingEmail || !email || !validateEmail(email)}
                            >
                                {checkingEmail ? "확인중..." : isEmailChecked ? "✓" : "중복확인"}
                            </button>
                        </div>
                        {!isEmailValid && email && <p className="text-xs text-yellow-400 mt-1">이메일 형식이 올바르지 않습니다.</p>}
                        {isEmailAvailable === false && <p className="text-xs text-red-400 mt-1">이미 사용 중인 이메일입니다.</p>}
                        {isEmailAvailable === true && <p className="text-xs text-green-400 mt-1">사용 가능한 이메일입니다.</p>}
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <input type="password" placeholder="비밀번호" className="w-full px-4 py-3 bg-white/10 border border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {password && !isPasswordValid && <p className="text-xs text-yellow-400 mt-1">8자 이상, 영문과 숫자를 포함해야 합니다.</p>}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <input type="password" placeholder="비밀번호 확인" className="w-full px-4 py-3 bg-white/10 border border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                        {confirm && !isPasswordMatch && <p className="text-xs text-red-400 mt-1">비밀번호가 일치하지 않습니다.</p>}
                    </div>

                    {/* 성별 */}
                    <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setGender("male")} className={`py-3 rounded-lg font-bold transition ${gender === 'male' ? 'bg-purple-600' : 'bg-white/10'}`}>남성</button>
                        <button type="button" onClick={() => setGender("female")} className={`py-3 rounded-lg font-bold transition ${gender === 'female' ? 'bg-purple-600' : 'bg-white/10'}`}>여성</button>
                    </div>

                    {/* 생년월일 */}
                    <div>
                        <input type="date" className="w-full px-4 py-3 bg-white/10 border border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" value={birth} onChange={(e) => setBirth(e.target.value)} max={new Date().toISOString().split("T")[0]} style={{colorScheme: 'dark'}} />
                    </div>

                    {/* 운동 경험 */}
                    <div>
                        <label className="block mb-2 text-sm font-bold text-gray-300">운동 경험</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button type="button" onClick={() => setLevel("3")} className={`py-2 rounded-lg text-sm font-bold transition ${level === "3" ? 'bg-purple-600' : 'bg-white/10'}`}>
                                초급
                            </button>
                            <button type="button" onClick={() => setLevel("2")} className={`py-2 rounded-lg text-sm font-bold transition ${level === "2" ? 'bg-purple-600' : 'bg-white/10'}`}>
                                중급
                            </button>
                            <button type="button" onClick={() => setLevel("1")} className={`py-2 rounded-lg text-sm font-bold transition ${level === "1" ? 'bg-purple-600' : 'bg-white/10'}`}>
                                상급
                            </button>
                        </div>
                    </div>

                    {/* 회원가입 버튼 */}
                    <button type="submit" disabled={!isFormValid} className={`w-full py-3 text-lg font-bold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 mt-4 ${isFormValid ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg" : "bg-gray-700/50 text-gray-400 cursor-not-allowed"}`}>
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
}
