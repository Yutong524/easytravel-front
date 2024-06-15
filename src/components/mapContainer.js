import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// 加载 Google Maps API 的库
const libraries = ['places'];

// 地图容器的样式
const mapContainerStyle = {
  height: '100vh',
  width: '100vw',
};

// 地图的默认中心点
const defaultCenter = {
  lat: -34.397,
  lng: 150.644,
};

// 地图的选项配置
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const MapContainer = ({ addresses }) => {
  const [markerPositions, setMarkerPositions] = useState([]); // 标记的位置状态
  const mapRef = useRef(); // 存储地图实例的引用

  // 地图加载时的回调
  const onMapLoad = useCallback((map) => {
    mapRef.current = map; // 将地图实例保存到引用中
    if (addresses.length > 0) {
      geocodeAddresses(addresses); // 如果有地址列表，则进行地理编码
    } else {
      mapRef.current.panTo(defaultCenter); // 如果地址列表为空，将地图中心点设为默认值
      mapRef.current.setZoom(2); // 设置缩放级别为2
    }
  }, [addresses]);

  // 地理编码地址的函数
  const geocodeAddresses = useCallback((addresses) => {
    const geocoder = new window.google.maps.Geocoder(); // 创建地理编码器实例
    const promises = addresses.map(address =>
      new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0].geometry.location); // 地理编码成功时，返回位置
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            resolve(null); // 地理编码失败时，返回null
          }
        });
      })
    );

    Promise.all(promises).then(locations => {
      const validLocations = locations.filter(location => location !== null); // 过滤掉失败的地理编码结果
      setMarkerPositions(validLocations); // 更新标记的位置
      if (validLocations.length > 0) {
        mapRef.current.panTo(validLocations[0]); // 将地图中心点设置为第一个有效位置
        mapRef.current.setZoom(8); // 设置缩放级别为8
      } else {
        mapRef.current.panTo(defaultCenter); // 如果没有有效位置，将地图中心点设为默认值
        mapRef.current.setZoom(2); // 设置缩放级别为2
      }
    });
  }, []);

  // 监听地址列表的变化
  useEffect(() => {
    if (addresses.length > 0) {
      geocodeAddresses(addresses); // 如果地址列表不为空，进行地理编码
    } else {
      setMarkerPositions([]); // 如果地址列表为空，清空标记位置
    }
  }, [addresses, geocodeAddresses]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle} // 设置地图容器的样式
        zoom={8} // 设置初始缩放级别
        center={defaultCenter} // 设置初始中心点
        options={options} // 设置地图的选项
        onLoad={onMapLoad} // 地图加载时的回调
      >
        {markerPositions.map((position, index) => (
          <Marker key={index} position={position} /> // 根据标记的位置渲染标记
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
