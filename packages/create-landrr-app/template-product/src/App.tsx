import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";

interface AppProps {
  initialRouteData?: Record<string, Record<string, unknown>>;
}

export default function App({ initialRouteData = {} }: AppProps) {
  const location = useLocation();
  const routeData = initialRouteData[location.pathname] ?? {};

  return (
    <Routes>
      <Route path="/" element={<Home serverData={routeData} />} />
      <Route path="/about" element={<About serverData={routeData} />} />
      <Route path="/product" element={<Product serverData={routeData} />} />
    </Routes>
  );
}
