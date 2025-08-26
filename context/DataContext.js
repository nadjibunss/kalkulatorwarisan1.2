import { createContext, useState, useContext } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    gender: null,
    hartaKotor: 0,
    hutang: 0,
    biayaMakam: 0,
    wasiat: 0,
    ahliWaris: {
      suami: false,
      istri: false,
      ayah: false,
      ibu: false,
      anakL: 0,
      anakP: 0,
      kakek: false,
      nenek: false,
      saudaraL: 0,
      saudaraP: 0,
      cucuL: 0,
      cucuP: 0,
    }
  });

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
