import React from 'react';
import logo from './logo.png';
import hexagon from './hexagon.svg';
import './App.css';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import * as HEX from './Hex';
import moment from 'moment';
import ical from 'ical-generator';

const injected = new InjectedConnector({ supportedChainIds: [1] })
const referalAddr = '0xFa2C0AbdaeDc8099887914Ab25AD11B3846655B9'
const iCalDomain = 'coinyon.github.io'
const iCalProdId = '//' + iCalDomain + '//HEXCAL//EN'

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
  return moment("20191203", "YYYYMMDD").add(day - 1, "days")
}

const ShortAddr: React.FC<{ address: string }> = ({ address }) => {
  return <span>{address.slice(0, 6) + "..." + address.slice(38)}</span>
}

const StakeRow: React.FC<{ stake: Stake, currentDay: moment.Moment }> = ({ stake }) => {
  const unlockDay = momentForDay(stake.lockedDay + stake.stakedDays)
  return (
    <tr key={stake.stakeId}>
      <td>{stake.stakeId}</td>
      <td>{unlockDay.calendar()}</td>
      <td>{unlockDay.fromNow()}</td>
    </tr>
  );
}

const App: React.FC = (_props) => {
  const web3react = useWeb3React<Web3>();
  const { account, library, active, error } = web3react;
  // const [events, setEvents] = React.useState<EventData[]>([]);
  const [stakes, setStakes] = React.useState<Stake[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [stakeCount, setStakeCount] = React.useState<number>(0);

  (window as any).web3 = web3react;

  const activate = () => {
    web3react.activate(injected);
  }

  const downloadIcal = () => {
    const calendar = ical({
      domain: iCalDomain,
      prodId: iCalProdId,
      events: stakes.map((stake) => {
        const unlockDay = momentForDay(stake.lockedDay + stake.stakedDays);
        return {
          uid: `stake-${stake.stakeId}`,
          start: unlockDay,
          end: unlockDay.endOf('day'),
          allDay: true,
          summary: 'HEX unlock day for #' + stake.stakeId,
          location: 'https://go.hex.win/stake/',
          description: `You need to take action for your HEX stake #${stake.stakeId}.

Reminder created by HEXCAL - https://coinyon.github.io/hexcal/`
        }
      })
    });
    window.open("data:text/calendar;charset=utf8," + escape(calendar.toString()));
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

      setLoading(true);
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
        setStakes(stakes.map((st) => {
          return {
            stakeId: parseInt(st.stakeId),
            stakedDays: parseInt(st.stakedDays),
            stakedHearts: parseInt(st.stakedHearts),
            stakeShares: parseInt(st.stakeShares),
            lockedDay: parseInt(st.lockedDay),
            unlockedDay: parseInt(st.unlockedDay),
            isAutoStake: st.isAutoStake
          }
        }))
      })
      .catch(() => setStakes([]))
      .finally(() => setLoading(false));
    }
  }, [stakeCount, library, account]);

  const currentDay = moment();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>HEXCAL</h2>
        <h4>Do not miss your unlock days</h4>
        <p>
        HEXCAL allows you to add the unlock days of your <a className="App-link" href={"https://go.hex.win/?r=" + referalAddr} target='_blank' rel="noopener noreferrer">HEX</a> stakes to your calendar.
        <br />Download an iCAL/ICS file and import it into your calendar app.
        </p>
        {!active ?
          <p>
            <button className="App-button" onClick={() => activate()}>
              Connect to Web3
            </button>
          {error ? "error" : null}
          </p> : null }
        {(active && account) ?
          <>
            <h4>Open HEX Stakes for <ShortAddr address={account} /></h4>
            { loading ?
              'Loading...' :
              <>
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
                <button className="App-button" onClick={() => downloadIcal()}>
                  Download as iCal/ICS
                </button>
                </p>
              </> }
          </>
          : null }
        <p>
        Made with
        {" "}
        <a
          className="App-link"
          target="_blank"
          href={"https://go.hex.win/?r=" + referalAddr}
          rel="noopener noreferrer"
        >
          <img src={hexagon} alt="HEX" height="17em" width="17em" />
        </a>
        {" "}
        by
        {" "}
        <a className="App-link" href="https://twitter.com/coinyon">@coinyon</a>
        {" "}
        |
        {" "}
        <a className="App-link" href="https://github.com/coinyon">Github</a>
        {" "}
        |
        {" "}
        <a className="App-link" href={"https://etherscan.io/address/" + referalAddr}>Donate</a>
        </p>
      </header>
    </div>
  );
}

export default App;
