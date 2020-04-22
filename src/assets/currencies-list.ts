export const currencies = [
  // {
  //   'code': 'XDR',
  //   'name': 'Pays XDR',
  //   'icon': '/assets/img/xdr-coin.svg',
  //   'change': '-0.25',
  //   'usd': '0.0000090',
  //   'volume': '0',
  //   'depth': '5,026,742',
  //   'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
  //   'convert': '1',
  //   'favorites': '2',
  //   'issuer': 'GAWJSEVB6H4RIZX6FJJORJAXFLQDMFTKUAOU5UGFNWLPCYQ6A2O6PAYS',
  //   'baseUrl': 'https://api.apay.io/api',
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
    'icon': '/assets/img/XLM.png',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/btc.svg',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GAUTUYY2THLF7SGITDFMXJVYH3LHDSMGEAKSBU267M2K7A3W543CKUEF',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/usdt.svg',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GCQTGZQQ5G4PTM2GL7CDIFKUBIPEC52BROAQIAPW53XBRJVN6ZJVTG6V',
    'minDeposit': '0.5',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/eth.png',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/ltc.png',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GC5LOR3BK6KIOK7GKAUD5EGHQCMFOGHJTC7I3ELB66PTDFXORC2VM5LP',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/bat.svg',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/kin.svg',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/link.svg',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/omg.svg',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 8, 8, 7],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/rep.png',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
    'icon': '/assets/img/zrx.svg',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
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
  }
];

