import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OffersList from './Components/OffersList/OffersList'
import type { OfferProps } from './Data/OfferProps'

const offersData: OfferProps[] = [
  {
    title: "BMW 320d",
    subtitle: "Sport Line 2020",
    location: "Kobyłka (Mazowieckie)",
    sellerType: 'Private',
    createdDate: new Date("2025-10-20T05:17:30"),
    price: 10000,
    currency: "EUR"
  },
  {
    title: "Audi A4",
    subtitle: "2.0 TDI S-Line",
    location: "Warszawa (Mazowieckie)",
    sellerType: "Institutional",
    createdDate: new Date("2025-10-27T10:15:00"),
    price: 15000,
    currency: "USD"
  },
];

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <OffersList offers={offersData} />;
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
