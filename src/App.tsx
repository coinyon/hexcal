import React from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import * as HEX from './Hex';

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

interface Stake {
  stakeId: string;
  stakedHearts: string;
  stakeShares: string;
  lockedDay: string;
  stakedDays: string;
  unlockedDay: string;
  isAutoStake: boolean
}

const App: React.FC = (_props) => {
  const web3react = useWeb3React<Web3>();
  const { account, library, active, error } = web3react;
  // const [events, setEvents] = React.useState<EventData[]>([]);
  const [stakes, setStakes] = React.useState<Stake[]>([]);
  const [stakeCount, setStakeCount] = React.useState<number>(0);

  (window as any).web3 = web3react;

  const activate = () => {
    web3react.activate(injected);
  }

  React.useEffect(() => {
    if (library) {
      const contract = new library.eth.Contract(HEX.abi, HEX.address);
      /*
      contract.getPastEvents("StakeStart", { fromBlock: 900000, filter: { stakerAddr: account } } as any)
      .then(setEvents as any)
      .catch(() => {
        setEvents([]);
      })
      */

      contract.methods.stakeCount(account).call()
      .then((stakeCountStr: string) => setStakeCount(parseInt(stakeCountStr)))
      .catch(() => {
        setStakeCount(0);
      });
    }
  }, [account, library]);

  React.useEffect(() => {
    if (library && stakeCount) {
      const contract = new library.eth.Contract(HEX.abi, HEX.address);
      const eventsPromises = Array.from(new Array(stakeCount).keys()).map(
        (n) => {
          return contract.methods.stakeLists(account, n).call()
        }
      )
      Promise.all(eventsPromises)
      .then((stakes: Stake[]) => {
        setStakes(stakes)
      } )
      .catch(() => setStakes([]))
    }
  }, [stakeCount, library, account]);
  console.log("stakes", stakes);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        {active ? `Open HEX Stakes for ${account}` :
          <button onClick={() => activate()}>
            connect
          </button>}
        </p>
        <p>
        {error ? "error" : null}
        </p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First day</th>
              <th>Last day</th>
            </tr>
          </thead>
          <tbody>
          {stakes.map((stake) => {
            return (
              <tr key={stake.stakeId}>
                <td>{stake.stakeId}</td>
                <td>{stake.lockedDay}</td>
                <td>{stake.stakedDays}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
