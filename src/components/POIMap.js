import React, { useState } from 'react';
import SearchResults from './SearchResults';
import MapContainer from './mapContainer';
import SearchPanel from './searchBar';

let addresses = []; // 地址列表，用于存储地理编码地址

const POIMap = () => {
  // 假的POI JSON数据
  const fakePOIJson = '[{ "_id": { "$oid": "666b143477966d35d3e306ac" }, "name": "Golden Gate Bridge", "address": "Golden Gate Brg, San Francisco, CA", "category": "history", "description": "Each year the Golden Gate Bridge attracts more than 10 million visitors to take in its tremendous 746-foot tall towers, sweeping main cables, signature International Orange color and Art Deco styling. It is a sensory experience featuring color, light and sound.", "openTime": [ { "day": "MONDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "TUESDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "WEDNESDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "THURSDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "FRIDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "SATURDAY", "startTime": "00:00:00", "endTime": "24:00:00" }, { "day": "SUNDAY", "startTime": "00:00:00", "endTime": "24:00:00" } ], "rating": 4.5, "comments": [ { "time": "2024-06-13 12:31:21", "publisher": "testUser1", "content": "a comment for testing.", "rating": 5 }, { "time": "2024-06-13 14:12:21", "publisher": "testUser2", "content": "another comment for testing.", "rating": 4 } ], "architectureStyle": "Art Deco", "establishedYear": 1937, "access": "public", "id": 1 }, { "_id": { "$oid": "666b17e477966d35d3e306ad" }, "name": "Palace of Fine Arts", "address": "3601 Lyon St, San Francisco, CA 94123", "category": "recreation", "description": "Built for the 1915 Panama-Pacific exhibition, the Palace of Fine Arts is now available for corporate, private events, conferences and galas.", "openTime": [ { "day": "MONDAY", "startTime": "00:00:00", "endTime": "00:00:00" }, { "day": "TUESDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "WEDNESDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "THURSDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "FRIDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "SATURDAY", "startTime": "10:00:00", "endTime": "17:00:00" }, { "day": "SUNDAY", "startTime": "10:00:00", "endTime": "17:00:00" } ], "rating": 4, "comments": [ { "time": "2024-06-13 12:31:21", "publisher": "testUser3", "content": "a psuedo comment for testing.", "rating": 4 } ], "services": [ "Guided Tours", "Educational Programs", "Wedding", "Private Conferences", "Shows" ], "wi-fi": true, "parking": true, "id": 2 }, { "_id": { "$oid": "666b1a6877966d35d3e306b9" }, "name": "Edie Park", "address": "1051 Edie Rd, San Francisco, CA 94129", "category": "not categorized", "description": "A park in San Fransisco", "openTime": [ { "day": "MONDAY", "startTime": "09:00:00", "endTime": "18:00:00" }, { "day": "TUESDAY", "startTime": "09:00:00", "endTime": "18:00:00" }, { "day": "WEDNESDAY", "startTime": "00:00:00", "endTime": "00:00:00" }, { "day": "THURSDAY", "startTime": "09:00:00", "endTime": "18:00:00" }, { "day": "FRIDAY", "startTime": "09:00:00", "endTime": "16:00:00" }, { "day": "SATURDAY", "startTime": "09:00:00", "endTime": "16:00:00" }, { "day": "SUNDAY", "startTime": "00:00:00", "endTime": "00:00:00" } ], "rating": 0, "comments": [], "id": 3 }]';

  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [pois, setPois] = useState([]); // 存储POI列表

  // 模拟异步请求，获取POI数据
  const fetchPOIs = () => {
    // 设置加载状态为true
    setIsLoading(true);

    // 模拟延时一秒后返回假数据
    setTimeout(() => {
      const fakePOI = JSON.parse(fakePOIJson); // 解析假数据JSON
      
      setPois(fakePOI); // 更新POI列表
      addresses = fakePOI.map(poi => poi.address); // 提取地址并更新地址列表
      
      setIsLoading(false); // 设置加载状态为false
    }, 1000);
  };

  // 处理按钮点击事件
  const handleButtonClick = () => {
    fetchPOIs(); // 调用fetchPOIs函数获取数据
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* 搜索面板组件 */}
      <SearchPanel isLoading={isLoading} listofPOI={pois} onSearch={handleButtonClick} />
      {/* 地图容器组件 */}
      <MapContainer addresses={addresses} />
    </div>
  );
};

export default POIMap;
