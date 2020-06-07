import React, { useState, useEffect } from "react";
import { useAuth0 } from "../react-auth0-spa";
import styles from './Profile.module.css';
import { Chart } from "react-google-charts";

import api from '../api'
import { set } from "mongoose";

function Home() {

  const [fulldata, setfullData] = useState([])
  const [isLoading, setisLoading] = useState(true)
  const [dataorganized, setdataorganized] = useState()

  useEffect(() => {
    const runEffect = async () => {
      const data = await api.getAllTasks()
      setfullData(data.data.data)
      setisLoading(false)
      console.log(data.data.data)
      const datafiltered = [
        [
          { type: 'string', label: 'Task ID' },
          { type: 'string', label: 'Task Name' },
          { type: 'string', label: 'Resource' },
          { type: 'date', label: 'Start Date' },
          { type: 'date', label: 'End Date' },
          { type: 'number', label: 'Duration' },
          { type: 'number', label: 'Percent Complete' },
          { type: 'string', label: 'Dependencies' },
        ],
      ]
      data.data.data.map((item) => {
        if(item.endtime != null) {
          datafiltered.push([
            item._id,
            item.title,
            item.title,
            new Date(item.starttime),
            new Date(item.endtime),
            null,
            100,
            null,
          ])
        }
      })
      console.log(datafiltered)
      setdataorganized(datafiltered)
    }
    runEffect();
  },[]);



  if(isLoading == true) {
    console.log("loading")
    return <h1>LOADING...</h1>
  }
  else {
    return (
      <Chart
      width={'100%'}
      height={'300px'}
      chartType="Gantt"
      loader={<div>Loading Chart</div>}
      data={dataorganized}
      options={{
        height: 300,
        gantt: {
          trackHeight: 30,
        },
      }}
      rootProps={{ 'data-testid': '2' }}
    />
    )
  };
  }
  
export default Home;