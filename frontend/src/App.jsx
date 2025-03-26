import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/auth/Login";
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
import Register from "./pages/auth/RegisterCustomer";
// // user import start
 import UserList from "./pages/User/Customer/UserList";
// import AddUser from "./pages/User/AddUser";
// //import UpdateUser from "./pages/User/UpdateUser";
 import ViewCustomer from "./pages/User/Customer/ViewCustomer";
// // user import end

// role import start
 import RoleList from "./pages/User/Role/RoleList";
 import AddRole from "./pages/User/Role/AddRole";
 import UpdateRole from "./pages/User/Role/UpdateRole";
 import ViewRole from "./pages/User/Role/ViewRole";

// role import end

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
          <Route path="/" element={<Login />} />
          <Route path="/customer/register" element={<Register />} />
            {/* ------------Location Route Start-------- */}
            {/* province route start */}
            <Route path="/province" element={<ProvinceList />} />
            <Route path="/province/add" element={<AddProvince />} />
            <Route path="/province/update/:id" element={<UpdateProvince />} />
            <Route path="/province/view/:id" element={<ViewProvince />} />
            {/* province route end */}
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
            {/* ------------Location Route End-------- */}


            {/* user route start */}
            {/* <Route path="/user" element={<UserList />} /> */}
            {/* <Route path="/user/add" element={<AddUser />} /> */}
            {/* <Route path="/user/update/:id" element={<UpdateUser />} /> */}
            {/* <Route path="/user/view/:id" element={<ViewUser />} /> */}
            {/* user route end */}

             {/* role route start */}
               <Route path="/role" element={<RoleList/>} />
             {/* role route end */}
            
            {/* <Route path="/user" element={<Navigate to="/user" replace />} /> */}
            <Route path="/user" element={<UserList />} />
            <Route path="/user/view/:id" element={<ViewCustomer />} />
            <Route path="/role/add" element={<AddRole />} />
            <Route path="/role/update/:id" element={<UpdateRole />} />
            <Route path="/role/view/:id" element={<ViewRole />} />
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
