// src/pages/Login.jsx
import { useState } from "react";

export default function Login() {
    const [rememberId, setRememberId] = useState(true);

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4">
            <div className="border-4 border-black rounded-full px-8 py-4 text-4xl font-black">
                LevelUpFit
            </div>

            <input
                type="text"
                placeholder="아이디를 입력해주세요"
                className="w-full max-w-md px-4 py-3 border rounded-lg text-gray-700"
            />

            <label className="flex items-center space-x-2 text-gray-700 w-full max-w-md">
                <input
                    type="checkbox"
                    checked={rememberId}
                    onChange={() => setRememberId(!rememberId)}
                    className="w-5 h-5"
                />
                <span>아이디 저장</span>
            </label>

            <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className="w-full max-w-md px-4 py-3 border rounded-lg text-gray-700"
            />

            <button className="w-full max-w-md bg-gray-300 py-4 text-xl font-bold">
                로그인
            </button>
        </div>
    );
}
