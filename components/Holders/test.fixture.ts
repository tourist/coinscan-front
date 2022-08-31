import type { DailyHodlersStatesQuery } from '../../generated/graphql';
import type { DataPoint, TransactionsQueryData } from '../../utils/charts';

type HodlersChartData = DailyHodlersStatesQuery['dailyHoldersStates'];

export const testDataPointTransactions: DataPoint<number>[] = [
  { id: '1661414022', count: -9000000000000 },
  { id: '1661154822', count: 3000000000000 },
  { id: '1660895622', count: 1000000000000 },
  { id: '1660895622', count: 1000000000000 },
  { id: '1660895622', count: 1000000000000 },
  { id: '1660895622', count: -1000000000000 },
];

export const testDataTransactions: TransactionsQueryData = [
  {
    id: '0x40bdcdc1c629dad788fc7c78f45431507d0041bf3dbf4b4fdb0ea206aea216b8-202',
    txn: '0x40bdcdc1c629dad788fc7c78f45431507d0041bf3dbf4b4fdb0ea206aea216b8',
    timestamp: '1661414022',
    from: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    to: {
      id: '0xda2f8f62fdf65e0b9867875feaa4bb59255820e1',
      address: '0xda2f8f62fdf65e0b9867875feaa4bb59255820e1',
      __typename: 'Wallet',
    },
    value: '9000000000000',
    __typename: 'Transaction',
  },
  {
    id: '0xd32edf01122a349f7c7d55dcfbc08d4c8afe2ad96ca49ba36eb31c78810426e2-212',
    txn: '0xd32edf01122a349f7c7d55dcfbc08d4c8afe2ad96ca49ba36eb31c78810426e2',
    timestamp: '1661154822',
    from: {
      id: '0x21cbff56fccf44e5af5e1fcba465b440800f87ef',
      address: '0x21cbff56fccf44e5af5e1fcba465b440800f87ef',
      __typename: 'Wallet',
    },
    to: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    value: '3000000000000',
    __typename: 'Transaction',
  },
  {
    id: '0x9eb25f4e9dd71b6cfb37b1aee1899a087582eb17fe2ee3b688ff4124c1c1c40b-134',
    txn: '0x9eb25f4e9dd71b6cfb37b1aee1899a087582eb17fe2ee3b688ff4124c1c1c40b',
    timestamp: '1660895622',
    from: {
      id: '0x88dddf2a78813b012f96c49a95a9b55fec6df50a',
      address: '0x88dddf2a78813b012f96c49a95a9b55fec6df50a',
      __typename: 'Wallet',
    },
    to: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    value: '1000000000000',
    __typename: 'Transaction',
  },
  {
    id: '0x4990fe55a7eaad8bd7a4840bd8eda3d9e0ebc14ab32c2aa98b523b3ac588819c-379',
    txn: '0x4990fe55a7eaad8bd7a4840bd8eda3d9e0ebc14ab32c2aa98b523b3ac588819c',
    timestamp: '1660895622',
    from: {
      id: '0x88dddf2a78813b012f96c49a95a9b55fec6df50a',
      address: '0x88dddf2a78813b012f96c49a95a9b55fec6df50a',
      __typename: 'Wallet',
    },
    to: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    value: '1000000000000',
    __typename: 'Transaction',
  },
  {
    id: '0x064df4bdd6c1894107a25d0c56c66d257bee7795e4f7882bf7b524daec2cc9bb-137',
    txn: '0x064df4bdd6c1894107a25d0c56c66d257bee7795e4f7882bf7b524daec2cc9bb',
    timestamp: '1660895622',
    from: {
      id: '0x88dddf2a78813b012f96c49a95a9b55fec6df50a',
      address: '0x88dddf2a78813b012f96c49a95a9b55fec6df50a',
      __typename: 'Wallet',
    },
    to: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    value: '1000000000000',
    __typename: 'Transaction',
  },
  {
    id: '0x9d375ca2f49f6b98c99045021e28e732c6da64284e4529698f3b8749cb2fb96b-201',
    txn: '0x9d375ca2f49f6b98c99045021e28e732c6da64284e4529698f3b8749cb2fb96b',
    timestamp: '1660895622',
    from: {
      id: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      address: '0xa43a1fa8435483c49c79b37d729c47821eac6cda',
      __typename: 'Wallet',
    },
    to: {
      id: '0xda2f8f62fdf65e0b9867875feaa4bb59255820e1',
      address: '0xda2f8f62fdf65e0b9867875feaa4bb59255820e1',
      __typename: 'Wallet',
    },
    value: '1000000000000',
    __typename: 'Transaction',
  },
];

