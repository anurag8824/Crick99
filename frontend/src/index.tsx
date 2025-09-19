// import React, { Suspense } from 'react'
// import { Provider } from 'react-redux'
// import { store } from './redux/store'
// import { WebSocketProvider } from './context/webSocket'
// import App from './App'

// import reportWebVitals from './reportWebVitals'
// import { WebSocketUserProvider } from './context/webSocketUser'
// import { WebSocketCasinoProvider } from './context/webSocketCasino'
// import { createRoot } from 'react-dom/client';
// import { DrawerProvider } from './context/DrawerContext'

// const rootElement = document.getElementById('root');

// if (rootElement) {
//   const root = createRoot(rootElement);
//   root.render(
//     <Suspense
//       fallback={
//         <div style={{
//           display: 'flex',
//           justifyContent: 'center',   
//           alignItems: 'center',       
//           height: '100vh',            
//           flexDirection: 'column',   
//         }} className='suspense-loading d-flex justify-center align-center flex-column'>
//           {/* <img src='/imgs/logo.png' width={200} /> Prevoius Loader */}
//           <img src='/imgs/loading.svg' width={50} /> 

//         </div>
//       }
//     >
//       <Provider store={store}>
//             <DrawerProvider>
        
//         <WebSocketProvider>
//           <WebSocketUserProvider>
//             <WebSocketCasinoProvider>
//               <App />
//             </WebSocketCasinoProvider>
//           </WebSocketUserProvider>
//         </WebSocketProvider>
//         </DrawerProvider>
//       </Provider>
//     </Suspense>
//   )

//   // If you want to start measuring performance in your app, pass a function
//   // to log results (for example: reportWebVitals(console.log))
//   // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//   reportWebVitals()
// }
// // Create a roo


import React, { Suspense, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { WebSocketProvider } from './context/webSocket';
import App from './App';

import reportWebVitals from './reportWebVitals';
import { WebSocketUserProvider } from './context/webSocketUser';
import { WebSocketCasinoProvider } from './context/webSocketCasino';
import { createRoot } from 'react-dom/client';
import { DrawerProvider } from './context/DrawerContext';

const AppWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Set timeout to hide the loader after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []);

  return (
    <Suspense
      fallback={
        isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              flexDirection: 'column',
            }}
            className='suspense-loading d-flex justify-center align-center flex-column'
          >
            <img src='/imgs/loading.svg' width={50} />
          </div>
        )
      }
    >
      <Provider store={store}>
        <DrawerProvider>
          <WebSocketProvider>
            <WebSocketUserProvider>
              <WebSocketCasinoProvider>
                <App />
              </WebSocketCasinoProvider>
            </WebSocketUserProvider>
          </WebSocketProvider>
        </DrawerProvider>
      </Provider>
    </Suspense>
  );
};

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<AppWrapper />);

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
