'use strict';

import Loadable from 'react-imported-component';
import LoadingIndicator from '../../components/LoadingIndicator';
// import React from 'react';

export default Loadable(() => import('./index'), {
  LoadingComponent: LoadingIndicator
});

// export default Loadable.Map({
//   loader: {
//     SubComponent: () => import('./index'),
//     firedata: () => fakeAPI()
//   },
//   LoadingComponent: LoadingIndicator,
//   render(loaded, props) {
//     console.log('loading');
//     const SubComponent = loaded.SubComponent.default;
//     const { firedata } = loaded;
//     return <SubComponent {...props} firedata={firedata} />;
//   }
// });

// function fakeAPI() {
//   return new Promise(resolve => {
//     setTimeout(
//       () => resolve({ title: 'Yolo', body: 'This is a cool post' }),
//       2000
//     );
//   });
// }

// function Loading(props) {
//   return <div>Loading...</div>;
// }

// function fakeAPI() {
//   return new Promise(resolve => {
//     setTimeout(
//       () => resolve({ title: 'Yolo', body: 'This is a cool post' }),
//       2000
//     );
//   });
// }

// const Posts = Loadable.Map({
//   loader: {
//     Post: () => import('./Post'),
//     data: () => fakeAPI()
//   },
//   render(loaded, props) {
//     const Post = loaded.Post.default;
//     const data = loaded.data;
//     return <Post data={data} {...props} />;
//   },
//   loading: Loading
// });

// export default Posts;
