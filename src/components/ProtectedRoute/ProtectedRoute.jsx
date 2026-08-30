import { useSelector } from "react-redux";
import { sessionStatusSelector } from "../../store/userSlice";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../Loader/Loader";

export default function ProtectedRoute({ children }) {
    const sessionStatus = useSelector(sessionStatusSelector);
    const location = useLocation();

    if (sessionStatus === "idle" || sessionStatus === "checking") {
        return (
            <div>
                <Loader />
                <p>Loading...</p>
            </div>
        )
    }

    if (sessionStatus !== "authenticated") {
        return (
            <Navigate 
                to="/log-in"
                replace
                state={{ from: location }}
            />
        )
    }

    return children;
}