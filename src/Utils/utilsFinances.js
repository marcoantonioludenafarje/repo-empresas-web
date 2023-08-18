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
  {
    "value": "NIU",
    "label": "BIEN"
  },
  {
    "value": "ZZ",
    "label": "SERVICIO"
  },
  {
    "value": "BX",
    "label": "CAJA"
  },
  {
    "value": "PK",
    "label": "PAQUETE"
  },
  {
    "value": "BE",
    "label": "FARDO"
  },
  {
    "value": "SA",
    "label": "SACO"
  },
  {
    "value": "BG",
    "label": "BOLSA"
  },
  {
    "value": "BO",
    "label": "BOTELLAS"
  },
  {
    "value": "CA",
    "label": "LATAS"
  },
  {
    "value": "DZN",
    "label": "DOCENA"
  },
  {
    "value": "MLL",
    "label": "MILLARES"
  },
  {
    "value": "GRM",
    "label": "GRAMO"
  },
  {
    "value": "KGM",
    "label": "KILOGRAMO"
  },
  {
    "value": "TNE",
    "label": "TONELADAS"
  },
  {
    "value": "MLT",
    "label": "MILILITRO"
  }
];
