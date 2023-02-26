import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "antd-mobile";
import axios from "axios";
import "./index.scss";
import { getCurrentCity } from "../../utils";
import { List, AutoSizer } from "react-virtualized";
import NavHeader from "../../components/NavHeader";

export default function CityList() {
  const navigate = useNavigate();
  const [cityList, setCityList] = useState([]);
  // 创建Ref对象
  const listRef = useRef(null);

  const filterCity = (cities) => {
    const letterArr = [];
    const newlist = [];
    for (let i = 65; i < 91; i++) {
      letterArr.push(String.fromCharCode(i));
    }
    for (let m in letterArr) {
      let cityItems = cities.filter(
        (item) => item.pinyin.substring(0, 1).toUpperCase() === letterArr[m]
      );
      cityItems.length &&
        newlist.push({
          title: letterArr[m],
          items: cityItems,
        });
    }
    return newlist;
  };

  const getCityList = async () => {
    const res = await axios.get("http://localhost:8080/area/city?level=1");
    const formatCityList = filterCity(res.data.body);
    // 获取热门城市数据
    const hotRes = await axios.get("http://localhost:8080/area/hot");
    // 获取当前定位城市
    const curCity = await getCurrentCity();
    setCityList([
      { title: "#", items: [curCity] },
      { title: "热门城市", items: hotRes.data.body },
      ...formatCityList,
    ]);
  };

  useEffect(() => {
    (async () => {
      await getCityList();
      listRef.current.measureAllRows();
    })();
    // 调用measureAllRows，提前计算List中每一行的高度，实现scrollToRow的精确跳转
    // 注意：调用这个方法的时候，需要保证List组件中已经已经有数据，如果List中数据为空，就会导致调用方法报错
    // listRef.current.measureAllRows();
  }, []);

  const HOUSE_CITY = ['北京','上海','广州','深圳']
  const changeCity = (city) => {
    if(HOUSE_CITY.indexOf(city.label) > -1) {
      localStorage.setItem("hkzf_city", JSON.stringify(city))
      navigate(-1)
    } else {
      Toast.show({
        content: '该城市暂无房源信息',
      })
    }
  }

  // 渲染每一行数据的行数
  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否在滚动中
    isVisible, // 当前项在list中是可见的
    style, // 注意：重点属性，一定要给每一行数据添加该样式！作用：指定每一行的位置
  }) => {
    // 获取每一行索引
    const letter = cityList[index].title;
    // 获取指定字母索引下的城市列表数据
    const cities = cityList[index].items;
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cities.map((item) => (
          <div className="name" key={item.value} onClick={() => changeCity(item)}>
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  // 索引（A，B等）的高度
  const TITLE_HEIGHT = 36;
  // 每个城市名称的高度
  const NAME_HEIGHT = 50;

  // 封装处理字母索引的方法
  const formatCityIndex = (letter) => {
    switch (letter) {
      case "#":
        return "当前定位";
      default:
        return letter;
    }
  };

  // 创建动态计算每一行高度的方法
  const getRowHeight = ({ index }) => {
    // 索引标题高度 + 城市数量 * 城市名称高度
    return TITLE_HEIGHT + NAME_HEIGHT * cityList[index].items.length;
  };

  // 指定右侧字母索引列表的高亮的索引号
  const [activeIndex, setActiveIndex] = useState(0);

  const renderCityIndex = cityList.map(({ title, _ }, index) => {
    return (
      <li
        className="city-index-item"
        key={title}
        onClick={() => {
          // 点击索引跳转
          listRef.current.scrollToRow(index);
        }}
      >
        <span className={activeIndex === index ? "index-active" : ""}>
          {title[0]}
        </span>
      </li>
    );
  });

  // 定义滚动列表让右侧索引高亮的方法
  const onRowsRendered = ({ startIndex }) => {
    if (startIndex !== activeIndex) {
      setActiveIndex(startIndex);
    }
  };

  return (
    <div className="cityList">
      {/* 导航栏 */}
      <NavHeader className="navbar">
        城市选择
      </NavHeader>
      {/* 城市列表 */}
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            width={width}
            height={height}
            rowCount={cityList.length}
            rowHeight={getRowHeight}
            rowRenderer={rowRenderer}
            onRowsRendered={onRowsRendered}
            scrollToAlignment="start"
          />
        )}
      </AutoSizer>

      {/* 右侧索引列表 */}
      <ul className="city-index">{renderCityIndex}</ul>
      {/* <div style={{ height: window.innerHeight }}>
        <IndexBar>
          {cityList.map((item) => {
            const { title, items } = item;
            return (
              <IndexBar.Panel index={title} title={title} key={title}>
                <List>
                  {items.map((item, index) => (
                    <List.Item key={index}>{item.label}</List.Item>
                  ))}
                </List>
              </IndexBar.Panel>
            );
          })}
        </IndexBar>
      </div> */}
    </div>
  );
}