export const testDataDailyHolders: HodlersChartData = [
  {
    id: '1658361600',
    count: 6341,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1658275200',
    count: 6341,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1658188800',
    count: 6347,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1658102400',
    count: 6346,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1658016000',
    count: 6343,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657929600',
    count: 6347,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657843200',
    count: 6350,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657756800',
    count: 6338,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657670400',
    count: 6338,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657584000',
    count: 6336,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657497600',
    count: 6328,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657411200',
    count: 6320,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657324800',
    count: 6321,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657238400',
    count: 6320,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657152000',
    count: 6323,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1657065600',
    count: 6313,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656979200',
    count: 6314,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656892800',
    count: 6310,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656806400',
    count: 6300,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656720000',
    count: 6301,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656633600',
    count: 6301,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656547200',
    count: 6302,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656460800',
    count: 6297,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656374400',
    count: 6299,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656288000',
    count: 6298,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656201600',
    count: 6289,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656115200',
    count: 6283,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1656028800',
    count: 6283,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655942400',
    count: 6286,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655856000',
    count: 6285,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655769600',
    count: 6284,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655683200',
    count: 6275,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655596800',
    count: 6276,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655510400',
    count: 6282,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655424000',
    count: 6280,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655337600',
    count: 6279,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655251200',
    count: 6285,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655164800',
    count: 6286,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1655078400',
    count: 6287,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654992000',
    count: 6290,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654905600',
    count: 6296,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654819200',
    count: 6295,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654732800',
    count: 6298,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654646400',
    count: 6300,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654560000',
    count: 6298,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654473600',
    count: 6293,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654387200',
    count: 6289,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654300800',
    count: 6290,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654214400',
    count: 6292,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654128000',
    count: 6293,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1654041600',
    count: 6289,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653955200',
    count: 6291,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653868800',
    count: 6290,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653782400',
    count: 6287,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653696000',
    count: 6286,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653609600',
    count: 6279,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653523200',
    count: 6274,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653436800',
    count: 6276,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653350400',
    count: 6262,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653264000',
    count: 6263,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653177600',
    count: 6259,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653091200',
    count: 6262,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1653004800',
    count: 6258,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652918400',
    count: 6258,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652832000',
    count: 6253,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652745600',
    count: 6246,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652659200',
    count: 6246,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652572800',
    count: 6253,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652486400',
    count: 6256,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652400000',
    count: 6255,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652313600',
    count: 6252,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652227200',
    count: 6269,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652140800',
    count: 6277,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1652054400',
    count: 6277,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651968000',
    count: 6293,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651881600',
    count: 6304,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651795200',
    count: 6296,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651708800',
    count: 6296,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651622400',
    count: 6289,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651536000',
    count: 6288,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651449600',
    count: 6290,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651363200',
    count: 6289,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651276800',
    count: 6283,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651190400',
    count: 6286,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651104000',
    count: 6290,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1651017600',
    count: 6288,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650931200',
    count: 6295,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650844800',
    count: 6295,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650758400',
    count: 6291,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650672000',
    count: 6284,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650585600',
    count: 6286,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650499200',
    count: 6289,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650412800',
    count: 6284,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650326400',
    count: 6285,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650240000',
    count: 6288,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650153600',
    count: 6296,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1650067200',
    count: 6295,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649980800',
    count: 6298,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649894400',
    count: 6302,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649808000',
    count: 6305,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649721600',
    count: 6296,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649635200',
    count: 6293,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649548800',
    count: 6302,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649462400',
    count: 6296,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649376000',
    count: 6290,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649289600',
    count: 6279,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649203200',
    count: 6271,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649116800',
    count: 6265,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1649030400',
    count: 6263,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648944000',
    count: 6254,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648857600',
    count: 6233,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648771200',
    count: 6221,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648684800',
    count: 6208,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648598400',
    count: 6180,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648512000',
    count: 6157,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648425600',
    count: 6159,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648339200',
    count: 6152,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648252800',
    count: 6135,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648166400',
    count: 6138,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1648080000',
    count: 6132,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647993600',
    count: 6119,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647907200',
    count: 6107,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647820800',
    count: 6105,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647734400',
    count: 6096,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647648000',
    count: 6100,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647561600',
    count: 6098,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647475200',
    count: 6091,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647388800',
    count: 6043,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647302400',
    count: 6038,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647216000',
    count: 6029,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647129600',
    count: 6019,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1647043200',
    count: 6006,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646956800',
    count: 6016,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646870400',
    count: 6025,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646784000',
    count: 6026,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646697600',
    count: 6023,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646611200',
    count: 6027,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646524800',
    count: 6029,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646438400',
    count: 6040,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646352000',
    count: 6040,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646265600',
    count: 6043,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646179200',
    count: 6047,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646092800',
    count: 6049,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1646006400',
    count: 6028,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645920000',
    count: 6020,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645833600',
    count: 6013,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645747200',
    count: 6004,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645660800',
    count: 6007,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645574400',
    count: 6039,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645488000',
    count: 6046,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645401600',
    count: 6037,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645315200',
    count: 6033,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645228800',
    count: 6031,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645142400',
    count: 6017,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1645056000',
    count: 6016,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644969600',
    count: 6022,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644883200',
    count: 5835,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644796800',
    count: 5810,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644710400',
    count: 5815,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644624000',
    count: 5807,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644537600',
    count: 5803,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644451200',
    count: 5806,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644364800',
    count: 5792,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644278400',
    count: 5757,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644192000',
    count: 5751,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644105600',
    count: 5729,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1644019200',
    count: 5714,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643932800',
    count: 5695,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643846400',
    count: 5675,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643760000',
    count: 5677,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643673600',
    count: 5667,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643587200',
    count: 5644,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643500800',
    count: 5623,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643414400',
    count: 5639,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643328000',
    count: 5623,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643241600',
    count: 5605,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643155200',
    count: 5615,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1643068800',
    count: 5630,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642982400',
    count: 5623,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642896000',
    count: 5632,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642809600',
    count: 5634,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642723200',
    count: 5646,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642636800',
    count: 5665,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642550400',
    count: 5661,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642464000',
    count: 5673,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642377600',
    count: 5686,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642291200',
    count: 5689,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642204800',
    count: 5684,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642118400',
    count: 5686,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1642032000',
    count: 5695,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641945600',
    count: 5702,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641859200',
    count: 5699,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641772800',
    count: 5701,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641686400',
    count: 5714,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641600000',
    count: 5717,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641513600',
    count: 5731,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641427200',
    count: 5730,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641340800',
    count: 5756,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641254400',
    count: 5747,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641168000',
    count: 5737,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1641081600',
    count: 5731,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640995200',
    count: 5729,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640908800',
    count: 5696,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640822400',
    count: 5675,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640736000',
    count: 5653,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640649600',
    count: 5608,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640563200',
    count: 5597,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640476800',
    count: 5541,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640390400',
    count: 5470,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640304000',
    count: 5435,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640217600',
    count: 5397,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640131200',
    count: 5377,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1640044800',
    count: 5379,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639958400',
    count: 5380,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639872000',
    count: 5358,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639785600',
    count: 5346,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639699200',
    count: 5346,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639612800',
    count: 5353,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639526400',
    count: 5350,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639440000',
    count: 5355,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639353600',
    count: 5362,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639267200',
    count: 5373,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639180800',
    count: 5344,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639094400',
    count: 5334,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1639008000',
    count: 5352,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638921600',
    count: 5373,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638835200',
    count: 5378,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638748800',
    count: 5393,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638662400',
    count: 5373,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638576000',
    count: 5369,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638489600',
    count: 5342,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638403200',
    count: 5342,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638316800',
    count: 5273,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638230400',
    count: 5248,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638144000',
    count: 5266,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1638057600',
    count: 5214,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637971200',
    count: 5132,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637884800',
    count: 5021,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637798400',
    count: 4825,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637712000',
    count: 4367,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637625600',
    count: 3985,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637539200',
    count: 3913,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637452800',
    count: 3875,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637366400',
    count: 3745,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637280000',
    count: 3692,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637193600',
    count: 3653,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637107200',
    count: 3619,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1637020800',
    count: 3578,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636934400',
    count: 3519,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636848000',
    count: 3419,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636761600',
    count: 3318,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636675200',
    count: 3223,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636588800',
    count: 3125,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636502400',
    count: 3112,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636416000',
    count: 3078,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636329600',
    count: 3007,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636243200',
    count: 2888,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636156800',
    count: 2665,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1636070400',
    count: 2545,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1635984000',
    count: 2291,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1635897600',
    count: 2299,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1635811200',
    count: 2308,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1635724800',
    count: 2289,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1635638400',
    count: 2250,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1635552000',
    count: 2208,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1635465600',
    count: 2167,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1635379200',
    count: 2186,
    __typename: 'DailyHoldersState',
  },
  {
    id: '1635292800',
    count: 2142,
    __typename: 'DailyHoldersState',
  },
];
