import React from "react";
import { useData } from "./context";

const SelectOptions = ({ county, info, percent }) => {
  const [{ select }, dispatch] = useData();

  const handleSelect = e => {
    dispatch({
      type: "SET_OPTION",
      payload: e.target.value,
    });
  };

  return (
    <div className='option-select'>
      <div className='info-container'>
        <div>
          <select
            id='census-variable'
            defaultValue={select}
            onChange={handleSelect}>
            <option value='DP03_0063E'>Average Annual Household Income</option>
            <option value='DP05_0017E'>Median Age in Years</option>
            <option value='DP05_0007PE'>
              Percentage of Population 15 - 19 Years
            </option>
            <option value='DP05_0008PE'>
              Percentage of Population 20 - 24 Years
            </option>
            <option value='DP05_0009PE'>
              Percentage of Population 25 - 34 Years
            </option>
            <option value='DP05_0010PE'>
              Percentage of Population 35 - 44 Years
            </option>
            <option value='DP05_0011PE'>
              Percentage of Population 45 - 54 Years
            </option>
            <option value='DP05_0012PE'>
              Percentage of Population 55 - 59 Years
            </option>
            <option value='DP05_0013PE'>
              Percentage of Population 60 - 64 Years
            </option>
            <option value='DP05_0014PE'>
              Percentage of Population 65 - 74 Years
            </option>
            <option value='DP05_0015PE'>
              Percentage of Population 75 - 84 Years
            </option>
            <option value='DP05_0016PE'>
              Percentage of Population 85+ Years
            </option>
          </select>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              marginBottom: "15px",
            }}>
            <p>min</p>
            <div
              style={{
                flex: "1",
                height: "10px",
                background: "linear-gradient(to left, #c31432, #240b36)",
                margin: "0px 10px",
              }}>
              <span style={{ paddingLeft: percent }} id='data-caret'>
                &#x25c6;
              </span>
            </div>
            <p>max</p>
          </div>
        </div>
        {county && (
          <div className='county-info'>
            <h2>{county}</h2>
            <h2>{info}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectOptions;
