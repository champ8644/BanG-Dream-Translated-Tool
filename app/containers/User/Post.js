import React from 'react';

export default function Post(props) {
  const { data } = props;
  return (
    <>
      <p>{data.title}</p>
      <p>{data.body}</p>
    </>
  );
}
