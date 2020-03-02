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
  //   'minDeposit': '',
  //   'minWithdraw': '',
  //   'minWithdrawFee': '',
  //   'baseUrl': 'https://api.apay.io/api',
  //   'balance': '0',
  //   'percent': '-',
  //   'value': 0,
  //   'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
  //   'deposit': 'active',
  //   'withdraw': 'active',
  //   'color': '#211265',
  //   'address': 'native',
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
    'minDeposit': '',
    'minWithdraw': '',
    'minWithdrawFee': '',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.00001,
      fee_percent: 0,
      min_amount: 1,
    },
  },
  {
    'code': 'BTC',
    'name': 'Bitcoin',
    'icon': 'https://apay.io/public/logo/btc.svg',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GAUTUYY2THLF7SGITDFMXJVYH3LHDSMGEAKSBU267M2K7A3W543CKUEF',
    'minDeposit': '0.0002',
    'minWithdraw': '0.001',
    'minWithdrawFee': '0.0005',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.00001,
      fee_percent: 0,
      min_amount: 1,
    },
  },
  {
    'code': 'BCH',
    'name': 'Bitcoin Cash',
    'icon': 'https://apay.io/public/logo/bch.svg',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GAEGOS7I6TYZSVHPSN76RSPIVL3SELATXZWLFO4DIAFYJF7MPAHFE7H4',
    'minDeposit': '0.001',
    'minWithdraw': '0.004',
    'minWithdrawFee': '0.002',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.0001,
      fee_percent: 0.1,
      min_amount: 0.0002,
    },
  },
  {
    'code': 'ETH',
    'name': 'Ethereum',
    'icon': 'https://apay.io/public/logo/eth.png',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'minDeposit': '0.001',
    'minWithdraw': '0.01',
    'minWithdrawFee': '0.005',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.001,
      fee_percent: 0.1,
      min_amount: 0.01,
    },
  },
  {
    'code': 'LTC',
    'name': 'Litecoin',
    'icon': 'https://apay.io/public/logo/ltc.png',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GC5LOR3BK6KIOK7GKAUD5EGHQCMFOGHJTC7I3ELB66PTDFXORC2VM5LP',
    'minDeposit': '0.01',
    'minWithdraw': '0.05',
    'minWithdrawFee': '0.025',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.01,
      fee_percent: 0.1,
      min_amount: 0.02,
    },
  },
  {
    'code': 'BAT',
    'name': 'Basic Attention Token',
    'icon': 'https://apay.io/public/logo/bat.svg',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'minDeposit': '2',
    'minWithdraw': '10',
    'minWithdrawFee': '5',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 1,
      fee_percent: 0.1,
      min_amount: 10,
    },
  },
  {
    'code': 'KIN',
    'name': 'Kin',
    'icon': 'https://apay.io/public/logo/kin.svg',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'minDeposit': '',
    'minWithdraw': '20000',
    'minWithdrawFee': '10000',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0,
      fee_percent: 0.1,
      min_amount: 0,
    },
  },
  {
    'code': 'LINK',
    'name': 'ChainLink',
    'icon': 'https://apay.io/public/logo/link.svg',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'minDeposit': '2',
    'minWithdraw': '10',
    'minWithdrawFee': '5',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.1,
      fee_percent: 0.1,
      min_amount: 2,
    },
  },
  {
    'code': 'MTL',
    'name': 'Metal',
    'icon': 'https://apay.io/public/logo/mtl.svg',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'minDeposit': '0.3',
    'minWithdraw': '1',
    'minWithdrawFee': '0.5',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.5,
      fee_percent: 0.1,
      min_amount: 1,
    },
  },
  {
    'code': 'OMG',
    'name': 'OmiseGo',
    'icon': 'https://apay.io/public/logo/omg.svg',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 8, 8, 7],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'minDeposit': '0.1',
    'minWithdraw': '0.4',
    'minWithdrawFee': '0.2',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.2,
      fee_percent: 0.1,
      min_amount: 0.4,
    },
  },
  {
    'code': 'REP',
    'name': 'Augur',
    'icon': 'https://apay.io/public/logo/rep.png',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'minDeposit': '0.02',
    'minWithdraw': '0.1',
    'minWithdrawFee': '0.05',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 0.01,
      fee_percent: 0.1,
      min_amount: 0.1,
    },
  },
  {
    'code': 'SALT',
    'name': 'SALT',
    'icon': 'https://apay.io/public/logo/salt.svg',
    'change': '+0.252',
    'usd': '0.02000090',
    'volume': '20',
    'depth': '25,026,742',
    'graph': [9, 7, 5, 4, 8, 4, 1, 2, 4, 8, 4, 1, 2, 5, 6],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'minDeposit': '0.5',
    'minWithdraw': '2',
    'minWithdrawFee': '1',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 1,
      fee_percent: 0.1,
      min_amount: 2,
    },
  },
  {
    'code': 'ZRX',
    'name': '0xProject',
    'icon': 'https://apay.io/public/logo/zrx.svg',
    'change': '-0.25',
    'usd': '0.0000090',
    'volume': '0',
    'depth': '5,026,742',
    'graph': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'convert': '1',
    'favorites': '2',
    'issuer': 'GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR',
    'minDeposit': '0.5',
    'minWithdraw': '4',
    'minWithdrawFee': '2',
    'baseUrl': 'https://api.apay.io/api',
    'balance': '0',
    'percent': '-',
    'value': 0,
    'chart': [0, 1, 2, 1, 0, 4, 7, 3, 1, 2, 1, 0, 4, 7, 3],
    'deposit': 'active',
    'color': '#000000',
    'address': 'native',
    'trustline': false,
    withdraw: {
      enabled: true,
      fee_fixed: 1,
      fee_percent: 0.1,
      min_amount: 2,
    },
  }
];

