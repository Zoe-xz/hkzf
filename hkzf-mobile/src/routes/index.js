import { Navigate } from "react-router-dom"
import Home from "../pages/Home"
import CityList from "../pages/CityList"
import News from "../pages/News"
import Index from "../pages/Index"
import HouseList from "../pages/HouseList"
import Profile from "../pages/Profile"
import Map from "../pages/Map"

const routes = [
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: '/home',
        element: <Index />,
      },
      {
        path: 'news',
        element: <News />,
      },
      {
        path: 'houseList',
        element: <HouseList />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ]
  },
  {
    path: '/cityList',
    element: <CityList />
  },
  {
    path: '/map',
    element: <Map />
  },
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
]
export default routes