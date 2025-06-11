// AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";
import MyPage from "../pages/MyPage";
import FeedbackPage from "../pages/FeedbackPage";
import AccountPage from "../pages/AccountPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import MainPage from "../pages/MainPage";
import WorkoutList from "../pages/workout/WorkoutList";
import WorkoutSession from "../pages/workout/WorkoutSession";
import WorkoutSummary from "../pages/workout/WorkoutSummary";
import RoutineMain from "../pages/routine/RoutineMain";
import RoutineInfo from "../pages/routine/RoutineInfo";
import RoutineEditor from "../pages/routine/RoutineEditor";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/my" element={<MyPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/edit" element={<ChangePasswordPage />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/workout" element={<WorkoutList />} />
                <Route path="/workout/info/:routineId" element={<RoutineInfo />} />
                <Route path="/workout/group/:routineId" element={<WorkoutSession />} />
                <Route path="/workout/summary" element={<WorkoutSummary />} />
                <Route path="/routine" element={<RoutineMain />} />
                <Route path="/routine/edit/:id" element={<RoutineEditor />} />
            </Routes>
        </BrowserRouter>
    );
}
