export const currencies = [
  // {
  //   'code': 'XDR',
  //   'name': 'Pays XDR',
  //   image: '/assets/img/xdr-coin.svg',
  //   'convert': '1',
  //   'issuer': 'GAWJSEVB6H4RIZX6FJJORJAXFLQDMFTKUAOU5UGFNWLPCYQ6A2O6PAYS',
  //   transferServer: 'https://api.apay.io/api',
  //   'balance': '0',
  //   'percent': '-',
  //   'value': 0,
  //   'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
  //   'deposit': 'active',
  //   'withdraw': 'active',
  //   'color': '#211265',
  //   stellarNative: true,
  //   'trustline': false
  // },
  {
    'code': 'XLM',
    'name': 'Lumen',
    image: '/assets/img/XLM.png',
    'issuer': null,
    'convert': '1',
    transferServer: 'https://api.apay.io/api',
    'color': '#000000',
    stellarNative: true,
    'trustline': false,
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 1,
      fee: ''
    },
    withdraw: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 1,
      fee: '0 XLM'
    },
  },
  {
    'code': 'BTC',
    'name': 'Bitcoin',
    image: '/assets/img/btc.svg',
    'convert': '1',
    'issuer': 'GAUTUYY2THLF7SGITDFMXJVYH3LHDSMGEAKSBU267M2K7A3W543CKUEF',
    transferServer: 'https://api.apay.io/api',
    'color': '#f89f37',
    stellarNative: false,
    'trustline': false,
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 0.0002,
      fee: ''
    },
    withdraw: {
      enabled: true,
      fee_fixed: 0.0001,
      fee_percent: 0.001,
      min_amount: 0.0002,
      fee: '0.1% + 0.0001 BTC'
    },
  },
  {
    code: 'USDT',
    name: 'Tether USD',
    image: '/assets/img/usdt.svg',
    'convert': '1',
    'issuer': 'GCQTGZQQ5G4PTM2GL7CDIFKUBIPEC52BROAQIAPW53XBRJVN6ZJVTG6V',
    'minDeposit': '0.5',
    transferServer: 'https://api.apay.io/api',
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 1,
      fee: ''
    },
    'color': '#4CB095',
    stellarNative: false,
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 1,
      fee_percent: 0.001,
      min_amount: 2,
      fee: '0.1% + 1 USDT'
    },
  },
  {
    'code': 'ETH',
    'name': 'Ethereum',
    image: '/assets/img/eth.png',
    'convert': '1',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    transferServer: 'https://api.apay.io/api',
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 0.01,
      fee: ''
    },
    'color': '#0faed3',
    stellarNative: false,
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.001,
      fee_percent: 0.001,
      min_amount: 0.01,
      fee: '0.1% + 0.001 ETH'
    },
  },
  {
    'code': 'LTC',
    'name': 'Litecoin',
    image: '/assets/img/ltc.png',
    'convert': '1',
    'issuer': 'GC5LOR3BK6KIOK7GKAUD5EGHQCMFOGHJTC7I3ELB66PTDFXORC2VM5LP',
    transferServer: 'https://api.apay.io/api',
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 0.02,
      fee: ''
    },
    'color': '#305c9f',
    stellarNative: false,
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.01,
      fee_percent: 0.001,
      min_amount: 0.02,
      fee: '0.1% + 0.01 LTC'
    },
  },
  {
    'code': 'BAT',
    'name': 'Basic Attention Token',
    image: '/assets/img/bat.svg',
    'convert': '1',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    transferServer: 'https://api.apay.io/api',
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 10,
      fee: ''
    },
    'color': '#ff4f00',
    stellarNative: false,
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 1,
      fee_percent: 0.001,
      min_amount: 10,
      fee: '0.1% + 1 BAT'
    },
  },
  {
    'code': 'KIN',
    'name': 'Kin',
    image: '/assets/img/kin.svg',
    'convert': '1',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    transferServer: 'https://api.apay.io/api',
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 1,
      fee: ''
    },
    'color': '#003ec5',
    stellarNative: false,
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0,
      fee_percent: 0.001,
      min_amount: 0,
      fee: '0.1%'
    },
  },
  {
    'code': 'LINK',
    'name': 'ChainLink',
    image: '/assets/img/link.svg',
    'convert': '1',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    transferServer: 'https://api.apay.io/api',
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 2,
      fee: ''
    },
    'color': '#a5c1e0',
    stellarNative: false,
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.1,
      fee_percent: 0.001,
      min_amount: 2,
      fee: '0.1% + 0.1 LINK'
    },
  },
  {
    'code': 'OMG',
    'name': 'OmiseGo',
    image: '/assets/img/omg.svg',
    'convert': '1',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    transferServer: 'https://api.apay.io/api',
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 0.4,
      fee: ''
    },
    'color': '#1a53f0',
    stellarNative: false,
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.2,
      fee_percent: 0.001,
      min_amount: 0.4,
      fee: '0.1% + 0.2 OMG'
    },
  },
  {
    'code': 'REP',
    'name': 'Augur',
    image: '/assets/img/rep.png',
    'convert': '1',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    transferServer: 'https://api.apay.io/api',
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 0.1,
      fee: ''
    },
    'color': '#ad9dc0',
    stellarNative: false,
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.01,
      fee_percent: 0.001,
      min_amount: 0.1,
      fee: '0.1% + 0.01 REP'
    },
  },
  {
    'code': 'ZRX',
    'name': '0xProject',
    image: '/assets/img/zrx.svg',
    'convert': '1',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    transferServer: 'https://api.apay.io/api',
    deposit: {
      enabled: true,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 2,
      fee: ''
    },
    'color': '#1c2127',
    stellarNative: false,
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 1,
      fee_percent: 0.001,
      min_amount: 2,
      fee: '0.1% + 1 ZRX'
    },
  },
  {
    'code': 'TERN',
    'name': 'Ternio',
    image: '/assets/img/tern.png',
    'convert': '1',
    'issuer': 'GDGQDVO6XPFSY4NMX75A7AOVYCF5JYGW2SHCJJNWCQWIDGOZB53DGP6C',
    deposit: {
      enabled: false,
      fee_fixed: 0.0,
      fee_percent: 0,
      min_amount: 10,
      fee: ''
    },
    'color': '#1d344e',
    stellarNative: true,
    'trustline': false,
    withdraw: {
      enabled: false,
      fee_fixed: 0,
      fee_percent: 0.0,
      min_amount: 10,
      fee: 'free'
    },
  },
];

