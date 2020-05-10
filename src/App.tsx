import React from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import * as HEX from './library/HEX';
import * as UNISWAP_HEX from './library/UNISWAP_HEX';
import * as MAKER_ETHUSD from './library/MAKER_ETHUSD';
import moment from 'moment';
import ical from 'ical-generator';
import { sum, map, prop, flatten, sort, reject, equals, range } from 'ramda';
import download from 'downloadjs';
import { Modal, Input, Button, Form, Grid, Label, Icon, Header, Image, Table, Card, Segment, Popup } from 'semantic-ui-react'
import { useHashAccountsStore } from "./AccountStore"

import logo from './logo.png';
import hexagon from './hexagon.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import BigNumber from 'bignumber.js';
import { useCallbackWithInterval } from './interval';

const injected = new InjectedConnector({ supportedChainIds: [1] })
const referalAddr = '0xFa2C0AbdaeDc8099887914Ab25AD11B3846655B9'
const iCalDomain = 'coinyon.github.io'
const iCalProdId = '//' + iCalDomain + '//HEXCAL//EN'
const hexLaunchDay = moment("20191203", "YYYYMMDD")
const updateInterval = 30_000

interface Stake {
  stakeId: number;
  stakedHearts: number;
  stakeShares: number;
  lockedDay: number;
  stakedDays: number;
  unlockedDay: number;
  isAutoStake: boolean;
  address: string;
  unlockDay: moment.Moment;
}

interface HexBalance {
  address: string;
  balance: number;
}

type DailyInterest = {[ day: number ]: number}

const momentForDay = (day: number): moment.Moment => {
  return hexLaunchDay.clone().add(day - 1, "days")
}

const formatHearts = (hearts: number): string => {
  return (hearts / 1e8).toLocaleString([], { minimumFractionDigits: 3, maximumFractionDigits: 3 })
}

const formatUSD = (usd: number): string => {
  return usd.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const ShortAddr: React.FC<{ address: string }> = ({ address }) => {
  return <span>{address.slice(0, 6) + "..." + address.slice(38)}</span>
}

const AddressLabel: React.FC<{ address: string, onDelete?: (address: string) => void }> = ({ address, onDelete }) => {
  const onDeleteClick = React.useCallback(() => {
    if (onDelete && address) {
      onDelete(address)
    }
  }, [ address, onDelete ])
  // TODO: show tooltip
  // TODO: add option to open etherscan
  return <Label>
    <ShortAddr address={address} />
    { onDelete ? <Icon name='delete' onClick={onDeleteClick} /> : null }
  </Label>
}

const StakeRow: React.FC<{ stake: Stake, currentDay: moment.Moment, hexPriceUsd: number | null }> = ({
  stake, hexPriceUsd, currentDay
}) => {
  return (
    <Table.Row key={stake.stakeId} warning={stake.unlockDay.diff(currentDay, "days") < 32}>
      <Table.Cell textAlign="right">{stake.stakeId}</Table.Cell>
      <Table.Cell><AddressLabel address={stake.address} /></Table.Cell>
      <Table.Cell className="date-related">{stake.unlockDay.calendar()}</Table.Cell>
      <Table.Cell className="date-related">{stake.unlockDay.fromNow()}</Table.Cell>
      <Table.Cell textAlign="right">{formatHearts(stake.stakedHearts)}</Table.Cell>
      <Table.Cell textAlign="right">{ hexPriceUsd != null && formatUSD(stake.stakedHearts / 1e8 * hexPriceUsd)}</Table.Cell>
    </Table.Row>
  );
}

const SummaryRows: React.FC<{
  stakes: Stake[],
  hexPriceUsd: number | null,
  totalInterestHearts: number | null,
  totalUnstakedHearts: number | null,
  unstackedTable: React.ReactElement
}> = ({ stakes, hexPriceUsd, totalInterestHearts, totalUnstakedHearts, unstackedTable }) => {
  const stakedHearts = stakes.map((st) => st.stakedHearts).reduce((a, b) => a + b, 0)
  const totalHearts = stakedHearts + (totalInterestHearts || 0) + (totalUnstakedHearts || 0)
  return <>
    <Table.Row key={"summaryStakes"}>
      <Table.Cell textAlign="left" colSpan={4}>Total staked principal</Table.Cell>
      <Table.Cell textAlign="right">{formatHearts(stakedHearts)}</Table.Cell>
      <Table.Cell textAlign="right">{ hexPriceUsd != null && formatUSD(stakedHearts / 1e8 * hexPriceUsd)}</Table.Cell>
    </Table.Row>
    { totalInterestHearts !== null &&
      <Table.Row key={"summaryInterest"}>
        <Table.Cell textAlign="left" colSpan={4}>+ Interest to date</Table.Cell>
        <Table.Cell textAlign="right">{formatHearts(totalInterestHearts)}</Table.Cell>
        <Table.Cell textAlign="right">{ hexPriceUsd != null && formatUSD(totalInterestHearts / 1e8 * hexPriceUsd)}</Table.Cell>
      </Table.Row> }
    { totalUnstakedHearts !== null &&
      <Table.Row key={"summaryUnstaked"}>
        <Table.Cell textAlign="left" colSpan={4}>
          +
          {" "}
          <Popup
            content={unstackedTable}
            trigger={<span className='popup-trigger'>Total unstaked</span>}
          />
        </Table.Cell>
        <Table.Cell textAlign="right">{formatHearts(totalUnstakedHearts)}</Table.Cell>
        <Table.Cell textAlign="right">{ hexPriceUsd != null && formatUSD(totalUnstakedHearts / 1e8 * hexPriceUsd)}</Table.Cell>
      </Table.Row> }
    <Table.Row key={"summary"}>
      <Table.Cell textAlign="left" colSpan={4}>= Total</Table.Cell>
      <Table.Cell textAlign="right">{formatHearts(totalHearts)}</Table.Cell>
      <Table.Cell textAlign="right">{ hexPriceUsd != null && formatUSD(totalHearts / 1e8 * hexPriceUsd)}</Table.Cell>
    </Table.Row>
  </>;
}

function useContract<T>(web3react: any, abi: any, address: string, func: (contract: any, libary: Web3) => Promise<T>): [T | null, boolean] {

  const { account, library } = web3react;
  const [resultVal, setResultVal] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (library && account) {
      const contract = new library.eth.Contract(abi, address);
      func(contract, library).then((result) => {
        setResultVal(result)
        setLoading(false)
      })
    }
  }, [account, library, abi, address, func])

  return [ resultVal, loading ]
}

