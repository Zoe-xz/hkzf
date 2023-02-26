import { useEffect, useState } from "react";
import axios from "axios";
import NavHeader from "../../components/NavHeader";
import "./index.scss";
import { Toast } from "antd-mobile";

// 覆盖物样式
const labelStyle = {
  cursor: "pointer",
  border: "0px solid rgb(255, 0, 0)",
  padding: "0px",
  whiteSpace: "nowrap",
  fontSize: "12px",
  color: "rgb(255, 255, 255)",
  textAlign: "center",
};

export default function Map() {
  // 获取当前定位城市
  const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));
  let map = null;
  useEffect(() => {
    map = initMap();
  }, []);

  const initMap = () => {
    // 初始化地图实例
    const map = new window.BMapGL.Map("container");

    //创建地址解析器实例
    const myGeo = new window.BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async (point) => {
        if (point) {
          // 初始化地图，同时设置展示级别
          map.centerAndZoom(point, 11);

          // 添加控件
          const scaleCtrl = new window.BMapGL.ScaleControl(); // 添加比例尺控件
          map.addControl(scaleCtrl);
          const zoomCtrl = new window.BMapGL.ZoomControl(); // 添加缩放控件
          map.addControl(zoomCtrl);

          renderOverlays(value);
        } else {
          alert("您选择的地址没有解析到结果！");
        }
      },
      label
    );

    // 给地图绑定移动事件
    map.addEventListener("movestart", () => {
      if (isShowList) {
        setIsShowList(false);
      }
    });
    return map;
  };

  const renderOverlays = async (id) => {
    Toast.show({
      icon: "loading",
      content: "加载中…",
      duration: 0,
    });
    // 获取房源信息
    const res = await axios.get(`http://localhost:8080/area/map?id=${id}`);
    Toast.clear();
    // 调用方法获取级别和类型
    const { nextZoom, type } = getTypeAndZoom();
    res.data.body.forEach((item) => {
      // 创建覆盖物
      createOverlays(item, nextZoom, type);
    });
  };

  const getTypeAndZoom = () => {
    const zoom = map.getZoom();
    console.log(zoom);
    let nextZoom, type;
    if (zoom >= 10 && zoom <= 11) {
      // 区
      type = "circle";
      nextZoom = 13;
    } else if (zoom > 11 && zoom <= 13) {
      // 镇
      type = "circle";
      nextZoom = 15;
    } else if (zoom > 13 && zoom < 16) {
      type = "rect";
    }
    return { type, nextZoom };
  };

  const createOverlays = (data, zoom, type) => {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value,
    } = data;

    // 为每一条数据创建覆盖物
    const areaPoint = new window.BMapGL.Point(longitude, latitude);

    if (type === "circle") {
      // 区和镇
      createCircle(areaPoint, areaName, count, value, zoom);
    } else {
      // 小区
      createRect(areaPoint, areaName, count, value);
    }
  };

  const createCircle = (point, name, count, id, zoom) => {
    const label = new window.BMapGL.Label("", {
      // 创建文本标注
      position: point,
      offset: new window.BMapGL.Size(-35, -35),
    });
    // 给label对象添加一个唯一标识
    label.id = value;
    // 设置房源覆盖物
    label.setContent(`
      <div class="bubble">
        <p class="name">${name}</p>
        <p>${count}套</p>
      </div>`);
    label.setStyle(labelStyle);
    // 添加单击事件
    label.addEventListener("click", () => {
      renderOverlays(id);
      // 放大地图，以当前点击的覆盖物为中心放大地图
      map.centerAndZoom(point, zoom);
      setTimeout(() => {
        // 清除当前覆盖物信息
        map.clearOverlays();
      }, 0);
    });
    // 将标注添加到地图中
    map.addOverlay(label);
  };

  const createRect = (point, name, count, id) => {
    const label = new window.BMapGL.Label("", {
      // 创建文本标注
      position: point,
      offset: new window.BMapGL.Size(-50, 28),
    });
    // 给label对象添加一个唯一标识
    label.id = value;
    // 设置房源覆盖物
    label.setContent(`
      <div class="rect">
        <span class="housename">${name}</span>
        <span class="housename">${count}套</span>
        <i class="arrow></i>
      </div>`);
    label.setStyle(labelStyle);
    // 添加单击事件
    label.addEventListener("click", (e) => {
      // 获取小区房源数据
      getHousesList(id);
      const target = e.domEvent.changedTouches[0];
      // 将地图移到中间
      map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      );
    });
    // 将标注添加到地图中
    map.addOverlay(label);
  };

  const [houseList, setHouseList] = useState([]);
  const [isShowList, setIsShowList] = useState(false);
  const getHousesList = async (id) => {
    Toast.show({
      icon: "loading",
      content: "加载中…",
      duration: 0,
    });
    const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`);
    Toast.clear()
    setHouseList(res.data.body.list);
    setIsShowList(true);
  };

  const HouseList = houseList.map((item) => (
    <div className="house" key={item.houseCode}>
      <div className="imgWrap">
        <img
          className="img"
          src={`http://localhost:8080${item.houseImg}`}
          alt=""
        />
      </div>
      <div className="content">
        <h3 className="title">{item.title}</h3>
        <div className="desc">{item.desc}</div>
        <div>
          {item.tags.map((tag, index) => (
            <span className={["tag", `tag${index + 1}`].join(" ")} key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="price">
          <span className="priceNum">{item.price}</span> 元/月
        </div>
      </div>
    </div>
  ));

  return (
    <div className="map">
      {/* 导航栏 */}
      <NavHeader className="navbar">地图找房</NavHeader>
      {/* 地图容器元素 */}
      <div id="container"></div>
      {/* 房源列表 */}
      <div className={["houseList", isShowList ? "show" : ""].join(" ")}>
        <div className="titleWrap">
          <h1 className="listTitle">房屋列表</h1>
          <a className="titleMore" href="/house/list">
            更多房源
          </a>
        </div>
        {/* 房屋结构 */}
        <div className="houseItems">{HouseList}</div>
      </div>
    </div>
  );
}
