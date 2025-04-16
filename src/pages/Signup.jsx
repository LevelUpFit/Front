import { useRef, useState } from "react";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [gender, setGender] = useState("male");
    const [birth, setBirth] = useState("");
    const [level, setLevel] = useState("high");

    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();
    const birthRef = useRef();

    const isPasswordValid =
        password.length >= 8 &&
        /[A-Za-z]/.test(password) &&
        /[0-9]/.test(password);

    const isPasswordMatch = password === confirm;

    const isFormValid = email && password && confirm && birth && isPasswordValid && isPasswordMatch;

    const handleSignup = () => {
        if (!email) return emailRef.current.focus();
        if (!password || !isPasswordValid) return passwordRef.current.focus();
        if (!confirm || !isPasswordMatch) return confirmRef.current.focus();
        if (!birth) return birthRef.current.focus();

        alert("회원가입 완료!");
    };

    return (
        <div className="flex flex-col items-center justify-center h-auto py-10 px-4 space-y-4">
            <div className="border-4 border-black rounded-full px-8 py-4 text-4xl font-black mb-6">
                LevelUpFit
            </div>

            <div className="w-full max-w-md space-y-4">
                {/* 이메일 */}
                <div className="flex space-x-2">
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="이메일을 입력해주세요"
                        className="flex-1 px-4 py-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="bg-black text-white px-3 py-2 rounded">중복확인</button>
                </div>

                {/* 비밀번호 */}
                <div>
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        className="w-full px-4 py-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {password && !isPasswordValid && (
                        <p className="text-sm text-red-500 mt-1">
                            비밀번호는 8자 이상, 숫자와 문자를 포함해야 합니다.
                        </p>
                    )}
                </div>

                {/* 비밀번호 확인 */}
                <div>
                    <input
                        ref={confirmRef}
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요"
                        className="w-full px-4 py-2 border rounded"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                    {confirm && !isPasswordMatch && (
                        <p className="text-sm text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
                    )}
                </div>

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
                    />
                </div>

                {/* 운동 경험 */}
                <div>
                    <div className="mb-1 font-semibold">운동 경험</div>
                    {["high", "mid", "low"].map((lv) => (
                        <label className="block" key={lv}>
                            <input
                                type="radio"
                                name="level"
                                value={lv}
                                checked={level === lv}
                                onChange={() => setLevel(lv)}
                            />
                            <span className="ml-1">{lv === "high" ? "상급" : lv === "mid" ? "중급" : "초급"}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
                onClick={handleSignup}
                disabled={!isFormValid}
                className={`w-full max-w-md py-4 text-xl font-bold mt-4 rounded ${
                    isFormValid
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                회원가입
            </button>
        </div>
    );
}
