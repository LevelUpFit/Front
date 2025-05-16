import Menubar from "./Menubar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {children}
            <Menubar />
        </div>
    );
}