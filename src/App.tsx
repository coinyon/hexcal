import React from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import * as HEX from './Hex';
import moment from 'moment';
import ical from 'ical-generator';
import { flatten, sort, reject, equals } from 'ramda';
import download from 'downloadjs';
import { Modal, Input, Button, Form, Grid, Label, Icon, Header, Image, Table, Card, Segment } from 'semantic-ui-react'
import { useHashAccountsStore } from "./AccountStore"

import logo from './logo.png';
import hexagon from './hexagon.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'

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
  address: string;
  unlockDay: moment.Moment;
}

const momentForDay = (day: number): moment.Moment => {
  return moment("20191203", "YYYYMMDD").add(day - 1, "days")
}

const ShortAddr: React.FC<{ address: string }> = ({ address }) => {
  return <span>{address.slice(0, 6) + "..." + address.slice(38)}</span>
}

const StakeRow: React.FC<{ stake: Stake, currentDay: moment.Moment }> = ({ stake }) => {
  return (
    <Table.Row key={stake.stakeId}>
      <Table.Cell>{stake.stakeId}</Table.Cell>
      <Table.Cell><Label><ShortAddr address={stake.address} /></Label></Table.Cell>
      <Table.Cell>{stake.unlockDay.calendar()}</Table.Cell>
      <Table.Cell>{stake.unlockDay.fromNow()}</Table.Cell>
    </Table.Row>
  );
}

const sortedStakes = sort<Stake>((st1, st2) => st1.unlockDay.diff(st2.unlockDay))

const App: React.FC = (_props) => {
  const web3react = useWeb3React<Web3>();
  const { account, library, active, error } = web3react;
  // const [events, setEvents] = React.useState<EventData[]>([]);
  const [stakes, setStakes] = React.useState<Stake[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [accounts, setAccounts] = useHashAccountsStore();
  const [addDialogIsOpen, setAddDialogOpen] = React.useState<boolean>(false);
  const addrInput = React.useRef<Input>() as any;

  (window as any).web3 = web3react;

  const activate = () => {
    web3react.activate(injected);
  }

  const downloadIcal = () => {
    const calendar = ical({
      domain: iCalDomain,
      prodId: iCalProdId,
      events: sortedStakes(stakes).map((stake) => {
        return {
          uid: `stake-${stake.stakeId}`,
          start: stake.unlockDay,
          end: stake.unlockDay.endOf('day'),
          allDay: true,
          summary: 'HEX unlock day for #' + stake.stakeId,
          location: 'https://go.hex.win/stake/',
          description: `You need to take action for your HEX stake #${stake.stakeId}.

This stake has been made with account ${stake.address}.

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
                  unlockDay: momentForDay(lockedDay + stakedDays)
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

  const currentDay = moment();

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle' className="App">
      <Grid.Column style={{ maxWidth: 450 }}>
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
            <p>
              In order to use HEXCAL, you need a Web3 enabled browser (e.g. Metamask).
              After you connected your account,
              you'll be able to download an iCAL/ICS file and import it into
              your calendar app.
            </p>
            <Button primary onClick={() => activate()}>
              Connect to Web3
            </Button>
          {error ? "error" : null}
          </Segment>
          </>: null }
        {(active && account) ?
          <Card fluid>
            <Card.Content header="Open HEX stakes" />
        <Card.Content>
            { accounts.map((acc) =>
              <Label key={acc}>
                <ShortAddr address={acc} />
                <Icon name='delete' onClick={() => setAccounts(reject(equals(acc))(accounts))} />
              </Label>) }
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
          <Segment loading={loading} basic>
            { loading ?
              'Loading...' :
              <>
              <Table basic='very' celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Account</Table.HeaderCell>
                    <Table.HeaderCell>Unlock day</Table.HeaderCell>
                    <Table.HeaderCell>Interval</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sortedStakes(stakes).map((stake: Stake) => <StakeRow key={stake.stakeId} stake={stake} currentDay={currentDay} />)}
                </Table.Body>
                </Table>
              </> }
          </Segment>
          </Card.Content>
          <Card.Content>
                <p>
                <Button primary disabled={loading} onClick={() => downloadIcal()}>
                  Download as iCal/ICS
                </Button>
                </p>
              </Card.Content>
              </Card>

          : null }
        <Segment>
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
        </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default App;
