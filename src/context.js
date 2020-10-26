import React, { createContext, useContext, useReducer } from "react";

const initialState = {
  select: "DP03_0063E",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_OPTION":
      return { ...state, select: action.payload };

    default:
      return state;
  }
};

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

export const useData = () => useContext(StateContext);
