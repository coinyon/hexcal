import React from 'react';
import logo from './logo.png';
import './App.css';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import * as HEX from './Hex';
import moment from 'moment';

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

interface Stake {
  stakeId: number;
  stakedHearts: number;
  stakeShares: number;
  lockedDay: number;
  stakedDays: number;
  unlockedDay: number;
  isAutoStake: boolean;
}

const momentForDay = (day: number): moment.Moment => {
  return moment("20191203", "YYYYMMDD").add(day, "days")
}

const StakeRow: React.FC<{ stake: Stake, currentDay: moment.Moment }> = ({ stake, currentDay }) => {
  const unlockMoment = momentForDay(stake.lockedDay + stake.stakedDays)
  return (
    <tr key={stake.stakeId}>
      <td>{stake.stakeId}</td>
      <td>{unlockMoment.calendar()}</td>
      <td>{unlockMoment.fromNow()}</td>
    </tr>
  );
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

  const downloadIcal = () => {
    const calendar = 'lol';
    window.open( "data:text/calendar;charset=utf8," + escape(calendar));
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
      .then((stakes: any[]) => {
        setStakes(stakes.map((st) => ({
          stakeId: parseInt(st.stakeId),
          stakedDays: parseInt(st.stakedDays),
          stakedHearts: parseInt(st.stakedHearts),
          stakeShares: parseInt(st.stakeShares),
          lockedDay: parseInt(st.lockedDay),
          unlockedDay: parseInt(st.unlockedDay),
          isAutoStake: st.isAutoStake
        })))
      })
      .catch(() => setStakes([]))
    }
  }, [stakeCount, library, account]);
  console.log("stakes", stakes);
  const currentDay = moment();

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
              <th>Unlock day</th>
              <th>Interval</th>
            </tr>
          </thead>
          <tbody>
            {stakes.map((stake) => <StakeRow stake={stake} currentDay={currentDay} />)}
          </tbody>
        </table>
        <p>
        <button onClick={() => downloadIcal()}>
          Download as iCal/ICS
        </button>
        </p>
        <p>
        Made with 
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          HEX
        </a>
        by
        <a className="App-link"
          href="https://twitter.com/coinyon">@coinyon</a>.
          </p>
      </header>
    </div>
  );
}

export default App;
