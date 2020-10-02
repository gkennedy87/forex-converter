import React from 'react';
import './App.css';
import './index.css';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
    this.onQuantityChange = this.onQuantityChange.bind(this);
    this.convertCurrency = this.convertCurrency.bind(this);
    this.state = {
    isLoaded: false,
      rates: [],
      quantity: "",
      currentRate: "",
      conversion: "",
      base: "",
    };
    
  }
  componentDidMount() {
    fetch('https://api.exchangeratesapi.io/latest')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({isLoaded: true,
          rates: result.rates,
          date: result.date,
          base: result.base})
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
        );
  }
  convertCurrency() {
    const currency = this.state.currentRate;
    const quantity = this.state.quantity;
    const result = currency * quantity;
    return this.setState({conversion: result})
  }
   onCurrencyChange(event) {
      this.setState({currentRate: event.target.value});
  }
    onQuantityChange(event) {
      this.setState({quantity: event.target.value});
    } 

  render() {
    const {base, rates , quantity, conversion, isLoaded, currentRate} = this.state;
  return (
    <div className="App">
      <h1>Exchange Rate Calculator</h1>
      <Selector Base={base} Rates={rates} Quantity={quantity} Conversion={conversion} isLoaded={isLoaded} currentRate={currentRate} onCurrencyChange={this.onCurrencyChange} onQuantityChange={this.onQuantityChange} convertCurrency = {this.convertCurrency}/>
      <Table Base={base} Rates={rates}/>
    </div>
  );
  }
}

class Table extends React.Component {

  render() {
    const base = this.props.Base
    const rates = this.props.Rates
    const currencies = Object.entries(rates)
    return (
      <table className='ratesTable'>
        <thead>
          <tr>
            <th>Currency ({base})</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map(rate => (
            <tr key={rate[0]}>
              <td>{rate[0]}</td>
              <td>{rate[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

class Selector extends React.Component {  

  render() {
    const {error, isLoaded} = this.props;
    const conversion = this.props.Conversion;
    const rates = this.props.Rates;
    const currencies = Object.entries(rates);
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
      <div>
        <form>
          <label htmlFor="currency"></label>
          <select name="currency" id="currency" value={this.props.currency} onChange={this.props.onCurrencyChange}>
            <option value="">Pick a Currency</option>
            {currencies.map(symbol => (
              <option value={symbol[1]} key={symbol[0]}>{symbol[0]}</option>
            ))}
          </select>
          <label htmlFor="quantity"></label>
          <input type="number" name="quantity" id="quantity" onChange={this.props.onQuantityChange}/>
          <input type="button" value= "Calculate" onClick={ this.props.convertCurrency} />
        </form>
            <p>{conversion}</p>
      </div>
      
    )
    }
    
  }
}

export default App;
