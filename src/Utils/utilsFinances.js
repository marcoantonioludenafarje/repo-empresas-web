import IntlMessages from '../@crema/utility/IntlMessages';

export const showStatus = (status, typeFinance) => {
  if (typeFinance == 'INCOME') {
    switch (status) {
      case 'paid':
        return <IntlMessages id='finance.status.income.paid' />;
        break;
      case 'advance':
        return <IntlMessages id='finance.status.income.advance' />;
        break;
      case 'toPaid':
        return <IntlMessages id='finance.status.income.toPaid' />;
        break;
      default:
        return null;
    }
  } else if (typeFinance == 'EXPENSE') {
    switch (status) {
      case 'paid':
        return <IntlMessages id='finance.status.expense.paid' />;
        break;
      case 'advance':
        return <IntlMessages id='finance.status.expense.advance' />;
        break;
      case 'toPaid':
        return <IntlMessages id='finance.status.expense.toPaid' />;
        break;
      default:
        return null;
    }
  } else {
    return null;
  }
};

export const unitMeasureOptions = [
  {value: 'NIU', label: 'BIEN'},
  {value: 'ZZ', label: 'SERVICIO'},
  {value: 'CAJ', label: 'CAJA'},
  {value: 'KGM', label: 'KGM'},
  {value: '126', label: 'DOCENA POR 10**6'},
  {value: '12U', label: 'DOCENA'},
  {value: '2U', label: 'PAR'},
  {value: '2U6', label: 'PAR POR 10**6'},
  {value: 'AM', label: 'AMPOLLA'},
  {value: 'BAL', label: 'BALDE'},
  {value: 'BID', label: 'BIDONES'},
  {value: 'BLS', label: 'BOLSA'},
  {value: 'BOB', label: 'BOBINAS'},
  {value: 'BOT', label: 'BOTELLAS'},
  {value: 'BRR', label: 'BARRILES'},
  {value: 'CIL', label: 'CILINDRO'},
  {value: 'CM', label: 'CENTIMETRO LINEAL'},
  {value: 'CM2', label: 'CENTIMETRO CUADRADO'},
  {value: 'CM3', label: 'CENTIMETRO CUBICO'},
  {value: 'CON', label: 'CONOS'},
  {value: 'CRT', label: 'CARTONES'},
  {value: 'FDO', label: 'FARDO'},
  {value: 'FRC', label: 'FRASCOS'},
  {value: 'GAL', label: 'US GALON (3,7843 L)'},
  {value: 'GLE', label: 'GALON INGLES (4,545956L)'},
  {value: 'GR', label: 'GRAMO'},
  {value: 'GRU', label: 'GRUESA'},
  {value: 'HL', label: 'HECTOLITRO'},
  {value: 'HOJ', label: 'HOJA'},
  {value: 'JGS', label: 'JUEGO'},
  {value: 'KG', label: 'KILOGRAMO'},
  {value: 'KG3', label: 'KILOGRAMO POR 10**3 (TM)'},
  {value: 'KG6', label: 'KILOGRAMO POR 10**6'},
  {value: 'KGA', label: 'KILOGRAMO INGREDIENTE ACTIVO'},
  {value: 'KI', label: 'QUILATE'},
  {value: 'KI6', label: 'QUILATE 10**6'},
  {value: 'KIT', label: 'KIT'},
  {value: 'KL6', label: 'KILOS X 10 EXP - 6 (MG)'},
  {value: 'KL9', label: 'KILOS X 10 EXP -9'},
  {value: 'KM', label: 'KILOMETRO'},
  {value: 'KW3', label: 'KILOVATIO HORA POR 10**3 (1000KWH)'},
  {value: 'KW6', label: 'KILOVATIO HORA POR 10**6'},
  {value: 'KWH', label: 'KILOVATIO HORA'},
  {value: 'L', label: 'LITRO'},
  {value: 'L 6', label: 'LITRO POR 10**6'},
  {value: 'LAT', label: 'LATAS'},
  {value: 'LB', label: 'LIBRAS'},
  {value: 'M', label: 'METRO'},
  {value: 'M 6', label: 'METRO POR 10**6'},
  {value: 'M2', label: 'METRO CUADRADO'},
  {value: 'M26', label: 'METRO CUADRADO POR 10**6'},
  {value: 'M3', label: 'METRO CUBICO'},
  {value: 'M36', label: 'METRO CUBICO POR 10**6'},
  {value: 'MGA', label: 'MILIGRAMO ACTIVO'},
  {value: 'MGR', label: 'MILIGRAMOS'},
  {value: 'ML', label: 'MILILITRO'},
  {value: 'MLL', label: 'MILLARES'},
  {value: 'MM', label: 'MILIMETRO'},
  {value: 'MM2', label: 'MILIMETRO CUADRADO'},
  {value: 'MM3', label: 'MILIMETRO CUBICO'},
  {value: 'MU', label: 'MUESTRAS'},
  {value: 'MWH', label: 'MEGAWATT HORA'},
  {value: 'OZ', label: 'ONZAS'},
  {value: 'PAI', label: 'PAILAS'},
  {value: 'PAL', label: 'PALETAS'},
  {value: 'PAQ', label: 'PAQUETE'},
  {value: 'PL', label: 'PLACAS'},
  {value: 'PLC', label: 'PLANCHAS'},
  {value: 'PLG', label: 'PLIEGO'},
  {value: 'PS', label: 'PIES'},
  {value: 'PS2', label: 'PIES CUADRADOS'},
  {value: 'PS3', label: 'PIES CUBICOS'},
  {value: 'PST', label: 'PIES TABLARES(MADERA)'},
  {value: 'PUL', label: 'PULGADAS'},
  {value: 'PZA', label: 'PIEZAS'},
  {value: 'QQ', label: 'QUINTAL METRICO (100 KG)'},
  {value: 'QUT', label: 'QUINTAL USA (100 LB)'},
  {value: 'RAM', label: 'RAMOS'},
  {value: 'RES', label: 'RESMA'},
  {value: 'ROL', label: 'ROLLOS'},
  {value: 'SAC', label: 'SACO'},
  {value: 'SET', label: 'SET'},
  {value: 'TAM', label: 'TAMBOR'},
  {value: 'TC', label: 'TONELADA CORTA'},
  {value: 'TCS', label: 'TONELADA CORTA SECA'},
  {value: 'TIR', label: 'TIRAS'},
  {value: 'TL', label: 'TONELADA LARGA'},
  {value: 'TLS', label: 'TONELADA LARGA SECA'},
  {value: 'TM', label: 'TONELADAS'},
  {value: 'TM3', label: 'TONELADA CUBICA'},
  {value: 'TMS', label: 'TONELADA METRICA SECA'},
  {value: 'TUB', label: 'TUBOS'},
  {value: 'U', label: 'UNIDAD'},
  {value: 'U 3', label: 'UNIDAD POR 10**3'},
  {value: 'U 6', label: 'UNIDAD PO 10**6'},
  {value: 'U2', label: 'CIENTO DE UNIDADES'},
  {value: 'U3', label: 'MILES DE UNIDADES'},
  {value: 'U6', label: 'MILLON DE UNIDADES'},
  {value: 'YD', label: 'YARDA'},
  {value: 'YD2', label: 'YARDA CUADRADA'},
];
