import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/netflixx/search" element={<Search/>}/>
        <Route path="/netflixx/tv" element={<Tv/>}/>
        <Route path="/netflixx/tv/:tvId" element={<Tv/>}/>
        <Route path="/netflixx/movies/:movieId" element={<Home/>}/>
        <Route path="/netflixx" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
