import React from 'react';
// COVID Data
import { Cards, Chart, CountryPicker } from './COVID';
import styles from './COVIDApp.module.css';
import { fetchData } from '../api';

import COVIDImg from '../images/rodrignotbad.jpg';

class COVIDApp extends React.Component {

    state = {
        data: {},
        country: '',
    }

    async componentDidMount() {
        const APIdata = await fetchData();
        this.setState( {data: APIdata })
    }

    handleCountryChange = async (country) => {
        const fetchedData = await fetchData(country);

        this.setState({ data: fetchedData, country: country});
    }

    render() {
      const { data, country } = this.state;

      return (
        <div className={styles.main}>
          <div className ={styles.container}>
              <img className= {styles.image} src= {COVIDImg} alt="COVID-19"/>
            <Cards data={data}/>
            <CountryPicker handleCountryChange= {this.handleCountryChange}/>
            <Chart data={data} country={country}/>
          </div>
        </div>

      );
    }
  }
  
  export default COVIDApp;