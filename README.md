# React练手项目

好客租房移动端

## 技术栈

使用React18 + react-router-dom@ + ant-design-mobile  + axios + hooks开发项目

## 启动项目

1. 拉取代码
2. 导入数据库文件，sql在hkzf_v1/db中
3. 进入hkzf_v1/config，修改mysql.js中数据库的账密信息
4. npm start启动后端，若显示数据库连接成功，则后端启动成功
5. 启动前端项目，cd hkzf-mobile
6. npm install 下载依赖
7. 下载完成后 npm start 启动前端
8. 若想使用百度地图API接口，则需申请秘钥ak

```js
// 修改ak参数为申请后得到的ak
<script type="text/javascript" src="https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=[your ak]">

```

## Bug

- 地图找房map页面中，点击区房源信息 -> 镇房源信息 -> 小区房源信息中使用百度地图API,递归缩放等级，map.centerAndZoom(point, 11)，第二个参数的获取不准确，导致渲染小区覆盖物可能会出错，多尝试其他小区几次即可。
