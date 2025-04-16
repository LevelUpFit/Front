import { useState } from "react";

export default function Signup() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const validatePassword = (pwd) => {
        const isValid =
            pwd.length >= 8 &&
            /[A-Za-z]/.test(pwd) &&
            /[0-9]/.test(pwd);

        if (!isValid) {
            setPasswordError("비밀번호는 8자 이상, 숫자와 문자를 포함해야 합니다.");
        } else {
            setPasswordError("");
        }

        setPassword(pwd);
    };

    const handleConfirm = (value) => {
        setConfirmPassword(value);
        setConfirmError(
            value !== password ? "비밀번호가 일치하지 않습니다." : ""
        );
    };

    return (
        <div className="flex flex-col items-center justify-center h-auto py-10 px-4 space-y-4">
            <div className="border-4 border-black rounded-full px-8 py-4 text-4xl font-black mb-6">
                LevelUpFit
            </div>

            <div className="w-full max-w-md space-y-4">
                <div className="flex space-x-2">
                    <input
                        type="email"
                        placeholder="이메일을 입력해주세요"
                        className="flex-1 px-4 py-2 border rounded"
                    />
                    <button className="bg-black text-white px-3 py-2 rounded">
                        중복확인
                    </button>
                </div>

                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => validatePassword(e.target.value)}
                        placeholder="비밀번호를 입력해주세요"
                        className="w-full px-4 py-2 border rounded"
                    />
                    {passwordError && (
                        <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => handleConfirm(e.target.value)}
                        placeholder="비밀번호를 다시 입력해주세요"
                        className="w-full px-4 py-2 border rounded"
                    />
                    {confirmError && (
                        <p className="text-sm text-red-500 mt-1">{confirmError}</p>
                    )}
                </div>

                <div>
                    <div className="mb-1 font-semibold">성별</div>
                    <label className="mr-4">
                        <input type="radio" name="gender" value="male" defaultChecked />
                        <span className="ml-1">남성</span>
                    </label>
                    <label>
                        <input type="radio" name="gender" value="female" />
                        <span className="ml-1">여성</span>
                    </label>
                </div>

                <div>
                    <div className="mb-1 font-semibold">생년월일</div>
                    <input type="date" className="w-full px-4 py-2 border rounded" />
                </div>

                <div>
                    <div className="mb-1 font-semibold">운동 경험</div>
                    <label className="block">
                        <input type="radio" name="level" value="high" defaultChecked />
                        <span className="ml-1">상급</span>
                    </label>
                    <label className="block">
                        <input type="radio" name="level" value="mid" />
                        <span className="ml-1">중급</span>
                    </label>
                    <label className="block">
                        <input type="radio" name="level" value="low" />
                        <span className="ml-1">초급</span>
                    </label>
                </div>
            </div>

            <button className="w-full max-w-md bg-gray-300 py-4 text-xl font-bold mt-4">
                회원가입
            </button>
        </div>
    );
}
