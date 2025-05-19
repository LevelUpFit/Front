import { useRef, useState } from "react";
import BackButton from "../components/BackButton";
import useUserStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Signup() {
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isEmailAvailable, setIsEmailAvailable] = useState(null);
    const [checkingEmail, setCheckingEmail] = useState(false);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [gender, setGender] = useState("male");
    const [birth, setBirth] = useState("");
    const [level, setLevel] = useState("1");

    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();
    const birthRef = useRef();

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const checkEmailDuplication = async () => {
        if (!validateEmail(email)) {
            setIsEmailValid(false);
            return;
        }
        setCheckingEmail(true);
        try {
            const res = await fetch(`http://localhost:8080/api/check-email?email=${email}`);
            const data = await res.json();
            setIsEmailAvailable(data.available);
        } catch (e) {
            setIsEmailAvailable(false);
        }
        setCheckingEmail(false);
    };

    const isPasswordValid =
        password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    const isPasswordMatch = password === confirm;

    const isFormValid =
        email &&
        validateEmail(email) &&
        isEmailAvailable &&
        password &&
        confirm &&
        birth &&
        isPasswordValid &&
        isPasswordMatch;

    const handleSignup = async () => {
        if (!isFormValid) return;

        const signupData = {
            formUserDto: {
                userId: email,
                pwd: password,
            },
            userDto: {
                email,
                nickname: "NewUser", // 기본 닉네임 값 지정
                dob: birth,
                level: parseInt(level),
                gender,
                profile: "default/profile.png",
            },
        };

        try {
            const res = await fetch("http://localhost:8080/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            if (res.ok) {
                const result = await res.json();
                setUser(result);
                alert("회원가입 성공!");
                navigate("/home");
            } else {
                alert("회원가입 실패");
            }
        } catch (e) {
            alert("서버 연결 실패");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-auto py-10 px-4 space-y-4 relative">
            <BackButton />
            <img
                src={logo}
                alt="LevelUpFit"
                className="w-4/5 max-w-xs object-contain"
            />

            <div className="w-full max-w-md space-y-4">
                {/* 이메일 입력 + 중복확인 */}
                <div className="flex space-x-2">
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="이메일을 입력해주세요"
                        className="flex-1 px-4 py-2 border rounded"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailValid(true);
                            setIsEmailAvailable(null);
                        }}
                    />
                    <button
                        className="bg-black text-white px-3 py-2 rounded text-sm"
                        onClick={checkEmailDuplication}
                        disabled={checkingEmail}
                    >
                        {checkingEmail ? "확인 중..." : "중복확인"}
                    </button>
                </div>
                {!isEmailValid && email && (
                    <p className="text-sm text-red-500">이메일 형식이 올바르지 않습니다.</p>
                )}
                {isEmailAvailable === false && (
                    <p className="text-sm text-red-500">이미 존재하는 이메일입니다.</p>
                )}
                {isEmailAvailable === true && (
                    <p className="text-sm text-green-600">사용 가능한 이메일입니다.</p>
                )}

                {/* 비밀번호 */}
                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    className="w-full px-4 py-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {password && !isPasswordValid && (
                    <p className="text-sm text-red-500">
                        비밀번호는 8자 이상, 숫자와 문자를 포함해야 합니다.
                    </p>
                )}

                {/* 비밀번호 확인 */}
                <input
                    ref={confirmRef}
                    type="password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    className="w-full px-4 py-2 border rounded"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />
                {confirm && password !== confirm && (
                    <p className="text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
                )}

                {/* 성별 */}
                <div>
                    <div className="mb-1 font-semibold">성별</div>
                    <label className="mr-4">
                        <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={() => setGender("male")} />
                        <span className="ml-1">남성</span>
                    </label>
                    <label>
                        <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={() => setGender("female")} />
                        <span className="ml-1">여성</span>
                    </label>
                </div>

                {/* 생년월일 */}
                <div>
                    <div className="mb-1 font-semibold">생년월일</div>
                    <input
                        ref={birthRef}
                        type="date"
                        className="w-full px-4 py-2 border rounded"
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>

                {/* 운동 경험 */}
                <div>
                    <div className="mb-1 font-semibold">운동 경험</div>
                    {["1", "2", "3"].map((lv) => (
                        <label className="block" key={lv}>
                            <input
                                type="radio"
                                name="level"
                                value={lv}
                                checked={level === lv}
                                onChange={() => setLevel(lv)}
                            />
                            <span className="ml-1">
                                {lv === "1" ? "상급" : lv === "2" ? "중급" : "초급"}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
                onClick={handleSignup}
                disabled={!isFormValid}
                className={`w-full max-w-md py-4 text-xl font-bold mt-4 rounded ${
                    isFormValid ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                회원가입
            </button>
        </div>
    );
}
