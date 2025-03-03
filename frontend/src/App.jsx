import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
 import NotFound from "./pages/NotFound"; // Make sure NotFound is imported
import ProvinceList from "./pages/Location/Province/ProvinceList";
import AddProvince from "./pages/Location/Province/AddProvince";
import UpdateProvince from "./pages/Location/Province/UpdateProvince";
import ViewProvince from "./pages/Location/Province/ViewProvince";
import AddDistrict from "./pages/Location/District/AddDistrict";
import UpdateDistrict from "./pages/Location/District/UpdateDistrict";
import ViewDistrict from "./pages/Location/District/ViewDistrict";
import AddCity from "./pages/Location/City/AddCity";
import UpdateCity from "./pages/Location/City/UpdateCity";
import ViewCity from "./pages/Location/City/ViewCity";

const AppRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : ""
        }`}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="pt-0">
          <Routes>
            {/* location route start */}
          <Route path="/province" element={<ProvinceList />} />
          <Route path="/province/add" element={<AddProvince />} />
          <Route path="/province/update/:id" element={<UpdateProvince />} />
          <Route path="/province/view/:id" element={<ViewProvince />} />
          {/* location route end */}
          {/* District route start */}
          <Route path="/district/add" element={<AddDistrict />} />
          <Route path="/district/update/:id" element={<UpdateDistrict />} />
          <Route path="/district/view/:id" element={<ViewDistrict />} />
          {/* District route end */}
          {/* City route start */}
          <Route path="/city/add" element={<AddCity />} />
          <Route path="/city/update/:id" element={<UpdateCity />} />
          <Route path="/city/view/:id" element={<ViewCity />} />
          {/* City route end */}
            <Route path="/" element={<Navigate to="/user" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
