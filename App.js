import './App.css';
import { BrowserRouter, Routes,Route } from "react-router-dom";
import Home from './components/home/Home';
import Header from './components/header/header';
import Signup from './components/Authentication/signup';
import Login from './components/Authentication/login';
import Billbook from './components/Billbook/billbook';
import Addbills from './components/addbills/addbills';
import Allbills from './components/addbills/allbills';
import Footer from './components/footer/footer';
import Customers from './components/customers/customers';
import Addcustomer from './components/addcustomer/addcustomer';
import Updatebills from './components/addbills/updatebill';
import Recyclebin from './components/recyclebin/recyclebin';
import Customerhistory from './components/customerhistory/customerhistory';
import Updatecustomer from './components/customers/updatecustomer';
import Paymentdues from './components/paymentdues/paymentdues';
import Account from './components/account/account';
import Customerinsights from './components/account/customerinsights';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      {/* <Header/> */}
      <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/Signup" element={<Signup/>} />
      <Route path="/Home" element={<Home/>} />
      <Route path="/billbook" element={<Billbook/>} />
      <Route path="/addbills/:id" element={<Addbills/>} />
      <Route path="/updatebill/:id" element={<Updatebills/>} />
      <Route path="/getallbills/:id" element={<Allbills/>} />
      <Route path="/customers" element={<Customers/>} />
      <Route path="/addcustomer" element={<Addcustomer/>} />
      <Route path="/recyclebin" element={<Recyclebin/>} />
      <Route path="/getcusomerhistory/:id" element={<Customerhistory/>} />
      <Route path="/updatemycustomer/:id" element={<Updatecustomer/>} />
      <Route path="/paymentdues" element={<Paymentdues/>} />
      <Route path="/account" element={<Account/>} />
      <Route path="/customerinsights" element={<Customerinsights/>} />

      
      </Routes>
      </BrowserRouter>
      {/* <Footer/> */}
    </div>
  );
}

export default App;
