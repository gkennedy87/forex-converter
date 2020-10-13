import React from 'react';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './App.css';
import './index.css';
/* ----- Components -------- */
class Selector extends React.Component {
  render() {
    const {error, isLoaded} = this.props;
    const conversion = this.props.Conversion;
    const rates = Object.entries(this.props.Rates);
    const filtered = rates.filter(item => item[0] !== this.props.baseCurrency)
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (

      <Container>
        <form>
          <label htmlFor="Base Currency">Base Currency</label>
          <select name="BaseCurrency" id="currency" value={this.props.currency} onChange={this.props.onBaseCurrencyChange}>
            <option value={this.props.baseCurrency}>{this.props.baseCurrency}</option>
            {rates.map(symbol => (
              <option value={symbol[0]} key={symbol[0]}>{symbol[0]}</option>
            ))}
          </select>

          <label htmlFor="quantity">Quantity</label>
          <input type="number" name="quantity" id="quantity" onChange={this.props.onQuantityChange}/>
            
          <label htmlFor="Desired Currency"></label>
          <select name="desiredCurrency" id="currency" value={this.props.currency} onChange={this.props.onTargetCurrencyChange}>
            {filtered.map(symbol => (
              <option value={symbol[1]} key={symbol[0]}>{symbol[0]}</option>
            ))}
          </select>
          <label htmlFor="quantity"></label>
          <input type="button" value= "Calculate" onClick={ this.props.convertCurrency} />
        </form>
            <p>{conversion}</p>
      </Container>
      
    )
    }
    
  }
}

class RatesTable extends React.Component{

  shouldComponentUpdate(nextProps) {
    if( nextProps !== this.props.baseCurrency) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    const rates = Object.entries(this.props.Rates);
    const base = this.props.baseCurrency;
    return(
      <Container>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Currency (vs. {base})</TableCell>
                <TableCell>Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                  {rates.map(item => 
                    <TableRow key={item[0]+1}>
                      <TableCell>{item[0]}</TableCell>
                      <TableCell>{item[1]}</TableCell>
                    </TableRow>
                    )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    )
  }
}

/***** Main App Component *********/
class App extends React.Component {
  constructor(props) {
    super(props);
    this.onTargetCurrencyChange = this.onTargetCurrencyChange.bind(this);
    this.onQuantityChange = this.onQuantityChange.bind(this);
    this.convertCurrency = this.convertCurrency.bind(this);
    this.onBaseCurrencyChange = this.onBaseCurrencyChange.bind(this);
    this.state = {
    isLoaded: false,
      rates: [],
      quantity: "",
      currentRate: "",
      currentCurrency:"",
      targetCurrency:"",
      conversion: "",
      baseCurrency: "",
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
          baseCurrency: result.base})
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
    const newBase = this.state.baseCurrency;
    fetch('https://api.exchangeratesapi.io/latest?base='+newBase)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({isLoaded: true,
        rates: result.rates,
        date: result.date,
        baseCurrency: result.base})
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        })
      }
      );
    const rate = this.state.targetCurrency;
    const quantity = this.state.quantity;
    const result = rate * quantity;
    return this.setState({conversion: result})
  }
   onTargetCurrencyChange(event) {
      this.setState({targetCurrency: event.target.value });
  }
    onQuantityChange(event) {
      this.setState({quantity: event.target.value});
  }
    onBaseCurrencyChange(event) {
      this.setState({baseCurrency: event.target.value})

    } 

  render() {
    const {rates , quantity, conversion, isLoaded, currentRate, currentCurrency, targetCurrency, baseCurrency} = this.state;
  return (
    <div className="App">
      <h1>Exchange Rate Calculator</h1>
      <Selector baseCurrency= {baseCurrency} Rates={rates} Quantity={quantity} Conversion={conversion} isLoaded={isLoaded} currentRate={currentRate} currentCurrency={currentCurrency} targetCurrency={targetCurrency} onTargetCurrencyChange={this.onTargetCurrencyChange} onQuantityChange={this.onQuantityChange} convertCurrency = {this.convertCurrency} onBaseCurrencyChange ={this.onBaseCurrencyChange}/>
      <RatesTable baseCurrency={baseCurrency} Rates = {rates} />
    </div>
  );
  }
}
/****** Export the App Object ********/
export default App;
