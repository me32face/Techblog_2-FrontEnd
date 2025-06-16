import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaSignOutAlt } from 'react-icons/fa';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import AdminLogin from './Components/ADMIN/AdminLogin';
import UserLogin from './Components/USER/UserLogin';
import Navbar from './Components/STATIC/Navbar';
import Home from './Components/Common-Pages/Home';
import UserRegistration from './Components/USER/UserRegistration';
import ViewUsers from './Components/ADMIN/ViewUsers';
import ForgotPassword from './Components/USER/ForgotPassword';
import Footer from './Components/STATIC/Footer';
import AllPosts from './Components/Common-Pages/AllPosts';
import NewPost from './Components/Common-Pages/NewPost';
import UserProfile from './Components/USER/UserProfile';
import SinglePost from './Components/Common-Pages/SinglePost';
import EditPost from './Components/Common-Pages/EditPost';
import AdminNavbar from './Components/ADMIN/AdminNavbar';
import ManagePosts from './Components/ADMIN/ManagePosts';
import AdminHome from './Components/ADMIN/AdminHome';
import CategoryBar from './Components/Common-Pages/CategoryBar';
import CategoryPosts from './Components/Common-Pages/CategoryPosts';
import CommentSection from './Components/Common-Pages/CommentSection';
import LikeDislikeButton from './Components/Common-Pages/LikeDislikeButton';
import SavedPosts from './Components/USER/SavedPosts';
import AuthorProfile from './Components/Common-Pages/AuthorProfile';
import LoadingScreen from './Components/STATIC/LoadingScreen';
import axios from 'axios';
import { useEffect, useState } from 'react';



function App() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/ping')
      .then(() => setIsLoading(false))
      .catch(() => {
        // retry every 2 seconds until the server responds
        const interval = setInterval(() => {
          axios.get(process.env.REACT_APP_API_URL + '/ping')
            .then(() => {
              clearInterval(interval);
              setIsLoading(false);
            });
        }, 2000);
      });
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <div>
        <Routes>

          <Route path='/AdminLogin' element={<AdminLogin/>}/>
          <Route path='/UserLogin' element={<UserLogin/>} />
          <Route path='/NavBar' element={<Navbar/>} />
          <Route path='/' element={<Home/>}/>
          <Route path='/User-Registration' element={<UserRegistration/>}/>
          <Route path='/ManageUsers' element={<ViewUsers/>}/>
          <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
          <Route path='/AllPosts' element={<AllPosts/>}/>
          <Route path='/NewPost' element={<NewPost/>}/>
          <Route path='/UserProfile' element={<UserProfile/>}/>
          <Route path="/post/:id" element={<SinglePost/>}/>
          <Route path="/EditPost/:id" element={<EditPost/>}/>
          <Route path='/ManagePosts' element={<ManagePosts/>}/>
          <Route path='/dashboard' element={<AdminHome/>}/>
          <Route path='/category-bar' element={<CategoryBar/>}/>
          <Route path='/category/:category' element={<CategoryPosts/>}/>
          <Route path='/comment' element={<CommentSection/>}/>
          <Route path='/saved' element={<SavedPosts/>}/>
          <Route path="/author/:authorId" element={<AuthorProfile/>}/>






        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