const sortByUnlockDay = sort<Stake>((st1, st2) => st1.unlockDay.diff(st2.unlockDay))

const App: React.FC = (_props) => {

  // Web3 hooks
  const web3react = useWeb3React<Web3>();
  const { account, library, active, error } = web3react;
  const [accounts, setAccounts] = useHashAccountsStore();
  const activate = React.useCallback(() => {
    web3react.activate(injected);
  }, [web3react])

  // Local State hooks
  // const [events, setEvents] = React.useState<EventData[]>([]);
  const [stakes, setStakes] = React.useState<Stake[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [addDialogIsOpen, setAddDialogOpen] = React.useState<boolean>(false);
  const sortedStakes = React.useMemo(() => sortByUnlockDay(stakes), [stakes])

  // Refs
  const addrInput = React.useRef<Input>() as any;

  const [hexPriceEth] = useContract<number>(
    web3react,
    UNISWAP_HEX.abi,
    UNISWAP_HEX.address,
    useCallbackWithInterval(async (contract) => {
      const theorethicalSellAmount = 1000;
      const theorethicalEthAmount = await contract.methods.getTokenToEthInputPrice(theorethicalSellAmount).call()
      return (theorethicalEthAmount / theorethicalSellAmount) / 10e9 // from Gwei
    }, [], updateInterval)
  )

  const [ethPriceUsd] = useContract<number>(
    web3react,
    MAKER_ETHUSD.abi,
    MAKER_ETHUSD.address,
    useCallbackWithInterval(async (contract, library) => {
      const resultWei = await contract.methods.read().call()
      return parseFloat(library.utils.fromWei(resultWei))
    }, [], updateInterval)
  )

  const [hexBalances] = useContract<HexBalance[]>(web3react, HEX.abi, HEX.address, React.useCallback(async (contract) => {
    const balances = await Promise.all(accounts.map((acc) => contract.methods.balanceOf(acc).call()))
    return balances.map((balance, index) => ({ address: accounts[index], balance }))
  }, [ accounts ]))

  const hexPriceUsd = (hexPriceEth !== null && ethPriceUsd !== null) ? hexPriceEth * ethPriceUsd : null

  //;(window as any).web3 = web3react.library

  const downloadIcal = () => {
    const calendar = ical({
      domain: iCalDomain,
      prodId: iCalProdId,
      events: sortedStakes.map((stake) => {
        return {
          uid: `stake-${stake.stakeId}`,
          start: stake.unlockDay,
          end: stake.unlockDay.endOf('day'),
          allDay: true,
          summary: 'HEX unlock day for #' + stake.stakeId,
          location: 'https://go.hex.win/stake/',
          description: `You need to take action for your ${formatHearts(stake.stakedHearts)} HEX stake #${stake.stakeId}.

This stake with has been made with account ${stake.address}.

Reminder created by HEXCAL: https://coinyon.github.io/hexcal/
Please donate if you found this useful.`
        }
      })
    });

    download(calendar.toString(), "MyHEXStakes.ics", "text/calendar");
  }

  React.useEffect(() => {
    if (library && account) {
      const contract = new library.eth.Contract(HEX.abi, HEX.address);
      if (accounts.length === 0) {
        setAccounts([account]);
      }

      const getStakes = (acc: string): Promise<Stake[]> => {
        return new Promise((resolveStakes) => {
          new Promise((resolve) => {
            contract.methods.stakeCount(acc).call()
            .then((stakeCountStr: string) => resolve(parseInt(stakeCountStr)))
            .catch(() => {
              resolve(0);
            })
          }).then((stakeCount) => {
            const eventsPromises = Array.from(new Array(stakeCount).keys()).map(
              (n) => {
                return contract.methods.stakeLists(acc, n).call()
              }
            )
            Promise.all(eventsPromises)
            .then((stakes: any[]) => {
              resolveStakes(stakes.map((st) => {
                const lockedDay = parseInt(st.lockedDay)
                const stakedDays = parseInt(st.stakedDays)
                const unlockedDay = parseInt(st.unlockedDay)
                return {
                  address: acc,
                  stakeId: parseInt(st.stakeId),
                  stakedDays,
                  stakedHearts: parseInt(st.stakedHearts),
                  stakeShares: parseInt(st.stakeShares),
                  lockedDay,
                  unlockedDay,
                  isAutoStake: st.isAutoStake,
                  unlockDay: momentForDay(lockedDay + stakedDays + 1)
                }
              }))
            })
            .catch(() => resolveStakes([]))
          });
        });
      }

      setLoading(true);
      Promise.all(accounts.map(getStakes))
      .then((stakesLists: Stake[][]) => { setStakes(flatten(stakesLists)) })
      .finally(() => setLoading(false));
    }
  }, [account, library, accounts, setAccounts]);

  const [lastDay] = useContract<number>(
    web3react,
    HEX.abi,
    HEX.address,
    useCallbackWithInterval(async (contract) => {
      let globalInfo = await contract.methods.globalInfo().call();
      const lastDay = globalInfo[4];
      return Number.parseInt(lastDay);
    }, [], updateInterval)
  )

  const [dailyInterest] = useContract<DailyInterest | null>(
    web3react, HEX.abi, HEX.address, React.useCallback(async (contract, library) => {
      const minDay = stakes.reduce<number>((day, stake) => Math.min(day, stake.lockedDay), Infinity)
      if (minDay !== Infinity && lastDay) {
        // Here we could use "useMemo" so that the daily data is only loaded when date range
        // is outside the currently loaded DailyInterest
        // console.log("Stakes updated, ... loading daily data...from", minDay, "to", lastDay)
        const encodedDailyData = await contract.methods.dailyDataRange(minDay, lastDay).call()
        const interest: DailyInterest = []
        encodedDailyData.forEach((encodedDayData: string, index: number) => {
          const dailyBytes = library.utils.hexToBytes(library.utils.numberToHex(encodedDayData))
          const payout = new BigNumber(library.utils.bytesToHex(dailyBytes.slice(-9)))
          const shares = new BigNumber(library.utils.bytesToHex(dailyBytes.slice(-18, -9)))
          interest[minDay + index] = payout.dividedBy(shares).toNumber()
        })
        return interest
      }
      return null
    }, [ stakes, lastDay ]))

  const totalInterestHearts = React.useMemo(() => {
    if (stakes !== null && dailyInterest !== null && lastDay !== null) {
      return sum(stakes.map((st) => {
        return sum(map((day) => dailyInterest[day] * st.stakeShares, range(st.lockedDay, lastDay)))
      }))
    } else {
      return null
    }
  }, [ stakes, dailyInterest, lastDay ])

  const totalUnstakedHearts = React.useMemo(() => sum(map(prop("balance"), hexBalances || [])), [ hexBalances ])

  const currentDay = moment();

  // Callbacks
  const removeAccount = React.useCallback((acc) => {
    setAccounts(reject(equals(acc))(accounts))
  }, [ accounts, setAccounts ])

  const unstackedTable = React.useMemo(() => {
    return totalUnstakedHearts === null || hexBalances === null || hexPriceUsd === null ?
              <div>Loading...</div> : (totalUnstakedHearts === 0 ?
                                    <div>No unstaked HEX present in your accounts.</div> :
              <>
              <Table basic='very'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Account</Table.HeaderCell>
                    <Table.HeaderCell>Amount<small> (HEX)</small></Table.HeaderCell>
                    <Table.HeaderCell><small>(USD)</small></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {hexBalances.filter(({ balance }) => balance > 0).map(({ address, balance }) => <Table.Row key={address}>
                        <Table.Cell><AddressLabel address={address} /></Table.Cell>
                        <Table.Cell textAlign="right">{formatHearts(balance)}</Table.Cell>
                        <Table.Cell textAlign="right">{formatUSD(balance / 1e8 * hexPriceUsd)}</Table.Cell>
                    </Table.Row>)}
                    <Table.Row key={"summary"}>
                      <Table.Cell></Table.Cell>
                      <Table.Cell textAlign="right">{formatHearts(totalUnstakedHearts)}</Table.Cell>
                      <Table.Cell textAlign="right">{formatUSD(totalUnstakedHearts / 1e8 * hexPriceUsd)}</Table.Cell>
                    </Table.Row>
                </Table.Body>
                </Table>
              </>)
  }, [ hexBalances, hexPriceUsd, totalUnstakedHearts ])

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle' className="App">
      <Grid.Column style={{ maxWidth: '630px' }}>
        <Header as="header">
          <Image src={logo} size="big" className="App-logo" alt="logo" />
          <h2>HEXCAL</h2>
          <h4>Do not miss your unlock days</h4>
        </Header>
        <Form size='large'>
        {!active ?
          <>
          <Segment placeholder>
            <p>
              HEXCAL allows you to add the unlock days of your <a className="App-link" href={"https://go.hex.win/?r=" + referalAddr} target='_blank' rel="noopener noreferrer">HEX</a> stakes to your calendar.
            </p>
            <p style={{ textAlign: "left" }}>
            <ul>
              <li>Add as many ETH addresses as you want</li>
              <li>See your stakes' unlock days, principal and interest in HEX and USD</li>
              <li>Download an iCAL/ICS file to import the unlock days into your calendar app</li>
              <li>Privacy-friendly: No cookies, no tracking, only Web3-communication</li>
              <li>Open Source</li>
              </ul>
            </p>
            <p>
              <i>In order to use HEXCAL, you need a Web3 enabled browser (e.g. Metamask).</i>
            </p>
            <Button primary onClick={() => activate()}>
              Connect to Web3
            </Button>
          {error ? "error" : null}
          </Segment>
          </>: null }
        {(active && account) ?
          <Card fluid>
            <Card.Content>
            { accounts.map((acc) => <AddressLabel key={acc} address={acc} onDelete={removeAccount} />) }
            <Modal
              trigger={
                <Button size="mini" onClick={() => setAddDialogOpen(true)}>
                  <Icon name="add" />
                  Add Account
                </Button>
              }
              size='mini'
              open={addDialogIsOpen}
              onClose={() => setAddDialogOpen(false)}
            >
              <Modal.Content>
                Ethereum address:
                <Input fluid ref={addrInput} placeholder='0x0000000000000000000000000000000000000000' />
              </Modal.Content>
              <Modal.Actions>
                <Button primary onClick={() => {
                  const addr = addrInput.current.inputRef.current.value;
                  if (Web3.utils.isAddress(addr)) {
                    setAccounts(accounts.concat(addr));
                    setAddDialogOpen(false);
                  }
                }}>
                  <Icon name='add' /> Add Account
                </Button>
              </Modal.Actions>
            </Modal>
          </Card.Content>
          <Card.Content>
          <Header>
            <Grid columns='two'>
              <Grid.Row>
                <Grid.Column textAlign="left">
                  Open HEX stakes
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <Button primary disabled={loading} onClick={() => downloadIcal()} fitted>
                    <Icon name="download" /> Download as iCal/ICS
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Header>
          <Segment loading={loading} basic style={{ padding: '1em 0em' }}>
            { loading ?
              'Loading...' :
              <>
              <Table basic='very'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Account</Table.HeaderCell>
                    <Table.HeaderCell>Unlock day</Table.HeaderCell>
                    <Table.HeaderCell>Interval</Table.HeaderCell>
                    <Table.HeaderCell>Principal<small> (HEX)</small></Table.HeaderCell>
                    <Table.HeaderCell><small>(USD)</small></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sortedStakes.map((stake: Stake) => (
                    <StakeRow
                      key={stake.stakeId}
                      stake={stake}
                      currentDay={currentDay}
                      hexPriceUsd={hexPriceUsd}
                    />
                  ))}
                  <SummaryRows
                    stakes={stakes}
                    hexPriceUsd={hexPriceUsd}
                    totalUnstakedHearts={totalUnstakedHearts}
                    totalInterestHearts={totalInterestHearts}
                    unstackedTable={unstackedTable}
                  />
                </Table.Body>
                </Table>
              </> }
          </Segment>
          </Card.Content>
        </Card>

          : null }
        <Segment>
        Made with
        {" "}
        <a
          className="App-link"
          target="_blank"
          rel="noopener noreferrer"
          href={"https://go.hex.win/?r=" + referalAddr}
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
        </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default App;
