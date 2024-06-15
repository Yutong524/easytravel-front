import React from 'react';
import { Layout, Input, Button, List, Rate } from 'antd';
import { SearchOutlined, HeartOutlined } from '@ant-design/icons';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './POIMap.css';

const { Header, Sider, Content } = Layout;

const places = [
  { name: 'Shopping Mall', address: '530 Lawerence St.', rating: 3.5, lat: 37.7749, lng: -122.4194 },
  { name: 'Lancer Shopping Center', address: '75 Brooklance Dr.', rating: 4.0, lat: 37.7849, lng: -122.4294 },
  { name: 'ShopVale', address: '1002 William St.', rating: 2.6, lat: 37.7949, lng: -122.4394 },
];

const mapContainerStyle = {
  height: "100vh",
  width: "100%",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const POIMap = () => {
    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  return (
    <Layout style={{ height: '100vh' }}>
      <Header className="header">
        <div className="logo">EasyTravel</div>
      </Header>
      <Layout>
        <Content>
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
            >
               
              {places.map((place, index) => (
                <Marker.AdvancedMarkerElement key={index} position={{ lat: place.lat, lng: place.lng }} />
              ))}
            </GoogleMap>
          </LoadScript>
        </Content>
        <Sider width={350} className="site-layout-background">
          <div className="search-container">
            <Button type="primary">Advance</Button>
            <Input prefix={<SearchOutlined />} placeholder="shop" />
          </div>
          <List
            itemLayout="horizontal"
            dataSource={places}
            renderItem={item => (
              <List.Item
                actions={[<a key="list-loadmore-edit">detail </a>]}
              >
                <List.Item.Meta
                  title={<a href="https://ant.design">{item.name}</a>}
                  description={`${item.address}`}
                />
                <Rate disabled defaultValue={item.rating} />
                <Button shape="circle" icon={<HeartOutlined />} />
              </List.Item>
            )}
          />
        </Sider>
      </Layout>
    </Layout>
  );
}

export default POIMap;
