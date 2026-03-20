import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SGPA from "./pages/SGPA";
import CGPA from "./pages/CGPA";
import RequiredESE from "./pages/RequiredESE";
import ExpectedGrade from "./pages/ExpectedGrade";

function App() {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sgpa" element={<SGPA />} />
          <Route path="/cgpa" element={<CGPA />} />
          <Route path="/required-ese" element={<RequiredESE />} />
          <Route path="/expected-grade" element={<ExpectedGrade />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
