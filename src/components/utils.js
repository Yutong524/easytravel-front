import React from 'react';
import { Tag } from 'antd';

export const getCategoryColor = (category) => {
  switch (category) {
    case 'history':
      return 'red';
    case 'landscape':
      return 'green';
    case 'recreation':
      return 'orange';
    case 'shopping':
      return 'blue';
    default:
      return 'grey';
  }
};

export const CategoryTag = ({ category }) => (
  <Tag color={getCategoryColor(category)}>{category || 'Not Categorized'}</Tag>
);
