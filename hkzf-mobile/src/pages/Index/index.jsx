import { useState, useEffect } from "react";
import { Swiper, Space, Grid } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav1 from "../../assets/images/nav-1.png";
import Nav2 from "../../assets/images/nav-2.png";
import Nav3 from "../../assets/images/nav-3.png";
import Nav4 from "../../assets/images/nav-4.png";
import "./index.scss";
import { getCurrentCity } from "../../utils";

export default function Index() {
  // // 获取地理位置信息
  // navigator.geolocation.getCurrentPosition((pos) => {
  //   console.log(pos);
  // });
  const navigate = useNavigate();
  // 轮播图状态数据
  const [swipers, setSwipers] = useState([]);
  // 租房小组的数据
  const [group, setGroups] = useState([]);
  // 最新资讯数据
  const [news, setNews] = useState([]);
  const [curCityName, setCurCityName] = useState("上海");

  const getSwipers = async () => {
    const res = await axios.get("http://localhost:8080/home/swiper");
    setSwipers(res.data.body);
  };

  const getGroups = async () => {
    const res = await axios.get("http://localhost:8080/home/groups", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    setGroups(res.data.body);
  };

  const getNews = async () => {
    const res = await axios.get("http://localhost:8080/home/news", {
      params: {
        area: "AREA%7C88cff55c-aaa4-e2e0",
      },
    });
    setNews(res.data.body);
  };

  useEffect(() => {
    getSwipers();
    getGroups();
    getNews();

    // 调用百度地图js api获取城市名称
    // const curCity = new window.BMapGL.LocalCity();
    // curCity.get(async (res) => {
    //   const result = await axios.get(
    //     `http://localhost:8080/area/info?name=${res.name}`
    //   );
    //   setCurCityName(result.data.body.label)
    // });
    getCurrentCity().then(res => {
      setCurCityName(res.label)
    })
  }, []);

  const items = swipers.map((item) => (
    <Swiper.Item key={item.id}>
      <img
        style={{ height: "212px" }}
        src={`http://localhost:8080${item.imgSrc}`}
        alt={item.alt}
      />
    </Swiper.Item>
  ));

  const navs = [
    {
      id: 1,
      img: Nav1,
      title: "整租",
      path: "houseList",
    },
    {
      id: 2,
      img: Nav2,
      title: "合租",
      path: "list",
    },
    {
      id: 3,
      img: Nav3,
      title: "地图找房",
      path: "/map",
    },
    {
      id: 4,
      img: Nav4,
      title: "去出租",
      path: "rent",
    },
  ];
  const Nav = navs.map((item) => (
    <Space
      direction="vertical"
      align="center"
      key={item.id}
      onClick={() => navigate(item.path)}
    >
      <img src={item.img} alt="" />
      <span>{item.title}</span>
    </Space>
  ));

  const Group = group.map((item) => (
    <Grid.Item key={item.id}>
      <Space className="group-item" justify="around">
        <div className="desc">
          <p className="group-title">{item.title}</p>
          <span className="info">{item.desc}</span>
        </div>
        <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
      </Space>
    </Grid.Item>
  ));

  const News = news.map((item) => (
    <div className="news-item" key={item.id}>
      <div className="imgwrap">
        <img
          className="img"
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
        />
      </div>
      <Space className="content" direction="vertical" justify="between">
        <h3 className="title">{item.title}</h3>
        <Space className="info" justify="between">
          <span>{item.from}</span>
          <span>{item.date}</span>
        </Space>
      </Space>
    </div>
  ));

  return (
    <div className="index">
      {/* 轮播图区域 */}
      <div className="swiper">
        {swipers.length !== 0 ? (
          <Swiper autoplay loop autoplayInterval={5000}>
            {items}
          </Swiper>
        ) : (
          ""
        )}

        {/* 搜索框 */}
        <Space className="search-box" align="center">
          {/* 左侧白色区域 */}
          <Space className="search">
            {/* 位置 */}
            <div className="location" onClick={() => navigate("/citylist")}>
              <span className="name">{curCityName}</span>
              <i className="iconfont icon-arrow" />
            </div>

            {/* 搜索表单 */}
            <div className="form" onClick={() => navigate("/search")}>
              <i className="iconfont icon-seach" />
              <span className="text">请输入小区或地址</span>
            </div>
          </Space>
          {/* 右侧地图图标 */}
          <i className="iconfont icon-map" onClick={() => navigate("/map")} />
        </Space>
      </div>

      {/* 导航区域 */}
      <Space className="nav" justify="around">
        {Nav}
      </Space>

      {/* 租房小组 */}
      <div className="group">
        <h3 className="title">
          租房小组
          <span className="more">更多</span>
        </h3>

        {/* Grid区域 */}
        <Grid columns={2} gap={8}>
          {Group}
        </Grid>
      </div>

      {/* 最新资讯 */}
      <div className="news">
        <h3 className="group-title">最新资讯</h3>
        {News}
      </div>
    </div>
  );
}
